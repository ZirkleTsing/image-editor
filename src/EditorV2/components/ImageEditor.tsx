import { observer } from 'mobx-react-lite';
import React, { useEffect, useMemo } from 'react';
import { ImageEditorContext } from '../context';
import { Editor } from '../models';
import Toolbar from './Toolbar';
import WorkSpace from './WorkSpace';
import EventProvider from './EventProvider';

type ImageEditorV2Props = {
  images: string[];
  containerStyle?: React.CSSProperties;
  className?: string;
  configs: Array<{
    type: 'CLIP' | 'ANCHOR',
    position: {
      left: number;
      top: number;
      width: number;
      height: number;
    }
  }>
  ref: React.MutableRefObject<any>
};

const ImageEditorV2: (
  props: ImageEditorV2Props,
  ref?: React.MutableRefObject<any>,
) => JSX.Element = observer(
  (props, ref) => {
    const { images, containerStyle, className, configs } = props;

    const editor = useMemo(() => {
      return new Editor({ files: images, ref: '.image-editor', configs });
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
        <EventProvider>
          <Toolbar />
          <WorkSpace />
        </EventProvider>
      </ImageEditorContext.Provider>
    );
  },
  { forwardRef: true },
);

export default ImageEditorV2;
