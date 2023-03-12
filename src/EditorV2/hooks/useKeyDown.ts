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
}

export default useKeyDown