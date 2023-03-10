import React, { useMemo, useEffect } from 'react'
import { ImageEditorContext } from '../context'
import { observer } from "mobx-react-lite"
import { default as Toolbar } from './Toolbar'
import { default as WorkSpace } from './Canvas'
import { Editor } from '../models'
import type { IClipBoxProps } from '../models/ClipBox'

type ImageEditorV2Props = {
  images: string[]
  containerStyle?: React.CSSProperties
  className?: string
  positions?: Array<IClipBoxProps['position']>
}

const ImageEditorV2: React.FC<ImageEditorV2Props> = observer((props) => {
  const { images, containerStyle, className, positions } = props
  
  const editor = useMemo(() => {
    return new Editor({ files: images, ref: '.image-editor', positions })
  }, [])

  useEffect(() => {
    return editor.attach()
  })
  
  return (
    <ImageEditorContext.Provider value={{ editor, containerStyle, className }}>
      <Toolbar />
      <WorkSpace />
    </ImageEditorContext.Provider>
  )
})

export default ImageEditorV2