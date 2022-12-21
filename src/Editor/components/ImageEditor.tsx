import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import { observer } from "mobx-react-lite"
import { Editor } from '../models'
import { AnchorManager } from './AnchorManager'
import { ImageEditorContext } from './ImageEditorContext'
import cls from 'classnames'

import type { AnchorType, IChangeValue } from '../types'

export interface ImageEditorProps<Extra = any> {
  style: React.CSSProperties
  className?: string
  config: {
    anchors: Omit<AnchorType<Extra>, 'uuid'>[]
    imageUrl: string
    anchorUrl?: string
  },
  onChange?: (value: IChangeValue<Extra>) => void
  onDragStart?: (id: string) => void
  onDragEnd?: (id: string) => void
  onSelect?: (id: string) => void
  renderItem?: (context: {
    extra: Extra
    imageUrl: string
    anchorUrl?: string
    active: boolean // 当前锚点是否被选中
  }) => JSX.Element
}

export const ImageEditor: <T>(props: PropsWithChildren<ImageEditorProps<T>>, ref?: React.MutableRefObject<any>) => JSX.Element
  = observer((props, ref) => {
    const { onChange, onDragStart, onDragEnd, onSelect, renderItem } = props
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [editor, setEditorInstance] = useState<Editor>(undefined as unknown as Editor)
    useEffect(() => {
      const editor = Editor.create(containerRef.current as HTMLElement, {
        anchorUrl: 'https://img.alicdn.com/imgextra/i1/O1CN01QZC5lz288ky8Wx98Q_!!6000000007888-2-tps-200-200.png',
        ...props.config,
        onChange,
        onDragStart,
        onDragEnd,
        onSelect
      })
      setEditorInstance(editor)
      if (ref) {
        ref.current = editor
      }

      return editor.effect()
    }, [])
    
    return (
      <ImageEditorContext.Provider value={{ editor, renderItem }}>
        <div
          ref={containerRef}
          className={cls('image-anchor-editor', props.className)}
        >
          <AnchorManager />
        </div>
      </ImageEditorContext.Provider>
    )
  }, { forwardRef: true })