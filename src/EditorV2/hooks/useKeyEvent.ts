import { useCallback } from 'react'
import { useCurrentWorkSpace, useKeyDown, useKeyUp } from '.'

interface keyEventHook {
  (callback?: () => any, deps?: any[]): any
}

const KeyBoard = {
  LEFT: 'ArrowLeft',
  UP: 'ArrowUp',
  RIGHT: 'ArrowRight',
  DOWN: 'ArrowDown',
} as const;

 // 工作区初始化: 按键事件
const useKeyEvent: keyEventHook = () => {
  const workspace = useCurrentWorkSpace();
  const onKeyPress = useCallback((e: KeyboardEvent) => {
    const keyCode = e.code;
    if (workspace.activeClipId && workspace.currentClip.length > 0) {
      switch (keyCode) {
        case KeyBoard.LEFT: {
          e.preventDefault();
          workspace.currentClip.forEach(clip => {
            clip.left = clip.left - 3
          })
          break;
        }
        case KeyBoard.UP: {
          e.preventDefault();
          workspace.currentClip.forEach(clip => {
            clip.top = clip.top - 3
          })
          break;
        }
        case KeyBoard.RIGHT: {
          e.preventDefault();
          workspace.currentClip.forEach(clip => {
            clip.left = clip.left + 3
          })
          break;
        }
        case KeyBoard.DOWN: {
          e.preventDefault();
          workspace.currentClip.forEach(clip => {
            clip.top = clip.top + 3
          })
          break;
        }
        default: {
          return;
        }
      }
    }
  }, [workspace])

  const onKeyUp = useCallback((e: KeyboardEvent) => {
    const keyCode = e.code;
    if (workspace.activeClipId.length && workspace.currentClip) {
      switch (keyCode) {
        case KeyBoard.LEFT:
        case KeyBoard.UP:
        case KeyBoard.RIGHT:
        case KeyBoard.DOWN: {
          workspace.checkOverlap();
        }
        default: {
          break;
        }
      }
    }
  }, [workspace])

  // 注册keyDown keyUp事件
  useKeyDown(onKeyPress)
  useKeyUp(onKeyUp)
}

export default useKeyEvent