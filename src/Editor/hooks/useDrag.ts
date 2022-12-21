import { useEffect, useRef } from 'react';
import { useEditor } from '../components/ImageEditorContext';
// import { calcOffset } from '../shared';

export const useDrag = (id: string) => {
  const { editor } = useEditor();
  const ref = useRef<HTMLDivElement>(null);

  
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
        
        editor.onDragStart?.(id)
        if (editor.activeAnchor !== id) {
          editor.onSelect?.(id)
          editor.activeAnchor = id
        }
      }

      // 这里删掉 挪到Editor进行管理，拖拽更丝滑
      // const onMouseMove = (e: MouseEvent) => {
      //   e.preventDefault();
      //   if (editor.onAnchorDragging && editor.draggingTarget === id) {
      //     let offsetPosition = calcOffset(e, editor);
      //     editor.updatePosition(id, { x: offsetPosition.x, y: offsetPosition.y });
      //   }
      // }

      const onMouseUp = (e: MouseEvent) => {
        e.preventDefault();
        editor.onAnchorDragging = false;
        editor.draggingTarget = '';

        editor.onDragEnd?.(id)
      }

      ref.current.addEventListener('mousedown', onMouseDown);
      // ref.current.addEventListener('mousemove', onMouseMove);
      ref.current.addEventListener('mouseup', onMouseUp);

      return () => {
        ref.current?.removeEventListener('mousedown', onMouseDown)
        // ref.current?.removeEventListener('mousemove', onMouseMove)
        ref.current?.removeEventListener('mouseup', onMouseUp)
      }
    }
  }, []);

  return ref;
};
