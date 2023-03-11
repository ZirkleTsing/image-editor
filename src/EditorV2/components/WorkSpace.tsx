import cls from 'classnames';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useEditor } from '../context';
import { useCurrentWorkSpace } from '../hooks';
import { nextTick } from '../internal';
import ClipBox from './ClipBox';
import SelectMask from './SelectMask';
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
    />
  );
});

const WorkSpace = observer(() => {
  const { containerStyle, className, editor } = useEditor();
  const workspace = useCurrentWorkSpace();
  
  useEffect(() => {
    // 检查拖拽对象是否有重叠
    const run = () => nextTick(() => workspace.checkOverlap());
    document.addEventListener('mouseup', run);
    // 工作区初始化: 按键事件
    const dispose = workspace.attach();
    run();
    return () => {
      dispose();
      document.removeEventListener('mouseup', run);
    };
  }, [workspace]);


  return (
    <div className={cls('image-editor', className)} style={containerStyle}>
      <SelectMask />
      <Image image={editor.current.file} />
      {workspace.clips?.map((clip) => {
        return <ClipBox key={clip.id} clip={clip} />;
      })}
    </div>
  );
});

export default WorkSpace;
