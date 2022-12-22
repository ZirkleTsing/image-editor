import React, { useEffect } from 'react';
import { observer } from "mobx-react-lite"
import cls from 'classnames'
import { useEditor } from './ImageEditorContext'
import { useDrag } from '../hooks'

interface IAnchor {
  position: {
    top: number
    left: number
  }
  id: string
  extra: any,
  effect: any
}

const Anchor: React.FC<IAnchor> = observer((props) => {
  const { editor, renderItem, anchorClassName, anchorStyle } = useEditor()
  const { position, id, extra, effect, ...others } = props
  const ref = useDrag(id)
  const anchorUrl = editor.anchorUrl
  const active = editor.activeAnchor === id
  useEffect(() => {
    return effect()
  }, [])

  return (
    <div
      ref={ref}
      className={cls("image-anchor-editor__anchor", anchorClassName, { default: !renderItem, active: !renderItem && active })}
      data-image-anchor-id={id}
      style={{
        position: 'absolute',
        left: position.left,
        top: position.top,
        backgroundImage: renderItem ? undefined : `url('${anchorUrl}')`,
        ...anchorStyle
      }}
      {...others}
    >
      {renderItem?.({ imageUrl: editor.imgUrl, anchorUrl: editor.anchorUrl, extra, active })}
    </div>
  )
})


export const AnchorManager: React.FC = observer(() => {
  const { editor } = useEditor()
  if (!editor) {
    return null
  }

  return (
    <div>
      {editor.anchorMeta.map(anchor => {
        return (
          <Anchor
            key={anchor.id}
            position={{ left: anchor.left, top: anchor.top }}
            {...anchor}
          />
        )
      })}
    </div>
  )
})