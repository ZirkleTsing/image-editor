import React, { useMemo, useEffect } from 'react'
import { ImageEditorContext } from './ImageEditorContext'
import { WorkSpace } from './Workspace'
import { Editor } from '../models'

type ImageEditorV2Props = {
  images: string[]
  containerStyle?: React.CSSProperties
  className?: string
}

const ImageEditorV2: React.FC<ImageEditorV2Props> = (props) => {
  const { images, containerStyle, className } = props
  
  const editor = useMemo(() => {
    return new Editor({ files: images, ref: '.image-editor' })
  }, [])

  useEffect(() => {
    return editor.effect()
  })
  
  return (
    <ImageEditorContext.Provider value={{ editor, containerStyle, className }}>
      <WorkSpace />
    </ImageEditorContext.Provider>
  )
}

export default ImageEditorV2