export type MazeMap = {
  id: string
  cellSize: number
  color: string
  width: number
  height: number
  wallThickness: number
  grids: grid[][]
}

type grid = {
  x: number
  y: number
  row: number
  col: number
  visited: boolean
  walls: wall
}

type wall = {
  top: boolean
  bottom: boolean
  left: boolean
  right: boolean
}

export type Players = {
  players: Player[]
}

export type Player = {
  id: number
  name: string
  color: string
  alive: boolean
  width: number
  height: number
  centerX: number
  centerY: number
  rotation: number
  bulletNum: number
}

export type Position = {
  x: number
  y: number
}

export type keyword = {
  key: string
  val: boolean
}
