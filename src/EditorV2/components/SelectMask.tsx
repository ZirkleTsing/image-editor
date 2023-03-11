import React from 'react'
import { observer } from 'mobx-react-lite';
import cls from 'classnames'
import { useCurrentWorkSpace, useSelectEvent, useSubscribeSelectEvent } from '../hooks';

const SelectMask = observer(() => {
  const workspace = useCurrentWorkSpace();
  // 注册框选事件
  useSubscribeSelectEvent()
  // 注册当前工作区框选事件的消费方
  const selectEvent = useSelectEvent((payload) => {
  const selected = workspace.selectClipBoxInArea(payload)
  workspace.activeClipId = selected.map(clip => clip.id)
  }, []);
    
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