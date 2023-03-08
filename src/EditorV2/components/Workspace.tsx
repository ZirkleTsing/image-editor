import React from 'react'
import { observer } from "mobx-react-lite"
import { useEditor } from '.'
import type { ImageFile } from '../models'

type ImageProps = {
  image: ImageFile
}


const Image: React.FC<ImageProps> = observer((props) => {
  const { image } = props

  if (!image?.loaded) {
    return (
      <div>loading</div>
    )
  }

  return (
    <img className='image-editor__img' onDragStart={(e) => e.preventDefault()} src={image.content || ''} />
  )
})

// 画布
export const WorkSpace: React.FC= observer(() => {
  const { editor } = useEditor()
  const image = editor?.files?.[0]
  console.log('image:',image)
  return (
    <div className='image-editor'>
      <Image image={editor?.files[0]} />
    </div>
  )
})

