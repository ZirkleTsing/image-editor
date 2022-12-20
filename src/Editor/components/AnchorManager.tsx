import React, { useEffect } from 'react';
import { observer } from "mobx-react-lite"
import { useEditor } from './ImageEditorContext'
import { useDrag } from '../hooks'

interface IAnchor {
  position: {
    top: number,
    left: number
  }
  id: string,
  effect: any
}

const Anchor: React.FC<IAnchor> = (props) => {
  const { editor } = useEditor()
  const { position, id, ...others } = props
  const ref = useDrag(id)
  const anchorUrl = editor.anchorUrl

  useEffect(() => {
    return props.effect()
  }, [])

  return (
    <div
      ref={ref}
      className="image-anchor-editor__anchor"
      data-image-anchor-id={id}
      style={{
        position: 'absolute',
        left: position.left,
        top: position.top,
        backgroundImage: `url('${anchorUrl}')`
      }}
      {...others}
    />
  )
}

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