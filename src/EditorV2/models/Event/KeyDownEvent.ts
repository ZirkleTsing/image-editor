import { makeObservable, action } from 'mobx'
import Subscriable from './Subscriable'
import { Editor } from '..';

type KeyDownEventHandler = (payload: KeyboardEvent) => any;
class KeyDownEvent extends Subscriable<KeyDownEventHandler> {
  editor: Editor;
  constructor(editor: Editor) {
    super()
    this.editor = editor
    makeObservable(this, {
      handleKeyDown: action,
      attach: action
    })
  }
  handleKeyDown = (event: KeyboardEvent) => {
    this.dispatch(event)
  }
  
  attach() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  detach() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }
  
}

export default KeyDownEvent