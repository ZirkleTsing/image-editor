import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import { observer } from "mobx-react-lite"
import { Editor } from '../models'
import { AnchorManager } from './AnchorManager'
import { ImageEditorContext } from './ImageEditorContext'
import cls from 'classnames'

import type { AnchorType } from '../types'

export interface ImageEditorProps<Extra = any> {
  style: React.CSSProperties
  className?: string
  config: {
    anchors: Omit<AnchorType<Extra>, 'uuid'>[]
    imageUrl: string
    anchorUrl?: string
  },
  renderItem?: (context: {
    extra: Extra
    imageUrl: string
    anchorUrl?: string
  }) => JSX.Element
}

export const ImageEditor: <T>(props: PropsWithChildren<ImageEditorProps<T>>) => JSX.Element
  = observer((props) => {
    const ref = useRef<HTMLDivElement | null>(null)
    const [editor, setEditorInstance] = useState<Editor>(undefined as unknown as Editor)
    useEffect(() => {
      console.log({
        anchorUrl: 'https://i.328888.xyz/2022/12/18/4M5St.png',
        ...props.config,
      })
      const editor = Editor.create(ref.current as HTMLElement, {
        anchorUrl: 'https://i.328888.xyz/2022/12/18/4M5St.png',
        ...props.config,
      })
      setEditorInstance(editor)
      return editor.effect()
    }, [])
    
    return (
      <ImageEditorContext.Provider value={{ editor, renderItem: props.renderItem }}>
        <div
          ref={ref}
          className={cls('image-anchor-editor', props.className)}
        >
          <AnchorManager />
        </div>
      </ImageEditorContext.Provider>
    )
  })