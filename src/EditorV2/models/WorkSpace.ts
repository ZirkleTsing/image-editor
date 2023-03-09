import { makeObservable, observable, computed } from 'mobx';
import { ImageFile, Editor, Clip } from '.'
import { generateUuid } from '../shared'
import type { IClipProps } from './Clip'

type ImageFiles = File | string;

export interface WorkSpaceProps {
  file: ImageFiles
  positions?: Array<IClipProps['position']> 
}

class WorkSpace {
  file: ImageFile;
  editor: Editor
  clips: Clip[] = []
  id: string
  activeClipId: string = ''

  constructor(props: WorkSpaceProps, editor: Editor) {
    this.file = new ImageFile({ file: props.file }, editor)
    this.clips = props.positions?.map(position => new Clip({ position }, editor)) || []
    this.editor = editor
    this.id = generateUuid()
    if (this.clips.length > 0) {
      this.activeClipId = this.clips[0].id
    }
    makeObservable(this, {
      file: observable,
      editor: observable,
      clips: observable,
      id: observable,
      activeClipId: observable,
      currentClip: computed,
    })
  }

  get currentClip() {
    return this.clips.find(clip => clip.id === this.activeClipId)
  }
}

export default WorkSpace