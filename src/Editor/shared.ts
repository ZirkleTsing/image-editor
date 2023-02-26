import { generate } from 'short-uuid'
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

export const generateUuid = () => {
  return generate()
}

export const isFn = (val: any): val is (...args: any) => any => typeof val === 'function'

export const formatNum = (num: string) => {
  const value = Math.round(parseFloat(num) * 100) / 100
  const arrayNum = value.toString().split('.');
  if (arrayNum.length === 1) {
    return value.toString() + '.00'
  }
  if (arrayNum[1].length < 2) {
    return value.toString() + '0'
  }
  return value
}