import { useEffect, useCallback } from 'react'
import { useCurrentWorkSpace } from '.'

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

  useEffect(() => {
    document.addEventListener('keydown', onKeyPress);
    document.addEventListener('keyup', onKeyUp);
    return () => {
      document.removeEventListener('keydown', onKeyPress);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, [workspace])
}

export default useKeyEvent