import React from 'react';
import { observer } from 'mobx-react-lite';
import { Spin } from 'antd'
import { useEditor } from './ImageEditorContext';
import type { ImageFile } from '../models'

interface TabItemProps {
  file: ImageFile
}

const TabItem: React.FC<TabItemProps> = observer((props) => {
  const { editor } = useEditor()
  const { file } = props
  const cls = 'image-editor__files-tab__item'
  if (!file.loaded) return <div className={cls}><Spin size="small" /></div>
  return (
    <div>
      <img
        id={file.id}
        className={cls}
        key={file.id}
        src={file.content || ''}
        onClick={() => { editor.select(file.id) }}
      />
    </div>
  )
})

const ToolBar = observer(() => {
  const { editor } = useEditor();

  const renderTab = () => {
    return editor.files.map((file) => {
      return <TabItem key={file.id} file={file} />;
    });
  };

  return (
    <div
      onDragStart={(e) => e.preventDefault()}
      className="image-editor__files-tab"
    >
      {renderTab()}
    </div>
  );
});

export default ToolBar;
