import React, { useMemo, useEffect } from 'react'
import { ImageEditorContext } from './ImageEditorContext'
import { WorkSpace } from './Workspace'
import { Editor } from '../models'
import type { IClipProps } from '../models/Clip'

type ImageEditorV2Props = {
  images: string[]
  containerStyle?: React.CSSProperties
  className?: string
  positions?: Array<IClipProps['position']>
}

const ImageEditorV2: React.FC<ImageEditorV2Props> = (props) => {
  const { images, containerStyle, className, positions } = props
  
  const editor = useMemo(() => {
    return new Editor({ files: images, ref: '.image-editor', positions })
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