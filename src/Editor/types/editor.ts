import { DotType } from './dot'

export interface IEditorProps {
  domRef: HTMLElement
  dots: DotType[]// dot实例的参数
  imageUrl: string // 编辑器图片
  dotUrl?: string // 图钉图片素材
}

export type EditorFactory = {
  dots: Pick<DotType, 'position'>[]
  imageUrl: IEditorProps['imageUrl']
  dotUrl?: IEditorProps['dotUrl']
}