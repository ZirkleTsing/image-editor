import { useEffect } from 'react'
import { useCurrentWorkSpace, useEvent } from '.'
import { SelectEvent, SelectEventHandler } from '../models'
import { useEditor } from '../context'

interface SelectEventHook {
  (callback?: SelectEventHandler, deps?: any[]): SelectEvent
}

const useSelectEvent: SelectEventHook = (callback, deps = []) => {
  const { editor } = useEditor()
  const workspace = useCurrentWorkSpace()
  const selectEvent = useEvent(SelectEvent)

  useEffect(() => {
    // 点击工具栏框选时，要注册框选事件
    if (workspace.mode === 'select') {
      selectEvent.attach()
      return () => {
        selectEvent.detach()
      }
    }
  }, [workspace, editor.container, workspace.mode])

  useEffect(() => {
    if (callback && typeof callback === 'function') {
      selectEvent.registerEvent(callback)

      return () => {
        selectEvent.unregisterEvent(callback)
      }
    }
  }, [workspace, workspace.id, ...deps])

  return selectEvent
}

export default useSelectEvent