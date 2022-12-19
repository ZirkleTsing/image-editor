import { Dot } from './Dot'
import { IEditorProps, EditorFactory } from '../types'
import { generate } from 'short-uuid'
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
  private width: number
  private height: number
  private imgUrl: string
  private dots: Dot[]

  constructor(props: IEditorProps) {
    this.ref = props.domRef
    this.width = props.domRef.offsetWidth
    this.height = props.domRef.offsetHeight
    this.imgUrl = props.imageUrl
    this.init()
    this.dots = Dot.create(props.dots, this)
  }

  private init = () => {
    this.ref.style.backgroundImage = `url('${this.imgUrl}')`
    this.ref.style.backgroundSize = '100% 100%'
    this.ref.style.backgroundPosition = 'center'
    this.ref.style.backgroundRepeat = 'no-repeat'
    this.ref.style.position = 'relative'
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