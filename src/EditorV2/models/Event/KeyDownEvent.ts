import { makeObservable, action } from 'mobx'
import Subscriable from './Subscriable'

type KeyDownEventHandler = (payload: KeyboardEvent) => any;
class KeyDownEvent extends Subscriable<KeyDownEventHandler> {
  constructor() {
    super()
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
    return () => {
      document.removeEventListener('keydown', this.handleKeyDown);
    };
  }
}

export default KeyDownEvent