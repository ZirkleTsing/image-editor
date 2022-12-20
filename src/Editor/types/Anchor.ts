export type Position = {
  x: number
  y: number
}

export type AnchorType<E = any> = {
  uuid: string // 唯一id
  position: Position // 画布坐标
  extra: E
}