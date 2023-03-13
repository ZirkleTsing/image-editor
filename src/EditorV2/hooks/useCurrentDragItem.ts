import { useCurrentWorkSpace } from '.'

const useCurrentDragItem = () => {
  const workspace = useCurrentWorkSpace()
  return workspace.current
}

export default useCurrentDragItem