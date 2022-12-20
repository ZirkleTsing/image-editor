import React, { useContext } from 'react';
import type { Editor } from '../models'
import type { ImageEditorProps } from './ImageEditor'

interface IEditorContext {
  editor: Editor
  renderItem?: ImageEditorProps['renderItem']
}

export const ImageEditorContext = React.createContext<IEditorContext>({} as IEditorContext)
export const useEditor = () => useContext(ImageEditorContext)