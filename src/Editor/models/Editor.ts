import { action, computed, makeObservable, observable, toJS } from 'mobx';
import { generate } from 'short-uuid';
import { calcOffset, formatNum } from '../shared';
import type {
  AnchorType,
  EditorFactory,
  IChangeValue,
  IEditorProps,
  Position,
} from '../types';
import { Anchor } from './Anchor';

/**
 * Editor实体
 * 1. 初始化 DONE
 *  - 背景图片 imgUrl DONE
 *    -- dom尺寸初始化计算 DONE
 *  - 图片尺寸裁减居中 DONE
 *  - 图钉生成的初始坐标，不能重叠 TODO
 * 2. 创建图钉实例 DONE
 * 3. 删除图钉实例 DONE
 * 4. 变更图钉实例 DONE
 * 5. 管理拖拽状态，正在拖拽的实例 DONE
 * 6. 画布的事件管理 DONE
 *      -- 选中节点
 *      -- 开始拖拽
 *      -- 拖拽中
 *      -- 拖拽结束
 *      -- 上报信息
 *  == 工厂方法 ==
 *  生成 Editor 的方法 imageEditor.create(ref, {}) DONE
 *    -- anchor uuid的工厂函数 DONE
 *
 */

export class Editor<Extra = any> {
  private ref: HTMLElement;
  width: number;
  height: number;
  imgUrl: string;
  anchorUrl?: string;
  pageX: number;
  pageY: number;
  onAnchorDragging = false;
  draggingTarget = '';
  anchors: Anchor<Extra>[];
  initialAnchors: AnchorType<Extra>[]; // 画布初始的锚点配置
  activeAnchor = ''; // 当前选中的锚点
  onChange?: (value: IChangeValue<Extra>) => void;
  onDragStart?: (id: string) => void;
  onDragEnd?: (id: string) => void;
  onSelect?: (id: string) => void;
  startPosition: Position = {
    x: 0,
    y: 0,
  };
  root?: HTMLElement;

  constructor(props: IEditorProps<Extra>) {
    this.ref = props.domRef;
    this.width = props.domRef.clientWidth; // 不包含border的宽度
    this.height = props.domRef.clientHeight; // 不包含border的宽度
    this.root = props.root;
    const rect = props.domRef.getBoundingClientRect();
    this.pageX = rect.left;
    this.pageY = rect.top;
    this.imgUrl = props.imageUrl;
    this.anchorUrl = props.anchorUrl;
    this.initialAnchors = toJS(props.anchors);
    this.onChange = props.onChange;
    this.onDragStart = props.onDragStart;
    this.onDragEnd = props.onDragEnd;
    this.onSelect = props.onSelect;
    this.init();
    this.anchors = Anchor.create(props.anchors, this);

    makeObservable(this, {
      anchors: observable,
      onAnchorDragging: observable,
      draggingTarget: observable,
      activeAnchor: observable,
      anchorMeta: computed,
      context: computed,
      startPosition: observable.struct,
      updateAnchorPosition: action,
      createAnchor: action,
      upsertAnchor: action,
      deleteAnchor: action,
    });
  }

  private init = () => {
    this.ref.style.backgroundImage = `url('${this.imgUrl}')`;
  };

  get anchorMeta() {
    return this.anchors?.map((anchor) => {
      return {
        left: anchor.offsetLeft,
        top: anchor.offsetTop,
        id: anchor.uuid,
        extra: anchor.extra,
        effect: anchor.effect,
      };
    });
  }

  get context() {
    return {
      anchors: this.anchors.map((anchor) => {
        const { width, height } = this
        return {
          uuid: anchor.id,
          position: {
            x: Number(formatNum(String(anchor.offsetLeft / width))),
            y: Number(formatNum(String(anchor.offsetTop / height))),
          },
          extra: anchor.extra,
        };
      }),
    };
  }

  get editorCenterPosition() {
    return {
      x: this.width / 2,
      y: this.height / 2
    }
  }

  updateAnchorPosition = (id: string, position: Position) => {
    const anchor = this.anchors.find((anchor) => {
      return anchor.id === id;
    })!;
    anchor.updatePosition(position);
  };

  createAnchor = (config: Omit<AnchorType<Extra>, 'uuid'> & Partial<Pick<AnchorType<Extra>, 'uuid'>>) => {
    const anchor = new Anchor(
      {
        ...config,
        uuid: config.uuid ?? generate(),
      },
      this,
    );
    this.anchors.push(anchor);
    this.onChange?.(this.context)
  };

  upsertAnchor = (id: string, extra: Extra, position?: Position) => {
    // update or insert
    const index = this.anchors.findIndex((anchor) => anchor.id === id);
    if (index < 0) {
      // 没找到区创建
      this.createAnchor({
        uuid: id,
        position: position ?? this.createAnchorPosition(),
        extra
      })
    } else {
      // 找到了去更新
      this.anchors[index].extra = extra;
    }
    this.onChange?.(this.context)
  };

  deleteAnchor = (id: string) => {
    const index = this.anchors.findIndex((anchor) => anchor.id === id);
    if (index !== -1) {
      this.anchors.splice(index, 1);
      this.onChange?.(this.context)
    }
  };

  clearAnchor = () => {
    this.anchors = []
    this.onChange?.(this.context)
  }

  updateBackgroundImage = (url: string) => {
    this.ref.style.backgroundImage = `url('${url}')`
    this.imgUrl = url
  }

  effect = () => {
    const ref = this.root ?? this.ref;
    const onMouseUp = () => {
      this.draggingTarget = '';
      this.onAnchorDragging = false;
      this.onChange?.(this.context);
    };
    const onMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      if (this.onAnchorDragging) {
        const id = this.draggingTarget;
        let offsetPosition = calcOffset(e, this);
        this.updateAnchorPosition(id, { x: offsetPosition.x, y: offsetPosition.y });
      }
    };

    ref.addEventListener('mouseup', onMouseUp);
    ref.addEventListener('mousemove', onMouseMove);
    return () => {
      ref.removeEventListener('mouseup', onMouseUp);
      ref.removeEventListener('mousemove', onMouseMove);
    };
  };

  createAnchorPosition = (position?: Position): Position => {
    const { editorCenterPosition } = this;
    const current = position ?? { x: editorCenterPosition.x, y: editorCenterPosition.y };
    // 新增anchor，初始位置是否在已经存在的锚点区块内，在则继续往下找位置，不在取当前位置
    const isContain = this.anchors.reduce((buf, anchor) => {
      const { width, height, offsetLeft, offsetTop } = anchor;
      if (
        current.x >= offsetLeft &&
        current.x <= offsetLeft + width + 10 && // 10 是随便给的 这里不太精确
        current.y >= offsetTop &&
        current.y <= offsetTop + height + 10
      ) {
        return buf || true;
      }
      return buf || false;
    }, false);
    if (!isContain) {
      return {
        x: Number(formatNum(String((current.x - 30) / this.width))),
        y: Number(formatNum(String((current.y - 30) / this.height))),
      };
    } else {
      return this.createAnchorPosition({
        x: current.x,
        y: current.y + 40,
      });
    }
  }

  static create = <Extra = any>(
    ref: HTMLElement,
    props: EditorFactory<Extra>,
  ): Editor<Extra> => {
    return new Editor<Extra>({
      domRef: ref,
      ...props,
      anchors: props.anchors?.reduce<AnchorType<Extra>[]>((buf, anchor) => {
        const { position } = anchor;
        if (
          ['', 0].includes((position as any)?.x) ||
          ['', 0].includes((position as any)?.y)
        ) {
          return buf;
        } else {
          return buf.concat({
            ...anchor,
            uuid: anchor.uuid ?? generate(),
          });
        }
      }, []),
    });
  };
}
