import { action, computed, makeObservable, observable } from 'mobx';
import { ClipBox, Editor, ImageFile, SelectEventPayload } from '.';
import { isElementsOverlap, isElementsInArea } from '../internal';
import { generateUuid } from '../shared';
import type { IClipBoxProps } from './ClipBox';

type ImageFiles = File | string;

const KeyBoard = {
  LEFT: 'ArrowLeft',
  UP: 'ArrowUp',
  RIGHT: 'ArrowRight',
  DOWN: 'ArrowDown',
} as const;

export interface WorkSpaceProps {
  file: ImageFiles;
  positions?: Array<IClipBoxProps['position']>;
}

class WorkSpace {
  file: ImageFile;
  editor: Editor;
  clips: ClipBox[] = [];
  id: string;
  activeClipId: string[] = [];
  isDragging: boolean = false;
  draggingTarget: any = null;
  draggingType: 'ClipBox' | 'Resizer' | (string & {}) = '';
  // select 框选模式 normal 常规模式
  mode: 'select' | 'normal' | (string & {}) = 'normal'

  constructor(props: WorkSpaceProps, editor: Editor) {
    this.file = new ImageFile({ file: props.file }, editor);
    this.clips =
      props.positions?.map(
        (position, index) => new ClipBox({ position, index }, editor, this),
      ) || [];
    this.editor = editor;
    this.id = generateUuid();
    if (this.clips.length > 0) {
      this.activeClipId = [this.clips[0].id];
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
      mode: observable,
      currentClip: computed,
      isResizing: computed,
      isElementOverlap: action,
      selectClipBoxInArea: action,
      select: action,
      // 批量选择
      batchSelect: action,
      handleKeyPress: action,
      handleKeyUp: action,
      checkOverlap: action,
      addClip: action,
      deleteClip: action,
    });
  }

  get isResizing() {
    return this.draggingType === 'Resizer' && this.isDragging;
  }

  get currentClip() {
    return this.clips.filter((clip) => this.activeClipId.includes(clip.id));
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

  // 找到当期工作区框选出来的dom
  selectClipBoxInArea(payload: SelectEventPayload): Array<ClipBox> {
    return this.clips.reduce<Array<ClipBox>>((buf, clip) => {
      if (isElementsInArea(clip.container as HTMLElement, this.editor.container as HTMLElement, payload, )) {
        return buf.concat(clip)
      } else {
        return buf
      }
    }, [])
  }

  select(id: string | string[]) {
    if (Array.isArray(id)) {
      this.activeClipId = id
    } else {
      this.activeClipId = [id];
    }
  }

  batchSelect = (payload: SelectEventPayload) => {
    const selected = this.selectClipBoxInArea(payload)
    this.activeClipId = selected.map(clip => clip.id)
  }

  // 检查元素是否重叠
  checkOverlap() {
    this.clips.forEach((clip) => {
      clip.isClipOverlap();
    });
  }

  addClip() {
    const newClipBox = new ClipBox(
      {
        position: { left: 20, top: 20, width: 100, height: 100 },
        index: this.clips.length,
      },
      this.editor,
      this,
    );
    this.clips.push(newClipBox);
    this.activeClipId = [newClipBox.id];
  }

  deleteClip() {
    this.clips = this.clips.reduce<Array<ClipBox>>((buf, clip) => {
      if (this.currentClip.includes(clip)) {
        return buf
      } else {
        return buf.concat(clip)
      }
    }, [])
    if (this.clips.length) {
      this.activeClipId = [this.clips[0].id];
    }
  }

  handleKeyPress = (e: KeyboardEvent) => {
    const keyCode = e.code;
    if (this.activeClipId && this.currentClip.length > 0) {
      switch (keyCode) {
        case KeyBoard.LEFT: {
          e.preventDefault();
          this.currentClip.forEach(clip => {
            clip.left = clip.left - 3
          })
          break;
        }
        case KeyBoard.UP: {
          e.preventDefault();
          this.currentClip.forEach(clip => {
            clip.top = clip.top - 3
          })
          break;
        }
        case KeyBoard.RIGHT: {
          e.preventDefault();
          this.currentClip.forEach(clip => {
            clip.left = clip.left + 3
          })
          break;
        }
        case KeyBoard.DOWN: {
          e.preventDefault();
          this.currentClip.forEach(clip => {
            clip.top = clip.top + 3
          })
          break;
        }
        default: {
          return;
        }
      }
    }
  }

  handleKeyUp = (e: KeyboardEvent) => {
    const keyCode = e.code;
    if (this.activeClipId.length && this.currentClip) {
      switch (keyCode) {
        case KeyBoard.LEFT:
        case KeyBoard.UP:
        case KeyBoard.RIGHT:
        case KeyBoard.DOWN: {
          this.checkOverlap();
        }
        default: {
          break;
        }
      }
    }
  }
}

export default WorkSpace;