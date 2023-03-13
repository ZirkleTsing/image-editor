import { makeObservable, action } from 'mobx'
import Subscriable, { Event } from './Subscriable'
import { Editor } from '..';

type KeyDownEventHandler = (payload: KeyboardEvent) => any;
class KeyDownEvent extends Subscriable<KeyDownEventHandler> implements Event {
  editor: Editor;
  constructor(editor: Editor) {
    super()
    this.editor = editor
    makeObservable(this, {
      handleKeyDown: action,
      attach: action,
      detach: action
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