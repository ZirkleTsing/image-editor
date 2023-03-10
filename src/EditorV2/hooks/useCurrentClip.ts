import { useCurrentWorkSpace } from '.'

const useCurrentClip = () => {
  const workspace = useCurrentWorkSpace()
  return workspace.currentClip
}

export default useCurrentClip