import React from 'react'
import { observer } from 'mobx-react-lite';
import cls from 'classnames'
import { useCurrentWorkSpace, useSelectEvent } from '../hooks';

const SelectMask = observer(() => {
  const workspace = useCurrentWorkSpace();
  // 注册框选事件、注册当前工作区框选事件的消费方
  const selectEvent = useSelectEvent(workspace.batchSelect, []);
    
  return (
    <div
      className={cls('image-editor__mask', { show: selectEvent.show })}
      style={{
        width: selectEvent.width,
        height: selectEvent.height,
        left: selectEvent.left,
        top: selectEvent.top,
      }}
    />
  )
})

export default SelectMask