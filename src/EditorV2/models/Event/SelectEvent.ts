import { action, computed, makeObservable, observable } from 'mobx';
import { Editor } from '..';
import Subscriable, { Event } from './Subscriable';

export type SelectEventPayload = {
  left: number;

  top: number;
  width: number;
  height: number;
};
export type SelectEventHandler = (payload: SelectEventPayload) => any;

/**
 * 支持框选批量选择
 */
class SelectEvent extends Subscriable<SelectEventHandler> implements Event {
  show: boolean = false;
  startX: number = 0;
  startY: number = 0;
  endX: number = 0;
  endY: number = 0;
  screenLeft: number = 0;
  screenTop: number = 0;
  scrollLeft: number = 0
  scrollTop: number = 0;
  editor: Editor;

  constructor(editor: Editor) {
    super();
    this.editor = editor;
    makeObservable(this, {
      show: observable,
      startX: observable,
      startY: observable,
      endX: observable,
      endY: observable,
      editor: observable,
      screenLeft: observable,
      screenTop: observable,
      left: computed,
      top: computed,
      width: computed,
      height: computed,
      isSelectMode: computed,
      handleMouseDown: action,
      handleMouseMove: action,
      handleMouseUp: action,
      reset: action,
      attach: action,
      detach: action
    });
  }

  get left() {
    return Math.min(this.startX, this.endX) - this.screenLeft;
  }

  get top() {
    return Math.min(this.startY, this.endY) - this.screenTop;
  }

  get width() {
    return Math.abs(this.endX - this.startX);
  }
  get height() {
    return Math.abs(this.endY - this.startY);
  }

  get isSelectMode() {
    return this.editor.current.mode === 'select'
  }

  /* 方法 */
  handleMouseDown = (event: MouseEvent) => {
    console.log(window.scrollY)
    if (this.isSelectMode) {
      this.show = true;
      this.startX = event.clientX;
      this.startY = event.clientY;
      this.endX = event.clientX;
      this.endY = event.clientY;
      document.addEventListener('mousemove', this.handleMouseMove);
      document.addEventListener('mouseup', this.handleMouseUp);
    }
  };
  
  handleMouseMove = (event: MouseEvent) => {
    if (this.isSelectMode) {
      this.endX = event.clientX;
      this.endY = event.clientY;
    }
  };
  
  handleMouseUp = () => {
    if (this.isSelectMode) {
      this.dispatch({
        left: this.left,
        top: this.top,
        width: this.width,
        height: this.height,
      });
      this.show = false;
      this.reset();
      document.removeEventListener('mousemove', this.handleMouseMove);
      document.removeEventListener('mouseup', this.handleMouseUp);
    }
  };

  reset() {
    this.startX = 0;
    this.startY = 0;
    this.endX = 0;
    this.endY = 0;
  }

  attach = () => {
    if (this.editor.container) {
      this.screenLeft = this.editor.container.getBoundingClientRect().left
      this.screenTop = this.editor.container.getBoundingClientRect().top
      this.editor.container.addEventListener('mousedown', this.handleMouseDown);
    }
  }

  detach = () => {
    if (this.editor.container) {
      this.editor.container.removeEventListener(
        'mousedown',
        this.handleMouseDown,
      );
    }
  }
}

export default SelectEvent;
