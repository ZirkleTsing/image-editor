abstract class WorkspaceElement {
  abstract type: string
  abstract id: string
  abstract container: HTMLElement | null
  abstract top: number
  abstract left: number
  abstract width: number
  abstract height: number
  abstract checkOverlap: () => void
}

export default WorkspaceElement