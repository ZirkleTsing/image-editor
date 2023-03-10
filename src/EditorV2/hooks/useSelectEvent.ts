import { useEffect } from 'react'
import { useEditor } from '../context'
import { useCurrentWorkSpace } from '.'

const useSelectEvent = () => {
  const { editor } = useEditor()
  const worksapce = useCurrentWorkSpace()

  useEffect(() => {
    if (worksapce.mode === 'select') {
      return worksapce.selectEvent.attach()
    }
  }, [worksapce, editor.container, worksapce.mode])

  return worksapce.selectEvent
}

export default useSelectEvent