import { makeObservable, observable, action } from 'mobx';
import { ImageFile } from '.';

type ImageFiles = File[] | string[];
// type Size = {
//   swidth?: number;
//   sheight?: number;
//   sx?: number;
//   sy?: number;
// };

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

  constructor(props: EditorProps) {
    this.files = props.files.map((file) => new ImageFile({ file }, this));
    this.ref = props.ref
    makeObservable(this, {
      files: observable,
      container: observable,
      width: observable,
      height: observable
    });
  }

  effect() {
    const container = document.querySelectorAll(this.ref)?.[0] as HTMLDivElement
    this.container = container
    const rect = this.container.getBoundingClientRect()
    this.width = rect.width - 40
    this.height = rect.height - 40
  }

}

export default Editor;
