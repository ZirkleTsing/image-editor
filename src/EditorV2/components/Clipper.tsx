import { observer } from 'mobx-react-lite';
import React from 'react';
import type { Clip } from '../models';

interface IClipProps {
  clip: Clip;
}

const Clipper: React.FC<IClipProps> = observer((props) => {
  const { clip } = props
  return (
    <div
      className="image-editor__clip"
      style={{
        width: Number(clip.width),
        height: Number(clip.height),
        top: Number(clip.top),
        left: Number(clip.left),
      }}
    >
      <div className="image-editor__clip__leftTop" />
      <div className="image-editor__clip__rightTop" />
      <div className="image-editor__clip__leftBottom" />
      <div className="image-editor__clip__rightBottom" />
      <div className="image-editor__clip__leftCenter" />
      <div className="image-editor__clip__rightCenter" />
      <div className="image-editor__clip__topCenter" />
      <div className="image-editor__clip__bottomCenter" />
    </div>
  );
});

export default Clipper;
