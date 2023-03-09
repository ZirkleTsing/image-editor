import { makeObservable, observable, action, computed } from 'mobx';
import { ImageFile, Editor } from '.'
import { generateUuid } from '../shared'

type ImageFiles = File | string;

interface WorkSpaceProps {
  file: ImageFiles
}

class WorkSpace {
  file: ImageFile;
  editor: Editor
  id: string

  constructor(props: WorkSpaceProps, editor: Editor) {
    this.file = new ImageFile({ file: props.file }, editor)
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