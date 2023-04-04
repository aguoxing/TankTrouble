import * as PIXI from 'pixi.js'
import { generatePrimMaze } from './mazeGenerators'

class Maze {
  _width: number
  _height: number
  _cellSize: number
  _wallColor: string
  _wallThickness: number
  _wallGraphics: any
  _grid: any
  _gridWalls: any

  constructor() {
    this._width = 850
    this._height = 550
    this._cellSize = 100
    this._wallColor = '4d4d4d'
    this._wallThickness = 5
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
  get wallGraphics(): any {
    return this._wallGraphics
  }
  set wallGraphics(val: any) {
    this._wallGraphics = val
  }

  draw(): void {
    this.wallGraphics = new PIXI.Graphics()
    for (let i = 0; i < this.grid.length; i++) {
      const row = this.grid[i]
      for (let j = 0; j < row.length; j++) {
        const cell = row[j]
        const x = j * this.cellSize
        const y = i * this.cellSize

        // 先画顶部和左边的墙 每个格子的墙有重复，比如第一个格子的右墙等于第二个格子的左墙
        if (cell.walls.top) {
          this.wallGraphics.beginFill(this.wallColor)
          this.wallGraphics.drawRect(x, y, this.cellSize + this.wallThickness, this.wallThickness)
          this.wallGraphics.endFill()
        }
        if (cell.walls.left) {
          this.wallGraphics.beginFill(this.wallColor)
          this.wallGraphics.drawRect(x, y, this.wallThickness, this.cellSize + this.wallThickness)
          this.wallGraphics.endFill()
        }
        // 补齐
        if (i == this.grid.length - 1) {
          if (cell.walls.bottom) {
            this.wallGraphics.beginFill(this.wallColor)
            this.wallGraphics.drawRect(x, y + this.cellSize, this.cellSize + this.wallThickness, this.wallThickness)
            this.wallGraphics.endFill()
          }
        }
        if (j == row.length - 1) {
          if (cell.walls.right) {
            this.wallGraphics.beginFill(this.wallColor)
            this.wallGraphics.drawRect(x + this.cellSize, y, this.wallThickness, this.cellSize + this.wallThickness)
            this.wallGraphics.endFill()
          }
        }
      }
    }
    this.gridWalls = getWalls(this.grid, this.cellSize, this.wallThickness)
  }
}

function getWalls(grid: any, cellSize: number, wallThickness: number) {
  const numRows = grid.length
  const numCols = grid[0].length

  const gridMap = new Map()

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const neighbors = []
      // 四周需要判断的墙
      if (row > 0 && col > 0) {
        // 左上
        // neighbors.push([row - 1, col - 1])
        const leftTopGrid = grid[row - 1][col - 1]
        if (leftTopGrid.walls.right) {
          neighbors.push({
            direction: 'leftTop-right',
            wallCenterX: col * cellSize,
            wallCenterY: (row-1) * cellSize + cellSize / 2,
            wallWidth: wallThickness,
            wallHeight: cellSize
          })
        }
        if (leftTopGrid.walls.bottom) {
          neighbors.push({
            direction: 'leftTop-bottom',
            wallCenterX: (col - 1) * cellSize + cellSize / 2,
            wallCenterY: (row + 1) * cellSize,
            wallWidth: cellSize,
            wallHeight: wallThickness
          })
        }
      }
      if (row > 0 && col < numCols - 1) {
        // 右上
        // neighbors.push([row - 1, col + 1])
        const rightTopGrid = grid[row - 1][col + 1]
        if (rightTopGrid.walls.left) {
          neighbors.push({
            direction: 'rightTop-left',
            wallCenterX: (col + 1) * cellSize,
            wallCenterY: (row - 1) * cellSize + cellSize / 2,
            wallWidth: wallThickness,
            wallHeight: cellSize
          })
        }
        if (rightTopGrid.walls.bottom) {
          neighbors.push({
            direction: 'rightTop-bottom',
            wallCenterX: (col + 1) * cellSize + cellSize / 2,
            wallCenterY: (row - 1) * cellSize,
            wallWidth: cellSize,
            wallHeight: wallThickness
          })
        }
      }
      if (row < numRows - 1 && col > 0) {
        // 左下
        // neighbors.push([row + 1, col - 1])
        const leftBottomGrid = grid[row + 1][col - 1]
        if (leftBottomGrid.walls.right) {
          neighbors.push({
            direction: 'leftBottom-right',
            wallCenterX: col * cellSize,
            wallCenterY: (row + 1) * cellSize + cellSize / 2,
            wallWidth: wallThickness,
            wallHeight: cellSize
          })
        }
        if (leftBottomGrid.walls.top) {
          neighbors.push({
            direction: 'leftBottom-top',
            wallCenterX: (col - 1) * cellSize + cellSize / 2,
            wallCenterY: (row + 1) * cellSize,
            wallWidth: cellSize,
            wallHeight: wallThickness
          })
        }
      }
      if (row < numRows - 1 && col < numCols - 1) {
        // 右下
        // neighbors.push([row + 1, col + 1])
        const rightBottomGrid = grid[row + 1][col + 1]
        if (rightBottomGrid.walls.left) {
          neighbors.push({
            direction: 'rightBottom-left',
            wallCenterX: (col + 1) * cellSize,
            wallCenterY: (row + 1) * cellSize + cellSize / 2,
            wallWidth: wallThickness,
            wallHeight: cellSize
          })
        }
        if (rightBottomGrid.walls.top) {
          neighbors.push({
            direction: 'rightBottom-top',
            wallCenterX: (col + 1) * cellSize + cellSize / 2,
            wallCenterY: (row + 1) * cellSize,
            wallWidth: cellSize,
            wallHeight: wallThickness
          })
        }
      }

      // 当前格子需要判断的墙
      const currentGrid = grid[row][col]
      if (currentGrid.walls.top) {
        neighbors.push({
          direction: '0-top',
          wallCenterX: col * cellSize + cellSize / 2,
          wallCenterY: row * cellSize,
          wallWidth: cellSize,
          wallHeight: wallThickness
        })
      }
      if (currentGrid.walls.bottom) {
        neighbors.push({
          direction: '0-bottom',
          wallCenterX: col * cellSize + cellSize / 2,
          wallCenterY: (row + 1) * cellSize,
          wallWidth: cellSize,
          wallHeight: wallThickness
        })
      }
      if (currentGrid.walls.left) {
        neighbors.push({
          direction: '0-left',
          wallCenterX: col * cellSize,
          wallCenterY: row * cellSize + cellSize / 2,
          wallWidth: wallThickness,
          wallHeight: cellSize
        })
      }
      if (currentGrid.walls.right) {
        neighbors.push({
          direction: '0-right',
          wallCenterX: (col + 1) * cellSize,
          wallCenterY: row * cellSize + cellSize / 2,
          wallWidth: wallThickness,
          wallHeight: cellSize
        })
      }
      gridMap.set(`${row},${col}`, neighbors)
    }
  }
  return gridMap
}

export default Maze
