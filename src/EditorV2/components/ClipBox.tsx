import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import cls from 'classnames';
import type { ClipBox } from '../models';
import { useCurrentWorkSpace } from '../hooks'

interface IClipBoxProps {
  clip: ClipBox;
}

export default observer<IClipBoxProps>((props) => {
  const { clip } = props
  const worspace = useCurrentWorkSpace()

  useEffect(() => {
    const containerDispose = clip.attachContainer()
    const resizerDisposeList = clip.attachResizer()
    return () => {
      containerDispose()
      resizerDisposeList.forEach(dispose => dispose())
    }
  }, [clip])

  return (
    <div
      className={cls("image-editor__clip", `clip-${clip.id}`, {
        overlap: clip.isOverlap,
        active: clip.id === worspace.activeClipId,
        resizing: worspace.isResizing && clip.id === worspace.activeClipId,
        moving: worspace.isDragging && worspace.draggingType === 'ClipBox' && clip.id === worspace.activeClipId,
      })}
      style={{
        width: Number(clip.width),
        height: Number(clip.height),
        top: Number(clip.top),
        left: Number(clip.left),
      }}
      onClick={() => { worspace.select(clip.id) }}
    >
      <div className={cls("image-editor__clip-content")}>{clip.index}</div>
      <div className={cls("image-editor__clip-item", "image-editor__clip__leftTop", `clip-resizer-leftTop-${clip.id}`)} />
      <div className={cls("image-editor__clip-item", "image-editor__clip__rightTop", `clip-resizer-rightTop-${clip.id}`)} />
      <div className={cls("image-editor__clip-item", "image-editor__clip__leftBottom", `clip-resizer-leftBottom-${clip.id}`)} />
      <div className={cls("image-editor__clip-item", "image-editor__clip__rightBottom", `clip-resizer-rightBottom-${clip.id}`)} />
      <div className={cls("image-editor__clip-item", "image-editor__clip__leftCenter", `clip-resizer-leftCenter-${clip.id}`)} />
      <div className={cls("image-editor__clip-item", "image-editor__clip__rightCenter", `clip-resizer-rightCenter-${clip.id}`)} />
      <div className={cls("image-editor__clip-item", "image-editor__clip__topCenter", `clip-resizer-topCenter-${clip.id}`)} />
      <div className={cls("image-editor__clip-item", "image-editor__clip__bottomCenter", `clip-resizer-bottomCenter-${clip.id}`)} />
    </div>
  );
})
