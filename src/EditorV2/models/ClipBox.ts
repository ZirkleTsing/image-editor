import { action, computed, makeObservable, observable } from 'mobx';
import WorkspaceElement from './Element';
import { generateUuid } from '../shared';
import type { Position } from '../types';
import type { Editor, WorkSpace } from '.';

export interface IClipBoxProps {
  position: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  index: number
}

type IClipBoxResizer = {
  leftTop: HTMLDivElement | null;
  rightTop: HTMLDivElement | null;
  leftBottom: HTMLDivElement | null;
  rightBottom: HTMLDivElement | null;
  leftCenter: HTMLDivElement | null;
  rightCenter: HTMLDivElement | null;
  topCenter: HTMLDivElement | null;
  bottomCenter: HTMLDivElement | null;
};

class ClipBox implements WorkspaceElement {
  type = "ClipBox";
  clipLeft: number = 0;
  clipTop: number = 0;
  clipWidth: number = 100;
  clipHeight: number = 100;
  editor: Editor;
  id: string;
  workspace: WorkSpace;
  container: HTMLDivElement | null = null;
  isOverlap: boolean = false;
  index: number
  resizer: IClipBoxResizer = {
    leftTop: null,
    rightTop: null,
    leftBottom: null,
    rightBottom: null,
    leftCenter: null,
    rightCenter: null,
    topCenter: null,
    bottomCenter: null,
  };
  startPosition: Position = {
    x: 0,
    y: 0,
  };

  constructor(props: IClipBoxProps, editor: Editor, workspace: WorkSpace) {
    this.editor = editor;
    this.id = generateUuid();
    this.workspace = workspace;
    this.index = props.index
    this.initialize(props);

    makeObservable(this, {
      clipLeft: observable,
      clipTop: observable,
      clipWidth: observable,
      clipHeight: observable,
      editor: observable,
      id: observable,
      container: observable,
      startPosition: observable,
      isOverlap: observable,
      resizer: observable.struct,
      left: computed,
      top: computed,
      height: computed,
      width: computed,
      checkOverlap: action,
      updatePosition: action,
      attachContainer: action,
      attachResizer: action
    });
  }

  private initialize(props: IClipBoxProps) {
    const { position } = props;
    if (position) {
      this.left = position.left;
      this.top = position.top;
      this.height = position.height;
      this.width = position.width;
    }
  }

  set left(left: number) {
    this.clipLeft = left;
  }

  get left() {
    return this.clipLeft;
  }

  set top(top: number) {
    this.clipTop = top;
  }

  get top() {
    return this.clipTop;
  }

  set height(height: number) {
    this.clipHeight = height;
  }

  get height() {
    return this.clipHeight;
  }

  set width(width: number) {
    this.clipWidth = width;
  }

  get width() {
    return this.clipWidth;
  }

  updatePosition = (
    offsetPosition: Position,
    draggingType: keyof IClipBoxResizer | (string & {}),
  ) => {
    switch (draggingType) {
      case 'leftTop': {
        this.top = this.top + offsetPosition.y;
        this.left = this.left + offsetPosition.x;
        this.width = this.width - offsetPosition.x;
        this.height = this.height - offsetPosition.y;
        break;
      }
      case 'rightTop': {
        this.top = this.top + offsetPosition.y;
        this.height = this.height - offsetPosition.y;
        this.width = this.width + offsetPosition.x;
        break;
      }
      case 'rightBottom': {
        this.width = this.width + offsetPosition.x;
        this.height = this.height + offsetPosition.y;
        break;
      }
      case 'topCenter': {
        this.top = this.top + offsetPosition.y;
        this.height = this.height - offsetPosition.y;
        return;
      }
      case 'bottomCenter': {
        this.height = this.height + offsetPosition.y;
        break;
      }
      case 'rightCenter': {
        this.width = this.width + offsetPosition.x;
        break;
      }
      case 'leftCenter': {
        this.left = this.left + offsetPosition.x;
        this.width = this.width - offsetPosition.x;
        break;
      }
      case 'leftBottom': {
        this.left = this.left + offsetPosition.x;
        this.width = this.width - offsetPosition.x;
        this.height = this.height + offsetPosition.y;
        break;
      }
      default: {
        // 拖拽ClipBox
        this.left = Math.max(this.left + offsetPosition.x, 0);
        this.top = Math.max(this.top + offsetPosition.y, 0);
        break;
      }
    }
  };

  checkOverlap = () => {
    // 判断当前元素是否重叠
    this.isOverlap = this.workspace.isElementOverlap(this)
  }

  attachContainer() {
    this.container = document.querySelectorAll(
      `.clip-${this.id}`,
    )?.[0] as HTMLDivElement;
    this.resizer.leftTop = document.querySelectorAll(
      `.clip-resizer-leftTop-${this.id}`,
    )?.[0] as HTMLDivElement;
    this.resizer.rightTop = document.querySelectorAll(
      `.clip-resizer-rightTop-${this.id}`,
    )?.[0] as HTMLDivElement;
    this.resizer.leftBottom = document.querySelectorAll(
      `.clip-resizer-leftBottom-${this.id}`,
    )?.[0] as HTMLDivElement;
    this.resizer.rightBottom = document.querySelectorAll(
      `.clip-resizer-rightBottom-${this.id}`,
    )?.[0] as HTMLDivElement;
    this.resizer.leftCenter = document.querySelectorAll(
      `.clip-resizer-leftCenter-${this.id}`,
    )?.[0] as HTMLDivElement;
    this.resizer.rightCenter = document.querySelectorAll(
      `.clip-resizer-rightCenter-${this.id}`,
    )?.[0] as HTMLDivElement;
    this.resizer.topCenter = document.querySelectorAll(
      `.clip-resizer-topCenter-${this.id}`,
    )?.[0] as HTMLDivElement;
    this.resizer.bottomCenter = document.querySelectorAll(
      `.clip-resizer-bottomCenter-${this.id}`,
    )?.[0] as HTMLDivElement;

    const onMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.stopPropagation();
      if (
        this.workspace.isDragging &&
        this.workspace.draggingTarget === this &&
        this.workspace.draggingType === 'ClipBox'
      ) {
        const offsetPosition = {
          x: moveEvent.clientX - this.startPosition.x,
          y: moveEvent.clientY - this.startPosition.y,
        };
        this.startPosition = {
          x: moveEvent.clientX,
          y: moveEvent.clientY,
        };
        this.updatePosition(offsetPosition, 'ClipBox');
      }
    };

    const onMouseUp = () => {
      this.workspace.isDragging = false;
      this.workspace.draggingTarget = null;
      this.workspace.draggingType = '';
      document.removeEventListener('mousemove', onMouseMove);
    };

    const onContainerMouseDown = (event: MouseEvent) => {
      event.stopPropagation();
      this.workspace.select(this.id)
      this.workspace.mode = 'normal'
      this.workspace.isDragging = true;
      this.workspace.draggingTarget = this;
      this.workspace.draggingType = 'ClipBox';
      this.startPosition = {
        x: event.clientX,
        y: event.clientY,
      };
      // 禁止选取 https://juejin.cn/post/7205457389327646777
      (this.container as HTMLDivElement).onselectstart = () => {
        return false;
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    this.container.addEventListener('mousedown', onContainerMouseDown);

    return () => {
      document.removeEventListener('mouseup', onMouseUp);
      (this.container as HTMLDivElement).removeEventListener(
        'mousedown',
        onContainerMouseDown,
      );
    };
  }

  attachResizer() {
    const init = (handler: HTMLDivElement, type: keyof IClipBoxResizer) => {
      const onMouseMove = (moveEvent: MouseEvent) => {
        moveEvent.stopPropagation();
        if (
          this.workspace.isDragging &&
          this.workspace.draggingTarget === this &&
          this.workspace.draggingType === 'Resizer'
        ) {
          const offsetPosition = {
            x: moveEvent.clientX - this.startPosition.x,
            y: moveEvent.clientY - this.startPosition.y,
          };
          this.startPosition = {
            x: moveEvent.clientX,
            y: moveEvent.clientY,
          };

          this.updatePosition(offsetPosition, type);
        }
      };
      const onMouseUp = () => {
        this.workspace.isDragging = false;
        this.workspace.draggingTarget = null;
        this.workspace.draggingType = '';
        document.removeEventListener('mousemove', onMouseMove);
      };

      const onMouseDown = (mouseEvent: MouseEvent) => {
        mouseEvent.stopPropagation();
        this.workspace.select(this.id)
        this.workspace.mode = 'normal'
        this.workspace.isDragging = true;
        this.workspace.draggingTarget = this;
        this.workspace.draggingType = 'Resizer';
        this.startPosition = {
          x: mouseEvent.clientX,
          y: mouseEvent.clientY,
        };
        // 禁止选取 https://juejin.cn/post/7205457389327646777
        (handler as HTMLDivElement).onselectstart = () => {
          return false;
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      };
      handler.addEventListener('mousedown', onMouseDown);
      return () => {
        handler.removeEventListener('mousedown', onMouseDown);
        document.removeEventListener('mouseup', onMouseUp);
      };
    };

    const disposeList = Object.entries(this.resizer).reduce<Array<() => void>>(
      (buf, item) => {
        const [type, handler] = item as unknown as [
          keyof IClipBoxResizer,
          HTMLDivElement,
        ];
        if (handler) {
          const dispose = init(handler, type);
          return buf.concat(dispose);
        } else {
          return buf;
        }
      },
      [],
    );

    return disposeList;
  }
}

export default ClipBox;
