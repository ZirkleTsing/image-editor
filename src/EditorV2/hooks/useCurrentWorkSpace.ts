import { useEditor } from '../components'

const useCurrentWorkSpace = () => {
  const { editor } = useEditor()

  return editor.current
}

export default useCurrentWorkSpace