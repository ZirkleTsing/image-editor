import { makeObservable, observable, action, computed } from 'mobx';
import { ImageFile, Editor, Clip } from '.'
import { generateUuid } from '../shared'
import type { IClipProps } from './Clip'

type ImageFiles = File | string;

interface WorkSpaceProps {
  file: ImageFiles
  position?: IClipProps['position'] 
}

class WorkSpace {
  file: ImageFile;
  editor: Editor
  clip: Clip
  id: string

  constructor(props: WorkSpaceProps, editor: Editor) {
    this.file = new ImageFile({ file: props.file }, editor)
    this.clip = new Clip({ position: props.position }, editor)
    this.editor = editor
    this.id = generateUuid()
    makeObservable(this, {
      file: observable,
      editor: observable,
      id: observable
    })
  }
}

export default WorkSpace