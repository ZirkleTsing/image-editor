import type { DotType, Position, IEditorProps } from '../types'
import type { Editor } from './Editor'

/**
 * Dot 图钉功能
 * 1. 图钉dotUrl,
 * 2. 坐标(x,y),
 * 
 */

export class Dot {
  private position: Position
  offsetLeft: number
  offsetRight: number
  uuid: string
  constructor(props: DotType, editor: Editor) {
    this.position = props.position
    this.uuid = props.uuid
    console.log('dot:', props, editor)
    this.offsetLeft = this.position.x
    this.offsetRight = this.position.y
  }

  static create(dots: IEditorProps['dots'], editor: Editor): Dot[] {
    return dots?.map(dot => {
      return new Dot(dot, editor)
    })
  }
}