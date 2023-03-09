import React from 'react'
import cls from 'classnames'
import { observer } from "mobx-react-lite"
import { useEditor } from '.'
import type { ImageFile } from '../models'

type ImageProps = {
  image: ImageFile
}

const Image: React.FC<ImageProps> = observer((props) => {
  const { image } = props

  if (!image.loaded) {
    return (
      <div>loading</div>
    )
  }

  return (
    <img className='image-editor__img' onDragStart={(e) => e.preventDefault()} src={image.content || ''} />
  )
})

{/* <Image image={editor.files[0]} /> */}
const Canvas = observer(() => {
  const { containerStyle, className, editor } = useEditor()
  console.log('editor.', editor.current)
  return (
    <div className={cls('image-editor', className)} style={containerStyle}>
      <Image image={editor.current} />
    </div>
  )
})

export default Canvas