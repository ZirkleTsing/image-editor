import React, { createContext, useMemo } from 'react'
import { useCurrentWorkSpace } from '../hooks'
import { useEditor } from '../context'
import * as EventContructors from '../models/Event'


export const EventContext = createContext<any>(null)

const EventProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {
  const { editor } = useEditor()
  const workspace = useCurrentWorkSpace()

  const eventInstances = useMemo(() => {
    return Object.keys(EventContructors).reduce<any[]>((buf, eventName: any) => {
      const EventClass = (EventContructors as any)[eventName]
      return buf.concat({
        Instance: new EventClass(editor),
        Host: EventClass
      })

    }, [])
  }, [workspace, workspace.id]) // 每个工作区都需要独立的实例，工作区注册事件执行回调是独立的

  return (
    <EventContext.Provider value={{ eventInstances }}>
      {props.children}
    </EventContext.Provider>
  )
}

export default EventProvider