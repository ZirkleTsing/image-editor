import { makeObservable, observable, action } from 'mobx'
import type { AnchorType, Position, IEditorProps } from '../types'
import { Editor } from './Editor';

/**
 * Dot 图钉功能
 * 1. 图钉dotUrl,
 * 2. 坐标(x,y),
 * 
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
    this.offsetLeft = this.position.x
    this.offsetTop = this.position.y
    this.anchorUrl = editor.anchorUrl
    this.extra = props.extra
    this.editor = editor
    makeObservable(this, {
      offsetLeft: observable,
      offsetTop: observable,
      uuid: observable,
      updatePosition: action
    })
  }

  get id() {
    return this.uuid
  }

  effect = () => {
    this.ref = document.querySelector(`[data-image-anchor-id="${this.uuid}"]`)!
    this.width = this.ref.offsetWidth
    this.height = this.ref.offsetHeight
  }

  updatePosition = (offset: Position) => {
    const { x, y } = offset
    this.offsetLeft = Math.max(Math.min(this.offsetLeft + x, this.editor.width - this.width), 0)
    this.offsetTop = Math.max(Math.min(this.offsetTop + y, this.editor.height - this.height), 0)
    this.position.x = this.offsetLeft
    this.position.y = this.offsetTop
  }

  static create(anchors: IEditorProps['anchors'], editor: Editor): Anchor[] {
    return anchors?.map(anchor => {
      return new Anchor(anchor, editor)
    })
  }
}