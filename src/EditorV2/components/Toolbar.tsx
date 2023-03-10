import React, { Fragment } from 'react';
import { MinusSquareOutlined, PlusSquareOutlined, ExpandOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import cls from 'classnames';
import { observer } from 'mobx-react-lite';
import { useEditor } from '../context';
import { useCurrentClip, useCurrentWorkSpace } from '../hooks';
import type { WorkSpace } from '../models';

interface TabItemProps {
  workspace: WorkSpace;
}

const TabItem: React.FC<TabItemProps> = observer((props) => {
  const { editor } = useEditor();
  const { workspace } = props;
  const cls = 'image-editor__files-tab__item';
  if (!workspace.file.loaded)
    return (
      <div className={cls}>
        <Spin size="small" />
      </div>
    );
  return (
    <div>
      <img
        id={workspace.id}
        className={cls}
        key={workspace.id}
        src={workspace.file.content || ''}
        onClick={() => {
          editor.select(workspace.id);
        }}
      />
    </div>
  );
});

const ToolBar = observer(() => {
  const { editor, containerStyle } = useEditor();
  const currentClip = useCurrentClip();
  const currentWorkSpace = useCurrentWorkSpace();
  const renderTab = () => {
    if (editor.workspaces.length < 2) {
      return null;
    }
    return editor.workspaces.map((workspace) => {
      return <TabItem key={workspace.id} workspace={workspace} />;
    });
  };

  const renderController = () => {
    return (
      <div
        className="image-editor__files-controller"
        style={{ width: containerStyle?.width }}
      >
        {currentClip && (
          <Fragment>
            <div className="image-editor__files-controller__item">
              <span className="label">X:&nbsp;</span>
              <input
                type="number"
                value={currentClip.left}
                onChange={(e) => {
                  currentClip.left = Number(e.target.value);
                }}
              />
            </div>
            <div className="image-editor__files-controller__item">
              <span className="label">Y:&nbsp;</span>
              <input
                type="number"
                value={currentClip.top}
                onChange={(e) => {
                  currentClip.top = Number(e.target.value);
                }}
              />
            </div>
            <div className="image-editor__files-controller__item">
              <span className="label">W:&nbsp;</span>
              <input
                type="number"
                value={currentClip.width}
                onChange={(e) => {
                  currentClip.width = Number(e.target.value);
                }}
              />
            </div>
            <div className="image-editor__files-controller__item">
              <span className="label">H:&nbsp;</span>
              <input
                type="number"
                value={currentClip.height}
                onChange={(e) => {
                  currentClip.height = Number(e.target.value);
                }}
              />
            </div>
          </Fragment>
        )}
        <div className="image-editor__files-controller__item">
          <span className="label">P:&nbsp;</span>
          <span className="value">
            {currentWorkSpace.file.naturalWidth}*
            {currentWorkSpace.file.naturalHeight}
          </span>
        </div>
        <div className="image-editor__files-controller__item">
          <span className="label">S:&nbsp;</span>
          <span className="value">{currentWorkSpace.file.size}</span>
        </div>
        <div>
          <div className="image-editor__files-controller__item">
            <span className="label">热区:&nbsp;</span>
            <PlusSquareOutlined
              className="plus"
              onClick={() => {
                currentWorkSpace.addClip();
              }}
            />
            {currentWorkSpace.activeClipId && (
              <MinusSquareOutlined
                className="minus"
                onClick={() => {
                  currentWorkSpace.deleteClip();
                }}
              />
            )}
          </div>
          <div className="image-editor__files-controller__item">
            <span className="label">框选:&nbsp;</span>  
            <ExpandOutlined className={cls("select", { active: currentWorkSpace.mode === 'select' })} onClick={() => {
              currentWorkSpace.mode = currentWorkSpace.mode === 'select' ?  'normal' : 'select'
            }} />
          </div>
        </div>
      </div>
    );
  };

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
