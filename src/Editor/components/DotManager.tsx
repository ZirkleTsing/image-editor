import React, { useEffect } from 'react';
import { observer } from "mobx-react-lite"
import { useEditor } from './ImageEditorContext'
import { useDrag } from '../hooks'

interface IDot {
  position: {
    top: number,
    left: number
  }
  id: string,
  effect: any
}

const Dot: React.FC<IDot> = (props) => {
  const { editor } = useEditor()
  const { position, id, ...others } = props
  const ref = useDrag(id)
  const dotUrl = editor.dotUrl

  useEffect(() => {
    return props.effect()
  }, [])

  return (
    <div
      ref={ref}
      className="image-anchor-editor__dot"
      data-image-anchor-id={id}
      style={{
        position: 'absolute',
        left: position.left,
        top: position.top,
        backgroundImage: `url('${dotUrl}')`
      }}
      {...others}
    />
  )
}

export const DotManager: React.FC = observer(() => {
  const { editor } = useEditor()
  if (!editor) {
    return null
  }

  return (
    <div>
      {editor.dotMeta.map(meta => {
        return (
          <Dot
            key={meta.id}
            position={{ left: meta.left, top: meta.top }}
            {...meta}
          />
        )
      })}
    </div>
  )
})