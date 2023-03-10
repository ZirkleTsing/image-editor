import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import cls from 'classnames';
import type { ClipBox } from '../models';

interface IClipBoxProps {
  clip: ClipBox;
}

export default observer<IClipBoxProps>((props) => {
  const { clip } = props

  useEffect(() => {
    const containerDispose = clip.attachContainer()
    const resizerDisposeList = clip.attachResizer()
    return () => {
      containerDispose()
      resizerDisposeList.forEach(dispose => dispose())
    }
  }, [])

  return (
    <div
      className={cls("image-editor__clip", `clip-${clip.id}`)}
      style={{
        width: Number(clip.width),
        height: Number(clip.height),
        top: Number(clip.top),
        left: Number(clip.left),
      }}
    >
      <div className={cls("image-editor__clip__leftTop", `clip-resizer-leftTop-${clip.id}`)} />
      <div className={cls("image-editor__clip__rightTop", `clip-resizer-rightTop-${clip.id}`)} />
      <div className={cls("image-editor__clip__leftBottom", `clip-resizer-leftBottom-${clip.id}`)} />
      <div className={cls("image-editor__clip__rightBottom", `clip-resizer-rightBottom-${clip.id}`)} />
      <div className={cls("image-editor__clip__leftCenter", `clip-resizer-leftCenter-${clip.id}`)} />
      <div className={cls("image-editor__clip__rightCenter", `clip-resizer-rightCenter-${clip.id}`)} />
      <div className={cls("image-editor__clip__topCenter", `clip-resizer-topCenter-${clip.id}`)} />
      <div className={cls("image-editor__clip__bottomCenter", `clip-resizer-bottomCenter-${clip.id}`)} />
    </div>
  );
})
