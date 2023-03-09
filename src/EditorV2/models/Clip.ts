import { makeObservable, observable, action, computed } from 'mobx';
import { generateUuid } from '../shared'
import { Editor } from '.'

export interface IClipProps {
  position?: {
    left: string
    top: string
    width: string
    height: string
  }
}

class Clip {
  clipLeft: string = '0'
  clipTop: string = '0'
  clipWidth: string = '100'
  clipHeight: string = '100'
  editor: Editor
  id: string

  constructor(props: IClipProps, editor: Editor) {
    this.editor = editor
    this.id = generateUuid()
    this.initialize(props)
    
    makeObservable(this, {
      clipLeft: observable,
      clipTop: observable,
      clipWidth: observable,
      clipHeight: observable,
      editor: observable,
      id: observable,
      left: computed,
      top: computed,
      height: computed,
      width: computed
    })

  }
  
  private initialize(props: IClipProps) {
    const { position } = props
    if (position) {
      this.left = position.left
      this.top = position.top
      this.height = position.height
      this.width = position.width
    }
  }

  set left(left: string) {
    this.clipLeft = left
  }

  get left() {
    return this.clipLeft
  }

  set top(top: string) {
    this.clipTop = top
  }

  get top() {
    return this.clipTop
  }

  set height(height: string) {
    this.clipHeight = height
  }

  get height() {
    return this.clipHeight
  }

  set width(width: string) {
    this.clipWidth = width
  }

  get width() {
    return this.clipWidth
  }
}

export default Clip