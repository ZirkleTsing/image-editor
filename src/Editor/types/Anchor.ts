export type Position = {
  x: number
  y: number
}

export type AnchorType = {
  uuid: string // 唯一id
  position: Position // 画布坐标
}

export type IAnchorProps = AnchorType