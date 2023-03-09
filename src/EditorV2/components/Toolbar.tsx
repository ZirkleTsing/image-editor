import React from 'react';
import { observer } from 'mobx-react-lite';
import { Spin } from 'antd'
import { useEditor } from './ImageEditorContext';
import { useWorkSpace } from '../hooks'
import type { WorkSpace } from '../models'

interface TabItemProps {
  workspace: WorkSpace
}

const TabItem: React.FC<TabItemProps> = observer((props) => {
  const { editor } = useEditor()
  const { workspace } = props
  const cls = 'image-editor__files-tab__item'
  if (!workspace.file.loaded) return <div className={cls}><Spin size="small" /></div>
  return (
    <div>
      <img
        id={workspace.id}
        className={cls}
        key={workspace.id}
        src={workspace.file.content || ''}
        onClick={() => {
          editor.select(workspace.id)
        }}
      />
    </div>
  )
})

const ToolBar = observer(() => {
  const { editor, containerStyle } = useEditor();
  const currentWorkSpace = useWorkSpace()

  const renderTab = () => {
    if (editor.workspaces.length < 2) {
      return null
    }
    return editor.workspaces.map((workspace) => {
      return <TabItem key={workspace.id} workspace={workspace} />;
    });
  };

  const renderController = () => {
    return (
      <div className="image-editor__files-controller" style={{ width: containerStyle?.width }}>
        <div className='image-editor__files-controller__item'>
          <span className="label">X:&nbsp;</span>
          <input type="number" value={currentWorkSpace.clip.left} onChange={e => { currentWorkSpace.clip.left = e.target.value }} />
        </div>
        <div className='image-editor__files-controller__item'>
          <span className="label">Y:&nbsp;</span>
          <input type="number" value={currentWorkSpace.clip.top} onChange={e => { currentWorkSpace.clip.top = e.target.value }} />
        </div>
        <div className='image-editor__files-controller__item'>
          <span className="label">W:&nbsp;</span>
          <input type="number" value={currentWorkSpace.clip.width} onChange={e => { currentWorkSpace.clip.width = e.target.value }} />
        </div>
        <div className='image-editor__files-controller__item'>
          <span className="label">H:&nbsp;</span>
          <input type="number" value={currentWorkSpace.clip.height} onChange={e => { currentWorkSpace.clip.height = e.target.value }} />
        </div>
        <div className='image-editor__files-controller__item'>
          <span className="label">P:&nbsp;</span>
          <span className="value">{currentWorkSpace.file.naturalWidth}*{currentWorkSpace.file.naturalHeight}</span>
        </div>
        <div className='image-editor__files-controller__item'>
          <span className="label">S:&nbsp;</span>
          <span className="value">{currentWorkSpace.file.size}</span>
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
