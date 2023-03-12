import { useContext } from 'react'
import { EventContext } from '../components/EventProvider'

// 通过Class找到workspace全局唯一单例的对象实例
const useEvent = <T extends { new (...props: any[]): any }>(type: T): InstanceType<T> => {
  const { eventInstances } = useContext(EventContext)
  for (const item in eventInstances) {
    if (eventInstances[item].Host === type) {
      return eventInstances[item].Instance
    }
  }
  // 这里为了类型不报错 实际上正确调用不会走到这里
  return undefined as InstanceType<T>
}

export default useEvent