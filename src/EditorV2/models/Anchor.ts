import { action, computed, makeObservable, observable } from 'mobx';
import WorkspaceElement from './Element';
import { generateUuid } from '../shared';
import type { Editor, WorkSpace } from '.';
import type { Position } from '../types';

interface IAnchorProps {
  position: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  index: number
}

type IAnchorResizer = {
  leftTop: HTMLDivElement | null;
  rightTop: HTMLDivElement | null;
  leftBottom: HTMLDivElement | null;
  rightBottom: HTMLDivElement | null;
  leftCenter: HTMLDivElement | null;
  rightCenter: HTMLDivElement | null;
  topCenter: HTMLDivElement | null;
  bottomCenter: HTMLDivElement | null;
};


class Anchor implements WorkspaceElement {
  type = "Anchor";
  editor: Editor;
  id: string;
  workspace: WorkSpace;
  index: number
  anchorLeft: number = 0;
  anchorTop: number = 0;
  anchorWidth: number = 100;
  anchorHeight: number = 100;
  container: HTMLDivElement | null = null;
  isOverlap: boolean = false;
  startPosition: Position = {
    x: 0,
    y: 0,
  };

  constructor(props: IAnchorProps, editor: Editor, workspace: WorkSpace) {
    this.editor = editor;
    this.workspace = workspace;
    this.id = generateUuid();
    this.index = props.index
    this.initialize(props);

    makeObservable(this, {
      anchorLeft: observable,
      anchorTop: observable,
      anchorWidth: observable,
      anchorHeight: observable,
      editor: observable,
      id: observable,
      container: observable,
      startPosition: observable,
      isOverlap: observable,
      left: computed,
      top: computed,
      height: computed,
      width: computed,
      checkOverlap: action,
      updatePosition: action,
      attach: action,
      detach: action,
      onMouseDown: action,
      onMouseMove: action,
      onMouseUp: action
      // attachContainer: action,
      // attachResizer: action
    })
  }
  
  private initialize(props: IAnchorProps) {
    const { position } = props;
    if (position) {
      this.left = position.left;
      this.top = position.top;
      this.height = position.height;
      this.width = position.width;
    }
  }

  set left(left: number) {
    this.anchorLeft = left;
  }

  get left() {
    return this.anchorLeft;
  }

  set top(top: number) {
    this.anchorTop = top;
  }

  get top() {
    return this.anchorTop;
  }

  set height(height: number) {
    this.anchorHeight = height;
  }

  get height() {
    return this.anchorHeight;
  }

  set width(width: number) {
    this.anchorWidth = width;
  }

  get width() {
    return this.anchorWidth;
  }

  updatePosition = (
    offsetPosition: Position,
    draggingType: keyof IAnchorResizer | (string & {}),
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

  onMouseUp = () => {
    this.workspace.isDragging = false;
    this.workspace.draggingTarget = null;
    this.workspace.draggingType = '';
    document.removeEventListener('mousemove', this.onMouseMove);
  }

  onMouseMove = (moveEvent: MouseEvent) => {
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

  onMouseDown = (event: MouseEvent) => {
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

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  };

  attach() {
  this.container = document.querySelectorAll(
    `.anchor-${this.id}`,
  )?.[0] as HTMLDivElement;
    this.container.addEventListener('mousedown', this.onMouseDown);
  };

  detach() {
    document.removeEventListener('mouseup', this.onMouseUp);
    (this.container as HTMLDivElement).removeEventListener('mousedown',this.onMouseDown,);
  };
}

export default Anchor