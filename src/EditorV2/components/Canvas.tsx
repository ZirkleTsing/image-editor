import React from 'react'
import cls from 'classnames'
import { observer } from "mobx-react-lite"
import { useEditor } from '../context'
import { useCurrentWorkSpace } from '../hooks'
import { default as ClipBox } from './ClipBox'
import type { ImageFile } from '../models'

type ImageProps = {
  image: ImageFile
}

const Image: React.FC<ImageProps> = observer((props) => {
  const { image } = props

  if (!image.loaded) {
    return null
  }

  return (
    <img className='image-editor__img' onDragStart={(e) => e.preventDefault()} src={image.content || ''} />
  )
})

const WorkSpace = observer(() => {
  const { containerStyle, className, editor } = useEditor()
  const workspace = useCurrentWorkSpace()

  console.log('editor.', editor.current)
  return (
    <div className={cls('image-editor', className)} style={containerStyle}>
      <Image image={editor.current.file} />
      {workspace.clips?.map(clip => {
        return (
          <ClipBox key={clip.id} clip={clip} />
        )
      })}
    </div>
  )
})

export default WorkSpace