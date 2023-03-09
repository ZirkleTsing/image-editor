import { makeObservable, observable, action, computed } from 'mobx';
import { ImageFile } from '.';

type ImageFiles = File[] | string[];

interface EditorProps {
  files: ImageFiles;
  ref: string
}

class Editor {
  files: ImageFile[] = [];
  ref: string
  container: HTMLDivElement | null = null
  width: number = 0
  height: number = 0
  activeId: string

  constructor(props: EditorProps) {
    this.files = props.files.map((file) => new ImageFile({ file }, this));
    this.ref = props.ref
    this.activeId = this.files[0]?.id
    makeObservable(this, {
      files: observable,
      container: observable,
      width: observable,
      height: observable,
      activeId: observable,
      current: computed,
      effect: action,
      select: action
    });
  }

  effect() {
    const container = document.querySelectorAll(this.ref)?.[0] as HTMLDivElement
    this.container = container
    const rect = this.container.getBoundingClientRect()
    this.width = rect.width - 40
    this.height = rect.height - 40
  }

  select(id: string) {
    this.activeId = id
  }

  get current() {
    return this.files.find(file => file.id === this.activeId) as ImageFile
  }

}

export default Editor;
