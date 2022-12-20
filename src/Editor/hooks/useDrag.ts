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
      const onMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        editor.onAnchorDragging = true;
        editor.draggingTarget = id;
        editor.startPosition = {
          x: e.pageX,
          y: e.pageY,
        };
      }

      const onMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        if (editor.onAnchorDragging && editor.draggingTarget === id) {
          let offsetPosition = calcOffset(e);
          editor.updatePosition(id, { x: offsetPosition.x, y: offsetPosition.y });
        }
      }

      const onMouseUp = (e: MouseEvent) => {
        e.preventDefault();
        editor.onAnchorDragging = false;
        editor.draggingTarget = '';
      }

      ref.current.addEventListener('mousedown', onMouseDown);
      ref.current.addEventListener('mousemove', onMouseMove);
      ref.current.addEventListener('mouseup', onMouseUp);

      return () => {
        ref.current?.removeEventListener('mousedown', onMouseDown)
        ref.current?.removeEventListener('mousemove', onMouseMove)
        ref.current?.removeEventListener('mouseup', onMouseUp)
      }
    }
  }, []);

  return ref;
};
