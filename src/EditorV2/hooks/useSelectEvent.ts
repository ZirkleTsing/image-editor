import { useEffect } from 'react'
import { useCurrentWorkSpace, useEvent } from '.'
import { SelectEvent, SelectEventHandler } from '../models'

interface SelectEventHook {
  (callback?: SelectEventHandler, deps?: any[]): SelectEvent
}

const useSelectEvent: SelectEventHook = (callback, deps = []) => {
  const workspace = useCurrentWorkSpace()
  const selectEvent = useEvent(SelectEvent)

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