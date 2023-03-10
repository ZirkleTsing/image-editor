import { useEditor } from '../context'

const useCurrentWorkSpace = () => {
  const { editor } = useEditor()

  return editor.current
}

export default useCurrentWorkSpace