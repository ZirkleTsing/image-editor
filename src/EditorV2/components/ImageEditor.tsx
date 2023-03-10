import { observer } from 'mobx-react-lite';
import React, { useEffect, useMemo } from 'react';
import { ImageEditorContext } from '../context';
import { Editor } from '../models';
import type { IClipBoxProps } from '../models/ClipBox';
import { default as Toolbar } from './Toolbar';
import { default as WorkSpace } from './WorkSpace';

type ImageEditorV2Props = {
  images: string[];
  containerStyle?: React.CSSProperties;
  className?: string;
  positions?: Array<IClipBoxProps['position']>;
  ref: React.MutableRefObject<any>
};

const ImageEditorV2: (
  props: ImageEditorV2Props,
  ref?: React.MutableRefObject<any>,
) => JSX.Element = observer(
  (props, ref) => {
    const { images, containerStyle, className, positions } = props;

    const editor = useMemo(() => {
      return new Editor({ files: images, ref: '.image-editor', positions });
    }, []);

    useEffect(() => {
      if (ref) {
        ref.current = editor;
      }
      return editor.attach();
    }, []);

    return (
      <ImageEditorContext.Provider
        value={{ editor, containerStyle, className }}
      >
        <Toolbar />
        <WorkSpace />
      </ImageEditorContext.Provider>
    );
  },
  { forwardRef: true },
);

export default ImageEditorV2;
