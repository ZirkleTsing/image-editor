import React, { useEffect, useRef, useState } from 'react'
import { observer } from "mobx-react-lite"
import { Editor } from '../models'
import { DotManager } from './DotManager'
import { ImageEditorContext } from './ImageEditorContext'
import cls from 'classnames'

import type { DotType } from '../types'

interface ImageEditorProps {
  style: React.CSSProperties
  className?: string
  config: {
    dots: Pick<DotType, 'position'>[]
    imageUrl: string
    dotUrl?: string
  } 
}

export const ImageEditor: React.FC<ImageEditorProps> = observer((props) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [editor, setEditorInstance] = useState<Editor>(undefined as unknown as Editor)
  useEffect(() => {
    const editor = Editor.create(ref.current as HTMLElement, {
      dotUrl: 'https://i.328888.xyz/2022/12/18/4M5St.png',
      ...props.config,
    })
    setEditorInstance(editor)
    return editor.effect()
  }, [])
  
  return (
    <ImageEditorContext.Provider value={{ editor }}>
      <div
        ref={ref}
        className={cls('image-anchor-editor', props.className)}
      >
        <DotManager />
      </div>
    </ImageEditorContext.Provider>
  )
})