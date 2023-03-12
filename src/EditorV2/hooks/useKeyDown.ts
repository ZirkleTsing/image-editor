import { useEffect } from 'react'
import { KeyDownEvent } from '../models'
import { useCurrentWorkSpace, useEvent } from '.'

interface KeyDownHook {
  (handler?: (event: KeyboardEvent) => any, deps?: any[]): any
}


const useKeyDown: KeyDownHook = (handler, deps = []) => {
  const workspace = useCurrentWorkSpace()
  const keydownEvent = useEvent(KeyDownEvent)

  useEffect(() => {
    if (handler && typeof handler === 'function') {
      keydownEvent.registerEvent(handler)

      return () => {
        keydownEvent.unregisterEvent(handler)
      }
    }
  }, [workspace, workspace.id, ...deps])

  useEffect(() => {
    // 点击工具栏框选时，要注册框选事件
    keydownEvent.attach()
    return () => {
      keydownEvent.detach()
    }
  }, [workspace, workspace.id])
}

export default useKeyDown