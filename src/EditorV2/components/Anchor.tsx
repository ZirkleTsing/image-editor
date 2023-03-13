import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import cls from 'classnames';
import type { Anchor } from '../models';
import { useCurrentWorkSpace } from '../hooks'

interface IAnchorProps {
  anchor: Anchor
}

export default observer<IAnchorProps>((props) => {
  const { anchor } = props
  const worspace = useCurrentWorkSpace()

  useEffect(() => {
    anchor.attach()
    return () => {
      anchor.detach()
    }
  }, [anchor])

  return (
    <div
      className={cls("image-editor__anchor", `anchor-${anchor.id}`, {
      overlap: anchor.isOverlap,
      active: worspace.activeId.includes(anchor.id) ,
      resizing: worspace.isResizing && worspace.activeId.includes(anchor.id),
      moving: worspace.isDragging && worspace.draggingType === 'Anchor' &&  worspace.activeId.includes(anchor.id),
    })}
    style={{
      width: Number(anchor.width),
      height: Number(anchor.height),
      top: Number(anchor.top),
      left: Number(anchor.left),
    }}
    onClick={() => { worspace.select(anchor.id) }}
    >
      <div
        className={cls("image-editor__anchor-content")}
        style={{
          backgroundColor: 'transparent',
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundImage: `url('https://img.alicdn.com/imgextra/i1/O1CN01QZC5lz288ky8Wx98Q_!!6000000007888-2-tps-200-200.png')`,
        }}
      /> 
      <div className={cls("image-editor__anchor-resize-item", "image-editor__anchor__leftTop", `anchor-resizer-leftTop-${anchor.id}`)} />
      <div className={cls("image-editor__anchor-resize-item", "image-editor__anchor__rightTop", `anchor-resizer-rightTop-${anchor.id}`)} />
      <div className={cls("image-editor__anchor-resize-item", "image-editor__anchor__leftBottom", `anchor-resizer-leftBottom-${anchor.id}`)} />
      <div className={cls("image-editor__anchor-resize-item", "image-editor__anchor__rightBottom", `anchor-resizer-rightBottom-${anchor.id}`)} />
      <div className={cls("image-editor__anchor-resize-item", "image-editor__anchor__leftCenter", `anchor-resizer-leftCenter-${anchor.id}`)} />
      <div className={cls("image-editor__anchor-resize-item", "image-editor__anchor__rightCenter", `anchor-resizer-rightCenter-${anchor.id}`)} />
      <div className={cls("image-editor__anchor-resize-item", "image-editor__anchor__topCenter", `anchor-resizer-topCenter-${anchor.id}`)} />
      <div className={cls("image-editor__anchor-resize-item", "image-editor__anchor__bottomCenter", `anchor-resizer-bottomCenter-${anchor.id}`)} />
    </div>
  )
})