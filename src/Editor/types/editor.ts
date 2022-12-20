import { AnchorType } from './Anchor'

export interface IEditorProps {
  domRef: HTMLElement
  anchors: AnchorType[]// dot实例的参数
  imageUrl: string // 编辑器图片
  anchorUrl?: string // 图钉图片素材
}

export type EditorFactory = {
  anchors: Omit<AnchorType, 'uuid'>[]
  imageUrl: IEditorProps['imageUrl']
  anchorUrl?: IEditorProps['anchorUrl']
}