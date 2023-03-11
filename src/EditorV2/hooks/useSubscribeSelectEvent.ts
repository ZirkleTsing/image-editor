import { useEffect } from 'react';
import { useCurrentWorkSpace } from '.';
import { useEditor } from '../context'

const useSubscribeSelectEvent = () => {
  const { editor } = useEditor()
  const workspace = useCurrentWorkSpace()
  useEffect(() => {
    // 点击工具栏框选时，要注册框选事件
    if (workspace.mode === 'select') {
      return workspace.selectEvent.attach()
    }
  }, [workspace, editor.container, workspace.mode])
}

export default useSubscribeSelectEvent