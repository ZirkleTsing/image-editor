import { useMemo, useEffect } from 'react'
import { KeyUpEvent } from '../models'
import { useCurrentWorkSpace } from '.'

interface KeyUpHook {
  (callback?: (event: KeyboardEvent) => any, deps?: any[]): any
}

const useKeyUp: KeyUpHook = (callback, deps = []) => {
  const workspace = useCurrentWorkSpace()
  const keyupEvent = useMemo(() => new KeyUpEvent(), [workspace])

  useEffect(() => {
    if (callback && typeof callback === 'function') {
      keyupEvent.registerEvent(callback)

      return () => {
        keyupEvent.unregisterEvent(callback)
      }
    }
  }, [workspace, workspace.id, ...deps])

  useEffect(() => {
    // 点击工具栏框选时，要注册框选事件
      return keyupEvent.attach()
  }, [workspace, workspace.id])
}

export default useKeyUp