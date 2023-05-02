export interface Vec {
  x: number
  y: number
}

export interface Circle {
  x: number
  y: number
  radius: number
}

export interface Rect {
  x: number
  y: number
  width: number
  height: number
  rotation: number
}

export interface OBB {
  center: [number, number]
  halfExtents: [number, number]
  rotation: number
}

export interface AABB {
  left: number
  top: number
  right: number
  bottom: number
}
