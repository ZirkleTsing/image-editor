import { action, computed, makeObservable, observable } from 'mobx';
import { ClipBox, Editor, ImageFile } from '.';
import { isElementsOverlap } from '../internal';
import { generateUuid } from '../shared';
import type { IClipBoxProps } from './ClipBox';

const KeyBoard = {
  LEFT: 'ArrowLeft',
  UP: 'ArrowUp',
  RIGHT: 'ArrowRight',
  DOWN: 'ArrowDown',
} as const;
type ImageFiles = File | string;

export interface WorkSpaceProps {
  file: ImageFiles;
  positions?: Array<IClipBoxProps['position']>;
}

class WorkSpace {
  file: ImageFile;
  editor: Editor;
  clips: ClipBox[] = [];
  id: string;
  activeClipId: string = '';
  isDragging: boolean = false;
  draggingTarget: any = null;
  draggingType: 'ClipBox' | 'Resizer' | (string & {}) = '';

  constructor(props: WorkSpaceProps, editor: Editor) {
    this.file = new ImageFile({ file: props.file }, editor);
    this.clips =
      props.positions?.map(
        (position, index) => new ClipBox({ position, index }, editor, this),
      ) || [];
    this.editor = editor;
    this.id = generateUuid();
    if (this.clips.length > 0) {
      this.activeClipId = this.clips[0].id;
    }
    makeObservable(this, {
      file: observable,
      editor: observable,
      clips: observable,
      id: observable,
      activeClipId: observable,
      isDragging: observable,
      draggingType: observable,
      draggingTarget: observable,
      currentClip: computed,
      isResizing: computed,
      isElementOverlap: action,
      attach: action,
      select: action,
      check: action,
      onKeyPress: action,
      addClip: action,
      deleteClip: action
    });
  }

  get isResizing() {
    return this.draggingType === 'Resizer' && this.isDragging;
  }

  get currentClip() {
    return this.clips.find((clip) => clip.id === this.activeClipId);
  }

  isElementOverlap(target: ClipBox) {
    const otherClip = this.clips.filter((clip) => clip !== target);

    return otherClip.reduce((isOverlap, clip) => {
      return (
        isOverlap ||
        isElementsOverlap(
          target.container as HTMLElement,
          clip.container as HTMLDivElement,
        )
      );
    }, false);
  }

  select(id: string) {
    this.activeClipId = id;
  }

  check() {
    this.clips.forEach((clip) => {
      clip.isClipOverlap();
    });
  }

  addClip() {
    const newClipBox = new ClipBox({ position: { left: 20, top: 20, width: 100, height: 100 }, index: this.clips.length}, this.editor, this)
    this.clips.push(newClipBox)
    this.activeClipId = newClipBox.id
  }

  deleteClip() {
    this.clips.splice(this.clips.indexOf(this.currentClip as ClipBox), 1)
    if (this.clips.length) {
      this.activeClipId = this.clips[0].id
    }
  }

  onKeyPress = (e: KeyboardEvent) => {
    const keyCode = e.code;
    if (this.activeClipId && this.currentClip) {
      switch (keyCode) {
        case KeyBoard.LEFT: {
          e.preventDefault()
          this.currentClip.left = this.currentClip.left - 3
          // this.isDragging = true
          // this.draggingTarget = this.currentClip
          // this.draggingType = 'ClipBox'
          break;
        }
        case KeyBoard.UP: {
          e.preventDefault()
          this.currentClip.top = this.currentClip.top - 3
          // this.isDragging = true
          // this.draggingTarget = this.currentClip
          // this.draggingType = 'ClipBox'
          break;
        }
        case KeyBoard.RIGHT: {
          e.preventDefault()
          this.currentClip.left = this.currentClip.left + 3
          // this.isDragging = true
          // this.draggingTarget = this.currentClip
          // this.draggingType = 'ClipBox'
          break;
        }
        case KeyBoard.DOWN: {
          e.preventDefault()
          this.currentClip.top = this.currentClip.top + 3
          // this.isDragging = true
          // this.draggingTarget = this.currentClip
          // this.draggingType = 'ClipBox'
          break;
        }
        default: {
          return;
        }
      }
    }
  }

  onKeyUp = (e: KeyboardEvent) => {
    const keyCode = e.code
    if (this.activeClipId && this.currentClip) {
      switch(keyCode) {
        case KeyBoard.LEFT: 
        case KeyBoard.UP: 
        case KeyBoard.RIGHT: 
        case KeyBoard.DOWN: {
          this.check()
          // this.isDragging = false
          // this.draggingTarget = null
          // this.draggingType = ''
        }
        default: {
          break;
        }
      }
    }
  }

  attach() {
    document.addEventListener('keydown', this.onKeyPress);
    document.addEventListener('keyup', this.onKeyUp)
    return () => {
      document.removeEventListener('keydown', this.onKeyPress);
      document.removeEventListener('keyup', this.onKeyUp);
    };
  }
}

export default WorkSpace;
