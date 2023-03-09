import { useEditor } from '../components'

const useWorkSpace = () => {
  const { editor } = useEditor()

  return editor.current
}

export default useWorkSpace