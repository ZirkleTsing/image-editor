import { generate } from 'short-uuid'
import { makeObservable, observable, computed, action, toJS } from 'mobx'
import { Anchor } from './Anchor'
import { calcOffset } from '../shared'
import type { IEditorProps, EditorFactory, Position, IChangeValue, AnchorType } from '../types'

/**
 * Editor 功能
 * 1. 初始化
 *  - 背景图片 imgUrl
 *    -- dom尺寸
 *  - 图片尺寸裁减居中
 *  - 图钉生成的初始坐标，不能重叠
 * 2. 创建图钉实例
 * 3. 删除图钉实例
 * 4. 变更图钉实例？
 * 5. 管理拖拽状态，正在拖拽的实例
 * 6. 点击图钉的消息通知，
 *  == 工厂方法 ==
 *  生成 Editor 的方法 imageEditor.create(ref, {})
 *    -- anchor uuid的工厂函数
 * 
 */

export class Editor<Extra = any> {
  private ref: HTMLElement
  width: number
  height: number
  imgUrl: string
  anchorUrl?: string
  pageX: number
  pageY: number
  onAnchorDragging = false
  draggingTarget = ''
  anchors: Anchor<Extra>[] 
  initialAnchors:AnchorType<Extra>[]
  onChange?: (value: IChangeValue<Extra>) => void
  onDragStart?: (id: string) => void
  onDragEnd?: (id: string) => void
  limit = {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  }

  startPosition: Position = {
    x: 0,
    y: 0
  }

  constructor(props: IEditorProps<Extra>) {
    this.ref = props.domRef
    this.width = props.domRef.offsetWidth
    this.height = props.domRef.offsetHeight
    const rect = props.domRef.getBoundingClientRect()
    this.pageX = rect.left
    this.pageY = rect.top
    this.imgUrl = props.imageUrl
    this.anchorUrl = props.anchorUrl
    this.limit = {
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom
    }
    this.initialAnchors = toJS(props.anchors)
    this.onChange = props.onChange
    this.onDragStart = props.onDragStart
    this.onDragEnd = props.onDragEnd
    this.init()
    this.anchors = Anchor.create(props.anchors, this)
    
    makeObservable(this, {
      anchors: observable,
      onAnchorDragging: observable,
      draggingTarget: observable,
      anchorMeta: computed,
      context: computed,
      startPosition: observable.struct,
      createAnchor: action,
      deleteAnchor: action
    })
  }

  private init = () => {
    this.ref.style.backgroundImage = `url('${this.imgUrl}')`
  }

  effect = () => {
    const onMouseUp = () => {
      this.draggingTarget = ''
      this.onAnchorDragging = false
      this.onChange?.(this.context)
    }
    const onMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      if (this.onAnchorDragging) {
        const id = this.draggingTarget
        let offsetPosition = calcOffset(e, this);
        this.updatePosition(id, { x: offsetPosition.x, y: offsetPosition.y });
      }
    }

    this.ref.addEventListener('mouseup', onMouseUp)
    this.ref.addEventListener('mousemove', onMouseMove)
    return () => {
      this.ref.removeEventListener('mouseup', onMouseUp)
      this.ref.removeEventListener('mousemove', onMouseMove)
    }
  }

  get anchorMeta() {
    return this.anchors?.map(anchor => {
      return {
        left: anchor.offsetLeft,
        top: anchor.offsetTop,
        id: anchor.uuid,
        extra: anchor.extra,
        effect: anchor.effect
      }
    })
  }
  
  get context() {
    return {
      anchors: this.anchors.map(anchor => {
        return {
          uuid: anchor.id,
          position: anchor.position,
          extra: anchor.extra
        }
      })
    }
  }

  updatePosition = (id: string, position: Position) => {
    const anchor = this.anchors.find(anchor => {
      return anchor.id === id
    })!
    anchor.updatePosition(position)
  }

  deleteAnchor = (id: string) => {
    const index = this.anchors.findIndex(anchor => anchor.id === id)
    this.anchors.splice(index, 1)
  }

  createAnchor = (config: Omit<AnchorType<Extra>, 'uuid'>) => {
    const anchor = new Anchor({
      ...config,
      uuid: generate()
    }, this)
    this.anchors.push(anchor)
  }
  
  static create = <Extra = any>(ref: HTMLElement, props: EditorFactory<Extra>): Editor => {
    return new Editor({
      domRef: ref,
      ...props,
      anchors: props.anchors?.map(anchor => {
        return {
          ...anchor,
          uuid: generate()
        }
      })
    })
  }
}