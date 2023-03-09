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
        id={editor.current.id}
        className={cls}
        key={editor.current.id}
        src={file.content || ''}
        onClick={() => { editor.select(editor.current.id) }}
      />
    </div>
  )
})

const ToolBar = observer(() => {
  const { editor, containerStyle } = useEditor();

  const renderTab = () => {
    if (editor.workspaces.length < 2) {
      return null
    }
    return editor.workspaces.map((workspace) => {
      return <TabItem key={workspace.id} file={workspace.file} />;
    });
  };

  const renderController = () => {
    return (
      <div className="image-editor__files-controller" style={{ width: containerStyle?.width }}>
        <div className='image-editor__files-controller__item'>
          <span className="label">X:&nbsp;</span>
          <input type="number" />
        </div>
        <div className='image-editor__files-controller__item'>
          <span className="label">Y:&nbsp;</span>
          <input type="number" />
        </div>
        <div className='image-editor__files-controller__item'>
          <span className="label">W:&nbsp;</span>
          <input type="number" />
        </div>
        <div className='image-editor__files-controller__item'>
          <span className="label">H:&nbsp;</span>
          <input type="number" />
        </div>
        <div className='image-editor__files-controller__item'>
          <span className="label">P:&nbsp;</span>
          <span className="value">{editor.current.file.naturalWidth}*{editor.current.file.naturalHeight}</span>
        </div>
        <div className='image-editor__files-controller__item'>
          <span className="label">S:&nbsp;</span>
          <span className="value">{editor.current.file.size}</span>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div
        onDragStart={(e) => e.preventDefault()}
        className="image-editor__files-tab"
      >
        {renderTab()}
      </div>
      {renderController()}
    </div>
  );
});

export default ToolBar;
