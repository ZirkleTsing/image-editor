import { generate } from 'short-uuid'
import { makeObservable, observable, computed, action, toJS } from 'mobx'
import { Anchor } from './Anchor'
import { calcOffset } from '../shared'
import type { IEditorProps, EditorFactory, Position, IChangeValue, AnchorType } from '../types'

/**
 * Editor 功能
 * 1. 初始化 DONE
 *  - 背景图片 imgUrl DONE
 *    -- dom尺寸 DONE
 *  - 图片尺寸裁减居中 DONE
 *  - 图钉生成的初始坐标，不能重叠 TODO
 * 2. 创建图钉实例 DONE
 * 3. 删除图钉实例 DONE
 * 4. 变更图钉实例 DONE
 * 5. 管理拖拽状态，正在拖拽的实例 DONE
 * 6. 图钉的事件管理 DONE
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
  private ref: HTMLElement
  width: number
  height: number
  imgUrl: string
  anchorUrl?: string
  pageX: number
  pageY: number
  onAnchorDragging = false
  draggingTarget = ''
  anchors: Anchor<Extra>[] 
  initialAnchors: AnchorType<Extra>[] // 画布初始的锚点配置
  activeAnchor = '' // 当前选中的锚点
  onChange?: (value: IChangeValue<Extra>) => void
  onDragStart?: (id: string) => void
  onDragEnd?: (id: string) => void
  onSelect?: (id: string) => void
  startPosition: Position = {
    x: 0,
    y: 0
  }

  constructor(props: IEditorProps<Extra>) {
    this.ref = props.domRef
    this.width = props.domRef.offsetWidth
    this.height = props.domRef.offsetHeight
    const rect = props.domRef.getBoundingClientRect()
    this.pageX = rect.left
    this.pageY = rect.top
    this.imgUrl = props.imageUrl
    this.anchorUrl = props.anchorUrl
    this.initialAnchors = toJS(props.anchors)
    this.onChange = props.onChange
    this.onDragStart = props.onDragStart
    this.onDragEnd = props.onDragEnd
    this.onSelect = props.onSelect
    this.init()
    this.anchors = Anchor.create(props.anchors, this)
    
    makeObservable(this, {
      anchors: observable,
      onAnchorDragging: observable,
      draggingTarget: observable,
      activeAnchor: observable,
      anchorMeta: computed,
      context: computed,
      startPosition: observable.struct,
      updatePosition: action,
      createAnchor: action,
      deleteAnchor: action
    })
  }

  private init = () => {
    this.ref.style.backgroundImage = `url('${this.imgUrl}')`
  }

  effect = () => {
    const onMouseUp = () => {
      this.draggingTarget = ''
      this.onAnchorDragging = false
      this.onChange?.(this.context)
    }
    const onMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      if (this.onAnchorDragging) {
        const id = this.draggingTarget
        let offsetPosition = calcOffset(e, this);
        this.updatePosition(id, { x: offsetPosition.x, y: offsetPosition.y });
      }
    }

    this.ref.addEventListener('mouseup', onMouseUp)
    this.ref.addEventListener('mousemove', onMouseMove)
    return () => {
      this.ref.removeEventListener('mouseup', onMouseUp)
      this.ref.removeEventListener('mousemove', onMouseMove)
    }
  }

  get anchorMeta() {
    return this.anchors?.map(anchor => {
      return {
        left: anchor.offsetLeft,
        top: anchor.offsetTop,
        id: anchor.uuid,
        extra: anchor.extra,
        effect: anchor.effect
      }
    })
  }
  
  get context() {
    return {
      anchors: this.anchors.map(anchor => {
        return {
          uuid: anchor.id,
          position: anchor.position,
          extra: anchor.extra
        }
      })
    }
  }

  updatePosition = (id: string, position: Position) => {
    const anchor = this.anchors.find(anchor => {
      return anchor.id === id
    })!
    anchor.updatePosition(position)
  }

  deleteAnchor = (id: string) => {
    const index = this.anchors.findIndex(anchor => anchor.id === id)
    this.anchors.splice(index, 1)
  }

  createAnchor = (config: Omit<AnchorType<Extra>, 'uuid'>) => {
    const anchor = new Anchor({
      ...config,
      uuid: generate()
    }, this)
    this.anchors.push(anchor)
  }
  
  static create = <Extra = any>(ref: HTMLElement, props: EditorFactory<Extra>): Editor => {
    return new Editor({
      domRef: ref,
      ...props,
      anchors: props.anchors?.map(anchor => {
        return {
          ...anchor,
          uuid: generate()
        }
      })
    })
  }
}