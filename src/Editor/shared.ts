import type { Editor } from './models'

export const calcOffset = (e: MouseEvent, editor: Editor) => {
  const currentPosition = { // 鼠标移动的坐标
    x: e.pageX,
    y: e.pageY,
  };
  const offsetPosition = {
    x: currentPosition.x - editor.startPosition.x,
    y: currentPosition.y - editor.startPosition.y,
  };
  editor.startPosition = currentPosition;
  return offsetPosition;
};
