import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import { observer } from "mobx-react-lite"
import { Editor } from '../models'
import { AnchorManager } from './AnchorManager'
import { ImageEditorContext } from './ImageEditorContext'
import cls from 'classnames'

import type { IChangeValue, Position } from '../types'

export interface ImageEditorProps<Extra = any, Target = any> {
  /**
   * @description anchors 初始锚点配置 imageUrl 图片url地址 anchorUrl 锚点url地址
   */
  config: {
    anchors: Array<{
      uuid?: string // 唯一id
      position: Position // 画布坐标
      extra: Extra // 业务数据
    }>
    imageUrl: string
    anchorUrl?: string
  },
  /**
   * @description 图片容器style
   */
  style?: React.CSSProperties
  /**
   * @description 图片容器宽度 优先级低于style
   */
  width?: React.CSSProperties['width']
  /**
   * @description 图片容器高度 优先级低于style
   */
  height?: React.CSSProperties['height']
   /**
   * @description 图片容器className
   */
  className?: string
  /**
   * @description 锚点容器className
   */
  anchorClassName?: string
  /**
   * @description 锚点容器style
   */
  anchorStyle?: React.CSSProperties
  /**
   * @description 拖拽结束时触发
   * @param value 
   * @returns 
   */
  onChange?: (value: IChangeValue<Extra>) => void
  /**
   * 拖拽开始
   */
  onDragStart?: (id: string) => void
  /**
   * @description 拖拽开始时触发
   * @param id 拖拽的锚点id
   * @returns 
   */
  onDragEnd?: (id: string) => void
  /**
   * @description 锚点被选中时触发
   * @param id 被选中的锚点id
   * @returns 
   */
  onSelect?: (id: string) => void
  /**
   * @description 自定义锚点元素
   * @param context extra是业务逻辑数据，active是否被选中
   * @returns 
   */
  renderItem?: (context: {
    extra: Extra
    imageUrl: string
    anchorUrl?: string
    active: boolean
  }) => JSX.Element
  ref?: React.MutableRefObject<Target>
  /**
   * @description 事件管理的代理对象，默认是画布Editor
   */
  root?: HTMLElement
}

export const ImageEditor: <T>(props: PropsWithChildren<ImageEditorProps<T>>, ref?: React.MutableRefObject<any>) => JSX.Element
  = observer((props, ref) => {
    const { onChange, onDragStart, onDragEnd, onSelect, renderItem, anchorClassName, anchorStyle, root } = props
    const containerRef = useRef<HTMLDivElement>(null)
    const [editor, setEditorInstance] = useState<Editor>(undefined as unknown as Editor)
    useEffect(() => {
      const editor = Editor.create(containerRef.current as HTMLElement, {
        anchorUrl: 'https://img.alicdn.com/imgextra/i1/O1CN01QZC5lz288ky8Wx98Q_!!6000000007888-2-tps-200-200.png',
        ...props.config,
        onChange,
        onDragStart,
        onDragEnd,
        onSelect,
        root
      })
      setEditorInstance(editor)
      if (ref) {
        ref.current = editor
      }

      return editor.effect()
    }, [])
    
    return (
      <ImageEditorContext.Provider value={{ editor, renderItem, anchorClassName, anchorStyle }}>
        <div
          ref={containerRef}
          style={{ width: props.width, height: props.height, ...props.style }}
          className={cls('image-anchor-editor', props.className)}
        >
          <AnchorManager />
        </div>
      </ImageEditorContext.Provider>
    )
  }, { forwardRef: true })