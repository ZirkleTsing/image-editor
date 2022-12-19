import { generate } from 'short-uuid'
import { makeObservable, observable, computed } from 'mobx'
import { Dot } from './Dot'
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
  dotUrl?: string
  pageX: number
  pageY: number
  onDotDragging = false
  draggingTarget = ''
  dots: Dot[]
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
    this.dotUrl = props.dotUrl
    this.limit = {
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom
    }
    this.init()
    this.dots = Dot.create(props.dots, this)
    
    makeObservable(this, {
      dots: observable,
      dotMeta: computed,
      onDotDragging: observable,
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
      this.onDotDragging = false
    }
    this.ref.addEventListener('mouseup', listener)
    return () => {
      this.ref.removeEventListener('mouseup', listener)
    }
  }

  get dotMeta() {
    return this.dots?.map(dot => {
      return {
        left: dot.offsetLeft,
        top: dot.offsetTop,
        id: dot.uuid,
        effect: dot.effect
      }
    })
  }

  updatePosition = (id: string, position: Position) => {
    const dot = this.dots.find(dot => {
      return dot.id === id
    })!
    dot.updatePosition(position)
  }

  static create = (ref: HTMLElement, props: EditorFactory): Editor => {
    return new Editor({
      domRef: ref,
      ...props,
      dots: props.dots?.map(dot => {
        return {
          ...dot,
          uuid: generate()
        }
      })
    })
  }
}