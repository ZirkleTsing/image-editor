import { useCurrentWorkSpace, useKeyDown, useKeyUp } from '.'

interface keyEventHook {
  (callback?: () => any, deps?: any[]): any
}

 // 工作区初始化: 按键事件
const useKeyEvent: keyEventHook = () => {
  const workspace = useCurrentWorkSpace()

  // 注册keyDown keyUp事件
  useKeyDown(workspace.handleKeyPress, [workspace, workspace.id])
  useKeyUp(workspace.handleKeyUp, [workspace, workspace.id])
}

export default useKeyEvent