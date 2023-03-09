import { useCurrentWorkSpace } from '.'

const useCurrentClip = () => {
  const workspace = useCurrentWorkSpace()
  console.log('workspace:', workspace)
  return workspace.currentClip
}

export default useCurrentClip