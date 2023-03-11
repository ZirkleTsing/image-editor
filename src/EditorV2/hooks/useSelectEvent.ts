import { useEffect } from 'react'
import { useCurrentWorkSpace } from '.'
import { SelectEvent, SelectEventHandler } from '../models'

interface SelectEventProps {
  (callback?: SelectEventHandler, deps?: any[]): SelectEvent
}

const useSelectEvent: SelectEventProps = (callback, deps = []) => {
  const workspace = useCurrentWorkSpace()

  useEffect(() => {
    if (callback && typeof callback === 'function') {
      workspace.selectEvent.registerEvent(callback)

      return () => {
        workspace.selectEvent.unregisterEvent(callback)
      }
    }
  }, [workspace, ...deps])

  return workspace.selectEvent
}

export default useSelectEvent