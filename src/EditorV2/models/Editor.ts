import { makeObservable, observable, action, computed } from 'mobx';
import { WorkSpace } from '.';

type ImageFiles = File[] | string[];

interface EditorProps {
  files: ImageFiles;
  ref: string
}

class Editor {
  ref: string
  container: HTMLDivElement | null = null
  width: number = 0
  height: number = 0
  workspaces: Array<WorkSpace>
  activeId: string
  constructor(props: EditorProps) {
    this.workspaces = props.files.map((file) => new WorkSpace({ file }, this))
    console.log('this:', this.workspaces)
    this.ref = props.ref
    this.activeId = this.workspaces.length > 0 ? this.workspaces[0].id : ''
    makeObservable(this, {
      workspaces: observable,
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
    console.log('点击:', id)
    this.activeId = id
  }

  get current() {
    console.log('变化')
    return this.workspaces.find(workSpace => workSpace.id === this.activeId) as WorkSpace
  }

}

export default Editor;
