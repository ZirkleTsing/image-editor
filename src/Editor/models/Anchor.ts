import { makeObservable, observable, action } from 'mobx'
import type { AnchorType, Position, IEditorProps } from '../types'
import { Editor } from './Editor';

/**
 * 锚点实体
 * 1. 图钉事件管理
 * 2. 更新坐标
 * 3. 更新业务数据
 * 4. 上报数据
 */

export class Anchor<Extra = any> {
  position: Position
  offsetLeft: number
  offsetTop: number
  uuid: string
  anchorUrl?: string
  editor: Editor
  ref: HTMLElement | null = null
  extra: Extra
  width = 0
  height = 0
  constructor(props: AnchorType, editor: Editor) {
    this.position = props.position
    this.uuid = props.uuid
    this.offsetLeft = parseInt(String(this.position.x * editor.width))
    this.offsetTop =  parseInt(String(this.position.y * editor.height))
    this.anchorUrl = editor.anchorUrl
    this.extra = props.extra
    this.editor = editor
    makeObservable(this, {
      offsetLeft: observable,
      offsetTop: observable,
      extra: observable.struct,
      uuid: observable,
      updatePosition: action
    })
  }

  get id() {
    return this.uuid
  }

  updatePosition = (offset: Position) => {
    const { x, y } = offset
    this.offsetLeft = Math.max(Math.min(this.offsetLeft + x, this.editor.width - this.width), 0)
    this.offsetTop = Math.max(Math.min(this.offsetTop + y, this.editor.height - this.height), 0)
    // this.position.x = this.offsetLeft
    // this.position.y = this.offsetTop
  }

  effect = (ref: HTMLDivElement, id: string) => {
    this.ref = ref
    this.width = this.ref.offsetWidth
    this.height = this.ref.offsetHeight
    const editor = this.editor
    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      editor.onAnchorDragging = true;
      editor.draggingTarget = id;
      editor.startPosition = {
        x: e.pageX,
        y: e.pageY,
      };
      
      editor.onDragStart?.(id)
      if (editor.activeAnchor !== id) {
        editor.onSelect?.(id)
        editor.activeAnchor = id
      }
    }

    // 这里删掉 挪到Editor进行管理，拖拽更丝滑
    // const onMouseMove = (e: MouseEvent) => {
    //   e.preventDefault();
    //   if (editor.onAnchorDragging && editor.draggingTarget === id) {
    //     let offsetPosition = calcOffset(e, editor);
    //     editor.updatePosition(id, { x: offsetPosition.x, y: offsetPosition.y });
    //   }
    // }

    const onMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      editor.onAnchorDragging = false;
      editor.draggingTarget = '';

      editor.onDragEnd?.(id)
    }

    this.ref.addEventListener('mousedown', onMouseDown);
    // ref.addEventListener('mousemove', onMouseMove);
    this.ref.addEventListener('mouseup', onMouseUp);

    return () => {
      this.ref?.removeEventListener('mousedown', onMouseDown)
      // ref?.removeEventListener('mousemove', onMouseMove)
      this.ref?.removeEventListener('mouseup', onMouseUp)
    }
  }

  static create(anchors: IEditorProps['anchors'], editor: Editor): Anchor[] {
    return anchors?.map(anchor => {
      return new Anchor(anchor, editor)
    })
  }
}