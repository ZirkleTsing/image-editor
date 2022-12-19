import { useEffect, useRef } from 'react';
import { useEditor } from '../components/ImageEditorContext';

export const useDrag = (id: string) => {
  const { editor } = useEditor();
  const ref = useRef<HTMLDivElement>(null);

  const calcOffset = (e: MouseEvent) => {
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

  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener('mousedown', (e) => {
        e.preventDefault();
        editor.onDotDragging = true;
        editor.draggingTarget = id;
        editor.startPosition = {
          x: e.pageX,
          y: e.pageY,
        };
      });

      ref.current.addEventListener('mousemove', (e: MouseEvent) => {
        e.preventDefault();
        if (editor.onDotDragging && editor.draggingTarget === id) {
          let offsetPosition = calcOffset(e);
          editor.updatePosition(id, { x: offsetPosition.x, y: offsetPosition.y });
        }
      });

      ref.current.addEventListener('mouseup', (e) => {
        console.log('取消')
        e.preventDefault();
        editor.onDotDragging = false;
        editor.draggingTarget = '';
      });
    }
  }, []);

  return ref;
};
