export type Position = {
  x: number
  y: number
}

export type DotType = {
  uuid: string // 唯一id
  position: Position // 画布坐标
}

export type IDotProps = DotType