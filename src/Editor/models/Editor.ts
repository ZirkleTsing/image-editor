import { generate } from 'short-uuid'
import { makeObservable, observable, computed } from 'mobx'
import { Anchor } from './Anchor'
import type { IEditorProps, EditorFactory, Position } from '../types'
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
 *  生成 dot uuid的工厂函数
 *  生成 Editor 的方法 imageEditor.create(ref, {})
 * 
 */

export class Editor {
  private ref: HTMLElement
  width: number
  height: number
  private imgUrl: string
  anchorUrl?: string
  pageX: number
  pageY: number
  onAnchorDragging = false
  draggingTarget = ''
  anchors: Anchor[]
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

  constructor(props: IEditorProps) {
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
    this.init()
    this.anchors = Anchor.create(props.anchors, this)
    
    makeObservable(this, {
      anchors: observable,
      anchorMeta: computed,
      onAnchorDragging: observable,
      draggingTarget: observable,
      startPosition: observable.struct
    })
  }

  private init = () => {
    this.ref.style.backgroundImage = `url('${this.imgUrl}')`
  }

  effect = () => {
    const listener = () => {
      this.draggingTarget = ''
      this.onAnchorDragging = false
    }
    this.ref.addEventListener('mouseup', listener)
    return () => {
      this.ref.removeEventListener('mouseup', listener)
    }
  }

  get anchorMeta() {
    return this.anchors?.map(anchor => {
      return {
        left: anchor.offsetLeft,
        top: anchor.offsetTop,
        id: anchor.uuid,
        effect: anchor.effect
      }
    })
  }

  updatePosition = (id: string, position: Position) => {
    const anchor = this.anchors.find(anchor => {
      return anchor.id === id
    })!
    anchor.updatePosition(position)
  }

  static create = (ref: HTMLElement, props: EditorFactory): Editor => {
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