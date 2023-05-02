import * as PIXI from 'pixi.js'
import { generatePrimMaze } from './mazeGenerators'

class Maze {
  _width: number
  _height: number
  _cellSize: number
  _wallColor: string
  _wallThickness: number
  _wallsContainer: any
  _grid: any
  _gridWalls: any

  constructor() {
    this._width = 850
    this._height = 550
    this._cellSize = 100
    this._wallColor = '4d4d4d'
    this._wallThickness = 6
    this.grid = generatePrimMaze(this.width, this.height, this.cellSize)
  }

  get width(): number {
    return this._width
  }
  get height(): number {
    return this._height
  }
  get cellSize(): number {
    return this._cellSize
  }
  get wallThickness(): number {
    return this._wallThickness
  }
  get wallColor(): string {
    return this._wallColor
  }
  get grid(): any {
    return this._grid
  }
  set grid(val: any) {
    this._grid = val
  }
  get gridWalls(): any {
    return this._gridWalls
  }
  set gridWalls(val: any) {
    this._gridWalls = val
  }
  get wallsContainer(): any {
    return this._wallsContainer
  }
  set wallsContainer(val: any) {
    this._wallsContainer = val
  }

  draw(scene: any): void {
    this.wallsContainer = new PIXI.Container()
    for (let i = 0; i < this.grid.length; i++) {
      const row = this.grid[i]
      for (let j = 0; j < row.length; j++) {
        const cell = row[j]

        // 水平
        const hw = this.cellSize + this.wallThickness / 2
        const hh = this.wallThickness
        const hx = cell.x + hw / 2
        const hy = cell.y + hh / 2

        // 垂直
        const vw = this.wallThickness
        const vh = this.cellSize + this.wallThickness / 2
        const vx = cell.x + vw / 2
        const vy = cell.y + vh / 2

        // 先画顶部和左边的墙 每个格子的墙有重复，比如第一个格子的右墙等于第二个格子的左墙
        if (cell.walls.top) {
          const topWall = new PIXI.Graphics()
          topWall.beginFill(this.wallColor)
          topWall.drawRect(-hw / 2, -hh / 2, hw, hh)
          topWall.endFill()
          topWall.position.set(hx, hy)
          this.wallsContainer.addChild(topWall)
        }
        if (cell.walls.left) {
          const leftWall = new PIXI.Graphics()
          leftWall.beginFill(this.wallColor)
          leftWall.drawRect(-vw / 2, -vh / 2, vw, vh)
          leftWall.endFill()
          leftWall.position.set(vx, vy)
          this.wallsContainer.addChild(leftWall)
        }
        // 补齐
        if (i == this.grid.length - 1) {
          if (cell.walls.bottom) {
            const bottomWall = new PIXI.Graphics()
            bottomWall.beginFill(this.wallColor)
            bottomWall.drawRect(-hw / 2, -hh / 2 + this.cellSize, hw, hh)
            bottomWall.endFill()
            bottomWall.position.set(hx, hy)
            this.wallsContainer.addChild(bottomWall)
          }
        }
        if (j == row.length - 1) {
          if (cell.walls.right) {
            const rightWall = new PIXI.Graphics()
            rightWall.beginFill(this.wallColor)
            rightWall.drawRect(-vw / 2 + this.cellSize, -vh / 2, vw, vh)
            rightWall.endFill()
            rightWall.position.set(vx, vy)
            this.wallsContainer.addChild(rightWall)
          }
        }
      }
    }
    scene.addChild(this.wallsContainer)
    this.gridWalls = getWallsByGrid(this.grid, this.cellSize, this.wallThickness)
  }
}

function getWallsByGrid(grid: any, cellSize: number, wallThickness: number) {
  const numRows = grid.length
  const numCols = grid[0].length

  const gridMap = new Map()

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const neighborsWalls = []

      // 水平
      const hw = cellSize + wallThickness / 2
      const hh = wallThickness
      // 垂直
      const vw = wallThickness
      const vh = cellSize + wallThickness / 2

      // 当前格子的邻居格子(上下左右)
      const neighborsGrid = getNeighbors(row, col, grid)
      for (let i = 0; i < neighborsGrid.length; i++) {
        const currentGrid = neighborsGrid[i]
        const hx = currentGrid.x + hw / 2
        const hy = currentGrid.y + hh / 2
        const vx = currentGrid.x + vw / 2
        const vy = currentGrid.y + vh / 2
        if (currentGrid.walls.top) {
          neighborsWalls.push({
            direction: '0-top',
            wallCenterX: hx,
            wallCenterY: hy,
            wallWidth: hw,
            wallHeight: hh
          })
        }
        if (currentGrid.walls.left) {
          neighborsWalls.push({
            direction: '0-left',
            wallCenterX: vx,
            wallCenterY: vy,
            wallWidth: vw,
            wallHeight: vh
          })
        }
        if (currentGrid.walls.bottom) {
          neighborsWalls.push({
            direction: '0-bottom',
            wallCenterX: hx,
            wallCenterY: hy + cellSize,
            wallWidth: hw,
            wallHeight: hh
          })
        }
        if (currentGrid.walls.right) {
          neighborsWalls.push({
            direction: '0-right',
            wallCenterX: vx + cellSize,
            wallCenterY: vy,
            wallWidth: vw,
            wallHeight: vh
          })
        }
      }

      gridMap.set(`${row},${col}`, neighborsWalls)
    }
  }

  return gridMap
}

function getNeighbors(row: number, col: number, grid: any): any[] {
  const neighbors: any[] = []

  // 当前格子
  neighbors.push(grid[row][col])

  // 上面的格子
  if (row > 0) {
    neighbors.push(grid[row - 1][col])
  }

  // 下面的格子
  if (row < grid.length - 1) {
    neighbors.push(grid[row + 1][col])
  }

  // 左边的格子
  if (col > 0) {
    neighbors.push(grid[row][col - 1])
  }

  // 右边的格子
  if (col < grid[0].length - 1) {
    neighbors.push(grid[row][col + 1])
  }

  return neighbors
}

export default Maze
