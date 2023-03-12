import { makeObservable, action } from 'mobx'
import Subscriable from './Subscriable'
import { Editor } from '..';

class MouseDown extends Subscriable {
  editor: Editor;
  constructor(editor: Editor) {
    super()
    this.editor = editor
    makeObservable(this, {
      handleMouseDown: action,
      attach: action,
      detach: action
    })
  }

  handleMouseDown = (event: MouseEvent) => {
    this.dispatch(event)
  }

  attach = () => {
    document.addEventListener('mousedown', this.handleMouseDown);
  }

  detach = () => {
    document.removeEventListener('mousedown', this.handleMouseDown)
  }
}

export default MouseDown