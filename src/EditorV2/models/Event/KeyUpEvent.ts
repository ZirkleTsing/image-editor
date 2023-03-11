import { makeObservable, action } from 'mobx'
import Subscriable from './Subscriable'

type KeyUpEventHandler = (payload: KeyboardEvent) => any;
class KeyUpEvent extends Subscriable<KeyUpEventHandler> {
  constructor() {
    super()
    makeObservable(this, {
      handleKeyUp: action,
      attach: action
    })
  }
  handleKeyUp = (event: KeyboardEvent) => {
    this.dispatch(event)
  }
  attach() {
    document.addEventListener('keyup', this.handleKeyUp);
    return () => {
      document.removeEventListener('keyup', this.handleKeyUp);
    };
  }
}

export default KeyUpEvent