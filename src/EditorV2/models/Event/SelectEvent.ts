import { makeObservable, observable, action, computed } from 'mobx';
import { WorkSpace, Editor } from '..'

type SelectEventProps = {}

/**
 * 支持框选批量选择
 */
class SelectEvent {
  show: boolean = false
  startX: number = 0
  startY: number = 0
  endX: number = 0
  endY: number = 0
  screenLeft: number = 0
  screenTop: number = 0
  workspace: WorkSpace
  editor: Editor

  constructor(props: SelectEventProps, workspace: WorkSpace, editor: Editor) {
    this.workspace = workspace
    this.editor = editor
    makeObservable(this, {
      show: observable,
      startX: observable,
      startY: observable,
      endX: observable,
      endY: observable,
      workspace: observable,
      editor: observable,
      screenLeft: observable,
      screenTop: observable,
      left: computed,
      top: computed,
      width: computed,
      height: computed,
      handleMouseDown: action,
      handleMouseMove: action,
      handleMouseUp: action,
      reset: action
    })
  }

  get left() {
    return Math.min(this.startX, this.endX) - this.screenLeft;
  }

  get top() {
    return Math.min(this.startY, this.endY) - this.screenTop
  }

  get width() {
    return Math.abs(this.endX - this.startX)
  }
  get height() {
    return Math.abs(this.endY - this.startY)
  }

    /* 方法 */
  handleMouseDown = (event: MouseEvent) => {
    this.show = true;
    console.log(event.clientX, event.clientY, event.pageX, event.pageY)
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.endX = event.clientX;
    this.endY = event.clientY;
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  }
  handleMouseMove = (event: MouseEvent) => {
    this.endX = event.clientX;
    this.endY = event.clientY;
  }
  handleMouseUp = () => {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
    this.show = false;
    this.reset()
  }

  reset() {
    this.startX = 0
    this.startY = 0
    this.endX = 0
    this.endY = 0
  }

  attach() {
    if (this.editor.container) {
      this.screenLeft = this.editor.container.getBoundingClientRect().left;
      this.screenTop = this.editor.container.getBoundingClientRect().top;
      this.editor.container.addEventListener('mousedown', this.handleMouseDown)
      return () => {
        if (this.editor.container) {
          this.editor.container.removeEventListener('mousedown', this.handleMouseDown)
        }
      }
    }
  }
}

export default SelectEvent