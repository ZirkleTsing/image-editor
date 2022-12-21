import { AnchorType, Position } from './Anchor'

export interface IEditorProps<Extra = any> {
  domRef: HTMLElement
  anchors: AnchorType<Extra>[]// dot实例的参数
  imageUrl: string // 编辑器图片
  anchorUrl?: string // 图钉图片素材
  onChange?: (value: IChangeValue<Extra>) => void
  onDragStart?: (id: string) => void
  onDragEnd?: (id: string) => void
  onSelect?: (id: string) => void
}

export type EditorFactory<Extra = any> = {
  anchors: Omit<AnchorType<Extra>, 'uuid'>[]
  imageUrl: IEditorProps['imageUrl']
  anchorUrl?: IEditorProps['anchorUrl']
  onChange?: (value: IChangeValue) => void
  onDragStart?: (id: string) => void
  onDragEnd?: (id: string) => void
  onSelect?: (id: string) => void
}

export interface IChangeValue<E = any> {
  anchors: {
    uuid: string
    position: Position
    extra: E
  }[]
}