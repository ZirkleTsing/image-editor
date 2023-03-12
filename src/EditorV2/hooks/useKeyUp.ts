import { useEffect } from 'react'
import { KeyUpEvent } from '../models'
import { useCurrentWorkSpace, useEvent } from '.'

interface KeyUpHook {
  (handler?: (event: KeyboardEvent) => any, deps?: any[]): any
}

const useKeyUp: KeyUpHook = (handler, deps = []) => {
  const workspace = useCurrentWorkSpace()
  const keyupEvent = useEvent(KeyUpEvent)

  useEffect(() => {
    if (handler && typeof handler === 'function') {
      keyupEvent.registerEvent(handler)

      return () => {
        keyupEvent.unregisterEvent(handler)
      }
    }
  }, [workspace, workspace.id, ...deps])
}

export default useKeyUp