import React, { useContext } from 'react'
import type { Editor } from  '../models'

interface IEditorContext {
  editor: Editor
}

export const ImageEditorContext = React.createContext<IEditorContext>({} as IEditorContext)
export const useEditor = () => useContext(ImageEditorContext)