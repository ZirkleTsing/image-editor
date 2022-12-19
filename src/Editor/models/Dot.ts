import { makeObservable, observable } from 'mobx'
import type { DotType, Position, IEditorProps } from '../types'
import { Editor } from './Editor';

/**
 * Dot 图钉功能
 * 1. 图钉dotUrl,
 * 2. 坐标(x,y),
 * 
 */

export class Dot {
  private position: Position
  offsetLeft: number
  offsetTop: number
  uuid: string
  dotUrl?: string
  editor: Editor
  ref: HTMLElement | null = null
  width = 0
  height = 0
  constructor(props: DotType, editor: Editor) {
    this.position = props.position
    this.uuid = props.uuid
    this.offsetLeft = this.position.x
    this.offsetTop = this.position.y
    this.dotUrl = editor.dotUrl
    this.editor = editor
    makeObservable(this, {
      offsetLeft: observable,
      offsetTop: observable,
      uuid: observable
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
    console.log(this.offsetLeft + x, this.offsetTop + y)
    this.offsetLeft = Math.max(Math.min(this.offsetLeft + x, this.editor.width - this.width), 0)
    this.offsetTop = Math.max(Math.min(this.offsetTop + y, this.editor.height - this.height), 0)
  }

  static create(dots: IEditorProps['dots'], editor: Editor): Dot[] {
    return dots?.map(dot => {
      return new Dot(dot, editor)
    })
  }
}