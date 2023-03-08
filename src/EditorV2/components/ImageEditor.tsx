import React, { useMemo, useEffect } from 'react'
import { ImageEditorContext } from './ImageEditorContext'
import { WorkSpace } from './Workspace'
import { Editor } from '../models'

type ImageEditorV2Props = {
  images: string[]
}

const ImageEditorV2: React.FC<ImageEditorV2Props> = (props) => {
  const { images } = props
  
  const editor = useMemo(() => {
    return new Editor({ files: images, ref: '.image-editor' })
  }, [])

  useEffect(() => {
    return editor.effect()
  })
  
  return (
    <ImageEditorContext.Provider value={{ editor }}>
      <WorkSpace />
    </ImageEditorContext.Provider>
  )
}

export default ImageEditorV2