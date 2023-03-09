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
  const { editor, containerStyle } = useEditor();

  const renderTab = () => {
    if (editor.files.length < 2) {
      return null
    }
    return editor.files.map((file) => {
      return <TabItem key={file.id} file={file} />;
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
          <span className="value">{editor.current.naturalWidth}*{editor.current.naturalHeight}</span>
        </div>
        <div className='image-editor__files-controller__item'>
          <span className="label">S:&nbsp;</span>
          <span className="value">{editor.current.size}</span>
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
