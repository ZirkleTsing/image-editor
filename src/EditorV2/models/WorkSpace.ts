import { action, computed, makeObservable, observable } from 'mobx';
import WorkspaceElement from './Element';
import { ClipBox, Anchor, Editor, ImageFile, SelectEventPayload } from '.';
import { isElementsOverlap, isElementsInArea } from '../internal';
import { generateUuid } from '../shared';

type ImageFiles = File | string;

const KeyBoard = {
  LEFT: 'ArrowLeft',
  UP: 'ArrowUp',
  RIGHT: 'ArrowRight',
  DOWN: 'ArrowDown',
  Backspace: 'Backspace',
} as const;

export interface WorkSpaceProps {
  file: ImageFiles;
  configs: Array<{
    type: 'CLIP' | 'ANCHOR',
    position: {
      left: number;
      top: number;
      width: number;
      height: number;
    }
  }>
}

class WorkSpace {
  file: ImageFile;
  editor: Editor;
  elements: Array<WorkspaceElement> = [];
  id: string;
  activeId: string[] = [];
  isDragging: boolean = false;
  draggingTarget: any = null;
  draggingType: 'ClipBox' | 'Anchor' | 'Resizer' | (string & {}) = '';
  // select 框选模式 normal 常规模式
  mode: 'select' | 'normal' | (string & {}) = 'normal'

  constructor(props: WorkSpaceProps, editor: Editor) {
    this.file = new ImageFile({ file: props.file }, editor);
    this.elements =
      props.configs?.map(
        (config, index) => {
          switch(config.type) {
            case 'CLIP': {
              return new ClipBox({ position: config.position, index }, editor, this)
            }
            case 'ANCHOR': {
              return new Anchor({ position: config.position, index }, editor, this)
            }
            default: {
              return new ClipBox({ position: config.position, index }, editor, this)
            }
          }
          
        },
      ) || [];
    this.editor = editor;
    this.id = generateUuid();
    if (this.elements.length > 0) {
      this.activeId = [this.elements[0].id]; // TODO
    }
    makeObservable(this, {
      file: observable,
      editor: observable,
      elements: observable,
      id: observable,
      activeId: observable,
      isDragging: observable,
      draggingType: observable,
      draggingTarget: observable,
      mode: observable,
      current: computed,
      isResizing: computed,
      isElementOverlap: action,
      select: action,
      // 批量选择
      batchSelect: action,
      handleKeyPress: action,
      handleKeyUp: action,
      checkOverlapElement: action,
      add: action,
      delete: action,
    });
  }

  get isResizing() {
    return this.draggingType === 'Resizer' && this.isDragging;
  }

  get current() {
    return this.elements.filter((element) => this.activeId.includes(element.id));
  }

  isElementOverlap(target: WorkspaceElement) {
    const otherElements = this.elements.filter((element) => element !== target);
    return otherElements.reduce((isOverlap, element) => {
      return (
        isOverlap ||
        isElementsOverlap(
          target.container as HTMLElement,
          element.container as HTMLDivElement,
        )
      );
    }, false);
  }

  // 检查元素是否重叠
  checkOverlapElement() {
    this.elements.forEach((element) => {
      element.checkOverlap();
    });
  }
  
  // 单选选中元素
  select(id: string | string[]) {
    if (Array.isArray(id)) {
      this.activeId = id
    } else {
      this.activeId = [id];
    }
  }

  // 框选区域批量选中元素
  batchSelect = (batchSelectionArea: SelectEventPayload) => {
    const selected = this.elements.reduce<Array<WorkspaceElement>>((buf, element) => {
      // 找到当期工作区框选出来的dom
      if (isElementsInArea(element.container as HTMLElement, this.editor.container as HTMLElement, batchSelectionArea)) {
        return buf.concat(element)
      } else {
        return buf
      }
    }, [])
    if (selected.length > 0) { // 没有框选出目标的话 不设置值 保留现状
      this.activeId = selected.map(element => element.id)
    }
  }

  add(type = 'ClipBox') {
    if (type === 'ClipBox') {
      const newClipBox = new ClipBox(
        {
          position: { left: 20, top: 20, width: 100, height: 100 },
          index: this.elements.length,
        },
        this.editor,
        this,
      );
      this.elements.push(newClipBox);
      this.activeId = [newClipBox.id];
    }
  }

  delete() {
    this.elements = this.elements.reduce<Array<WorkspaceElement>>((buf, element) => {
      if (this.current.includes(element)) {
        return buf
      } else {
        return buf.concat(element)
      }
    }, [])
    if (this.elements.length) {
      this.activeId = [this.elements[0].id];
    }
  }

  handleKeyPress = (e: KeyboardEvent) => {
    const keyCode = e.code;
    if (e.target === document.body) {
      e.stopPropagation();
      e.preventDefault();
      if (this.activeId && this.current.length > 0) {
        switch (keyCode) {
          case KeyBoard.LEFT: {
            this.current.forEach(element => {
              element.left = element.left - 3
            })
            break;
          }
          case KeyBoard.UP: {
            this.current.forEach(element => {
              element.top = element.top - 3
            })
            break;
          }
          case KeyBoard.RIGHT: {
            this.current.forEach(element => {
              element.left = element.left + 3
            })
            break;
          }
          case KeyBoard.DOWN: {
            this.current.forEach(element => {
              element.top = element.top + 3
            })
            break;
          }
          case KeyBoard.Backspace: {
            this.delete()
            break;
          }
          default: {
            return;
          }
        }
      }
    }
  }

  handleKeyUp = (e: KeyboardEvent) => {
    const keyCode = e.code;
    if (this.activeId.length && this.current) {
      switch (keyCode) {
        case KeyBoard.LEFT:
        case KeyBoard.UP:
        case KeyBoard.RIGHT:
        case KeyBoard.DOWN: {
          this.checkOverlapElement();
        }
        default: {
          break;
        }
      }
    }
  }
}

export default WorkSpace;