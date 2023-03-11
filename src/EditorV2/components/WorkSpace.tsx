import cls from 'classnames';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useEditor } from '../context';
import { useCurrentWorkSpace, useSelectEvent } from '../hooks';
import { nextTick } from '../internal';
import type { ImageFile } from '../models';
import { default as ClipBox } from './ClipBox';

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
  
  const selectEvent = useSelectEvent((payload) => {
    console.log('payload:', payload)
  });
  
  useEffect(() => {
    // 检查拖拽对象是否有重叠
    const run = () => nextTick(() => workspace.check());
    document.addEventListener('mouseup', run);
    const dispose = workspace.attach();
    run();
    return () => {
      dispose();
      document.removeEventListener('mouseup', run);
    };
  }, [workspace]);

  useEffect(() => {
    // 点击工具栏框选时，要注册框选事件
    if (workspace.mode === 'select') {
      return workspace.selectEvent.attach()
    }
  }, [workspace, editor.container, workspace.mode])

  return (
    <div className={cls('image-editor', className)} style={containerStyle}>
      <div
        className={cls('image-editor__mask', { show: selectEvent.show })}
        style={{
          width: selectEvent.width,
          height: selectEvent.height,
          left: selectEvent.left,
          top: selectEvent.top,
        }}
      />
      <Image image={editor.current.file} />
      {workspace.clips?.map((clip) => {
        return <ClipBox key={clip.id} clip={clip} />;
      })}
    </div>
  );
});

export default WorkSpace;
