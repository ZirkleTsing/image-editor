import { makeObservable, action } from 'mobx'
import Subscriable, { Event } from './Subscriable'
import { Editor } from '..';

type KeyUpEventHandler = (payload: KeyboardEvent) => any;
class KeyUpEvent extends Subscriable<KeyUpEventHandler> implements Event {
  editor: Editor;
  constructor(editor: Editor) {
    super()
    this.editor = editor
    makeObservable(this, {
      handleKeyUp: action,
      attach: action,
      detach: action
    })
  }
  handleKeyUp = (event: KeyboardEvent) => {
    this.dispatch(event)
  }

  attach = () => {
    document.addEventListener('keyup', this.handleKeyUp);
  }

  detach = () => {
    document.removeEventListener('keyup', this.handleKeyUp);
  }
}

export default KeyUpEvent