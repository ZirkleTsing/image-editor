import { computed, makeObservable, observable, action } from 'mobx';
import { ClipBox, Editor, ImageFile } from '.';
import { isElementsOverlap } from '../internal';
import { generateUuid } from '../shared';
import type { IClipBoxProps } from './ClipBox';

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
      select: action,
      check: action
    });
  }

  get isResizing() {
    return this.draggingType === 'Resizer' && this.isDragging
  }

  get currentClip() {
    return this.clips.find((clip) => clip.id === this.activeClipId);
  }

  isElementOverlap(target: ClipBox) {
    const otherClip = this.clips.filter((clip) => clip !== target);

    return otherClip.reduce((isOverlap, clip) => {
      return (
        isOverlap || isElementsOverlap(target.container as HTMLElement, clip.container as HTMLDivElement)
      );
    }, false);
  }

  select(id: string) {
    this.activeClipId = id
  }

  check() {
    this.clips.forEach((clip) => {
      clip.isClipOverlap()
    })
  }
}

export default WorkSpace;
