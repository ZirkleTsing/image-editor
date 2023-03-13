import React, { useEffect } from 'react';
import cls from 'classnames';
import { observer } from 'mobx-react-lite';
import { useEditor } from '../context';
import { useCurrentWorkSpace, useKeyBoardEvent } from '../hooks';
import ClipBox from './ClipBox';
import Anchor from './Anchor';
import SelectMask from './SelectMask';
import { nextTick } from '../internal'
import type { ImageFile } from '../models';

type ImageProps = {
  image: ImageFile;
};

const Image: React.FC<ImageProps> = observer((props) => {
  const { image } = props;

  if (!image.loaded) {
    return null;
  }

  return (
    <img
      className="image-editor__img"
      onDragStart={(e) => e.preventDefault()}
      src={image.content || ''}
      onScroll={e => console.log(e.target)}
    />
  );
});

const WorkSpace = observer(() => {
  const { containerStyle, className, editor } = useEditor();
  const workspace = useCurrentWorkSpace();

  useKeyBoardEvent()

  // 注册拖拽事件: 元素重叠检查
  useEffect(() => {
    // 检查拖拽对象是否有重叠
    const run = () => nextTick(() => workspace.checkOverlapElement());
    document.addEventListener('mouseup', run);
    run();
    return () => {
      document.removeEventListener('mouseup', run);
    };
  }, [workspace]);

  return (
    <div className={cls('image-editor', className)} style={containerStyle}>
      <SelectMask />
      <Image image={editor.current.file} />
      {workspace.elements?.map((element) => {
        console.log('element:', element, element.type)
        if (element.type === 'ClipBox') {
          return <ClipBox key={element.id} clip={element as any} />;
        } else if (element.type === 'Anchor') {
          return <Anchor key={element.id} anchor={element as any} />;
        } else {
          return null
        }
      })}
    </div>
  );
});

export default WorkSpace;
