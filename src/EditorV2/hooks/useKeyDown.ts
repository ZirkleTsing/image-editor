import { useMemo, useEffect } from 'react'
import { KeyDownEvent } from '../models'
import { useCurrentWorkSpace } from '.'

interface KeyDownHook {
  (callback?: (event: KeyboardEvent) => any, deps?: any[]): any
}


const useKeyDown: KeyDownHook = (callback, deps = []) => {
  const workspace = useCurrentWorkSpace()
  const keydownEvent = useMemo(() => new KeyDownEvent(), [workspace])

  useEffect(() => {
    if (callback && typeof callback === 'function') {
      keydownEvent.registerEvent(callback)

      return () => {
        keydownEvent.unregisterEvent(callback)
      }
    }
  }, [workspace, workspace.id, ...deps])

  useEffect(() => {
    // 点击工具栏框选时，要注册框选事件
      return keydownEvent.attach()
  }, [workspace, workspace.id])
}

export default useKeyDown