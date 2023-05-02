import { MazeMap, Player } from '@/types/game/online'
import * as PIXI from 'pixi.js'

export function drawMazeMap(mazeMap: MazeMap) {
  const wallsContainer = new PIXI.Container()

  const m = []
  for (let i = 0; i < mazeMap.grids.length; i++) {
    const maze = []
    if (mazeMap.grids[i].grid !== undefined) {
      for (let j = 0; j < mazeMap.grids[i].grid.length; j++) {
        maze.push(mazeMap.grids[i].grid[j])
      }
      m.push(maze)
    }
  }

  for (let i = 0; i < m.length; i++) {
    const row = m[i]
    for (let j = 0; j < row.length; j++) {
      const cell = row[j]

      if (cell.X === undefined) {
        cell.X = 0
      }
      if (cell.Y === undefined) {
        cell.Y = 0
      }
      if (cell.row === undefined) {
        cell.row = 0
      }
      if (cell.col === undefined) {
        cell.col = 0
      }
      if (cell.walls.Top === undefined) {
        cell.walls.Top = false
      }
      if (cell.walls.Bottom === undefined) {
        cell.walls.Bottom = false
      }
      if (cell.walls.Left === undefined) {
        cell.walls.Left = false
      }
      if (cell.walls.Right === undefined) {
        cell.walls.Right = false
      }

      // 水平
      const hw = mazeMap.cellSize + mazeMap.wallThickness / 2
      const hh = mazeMap.wallThickness
      const hx = cell.X + hw / 2
      const hy = cell.Y + hh / 2

      // 垂直
      const vw = mazeMap.wallThickness
      const vh = mazeMap.cellSize + mazeMap.wallThickness / 2
      const vx = cell.X + vw / 2
      const vy = cell.Y + vh / 2

      // console.log(hw,hh,hx,hy)
      // console.log(vw,vh,vx,vy)
      // console.log(cell.walls.top)

      // 先画顶部和左边的墙 每个格子的墙有重复，比如第一个格子的右墙等于第二个格子的左墙
      if (cell.walls.Top) {
        const topWall = new PIXI.Graphics()
        topWall.beginFill(mazeMap.color)
        topWall.drawRect(-hw / 2, -hh / 2, hw, hh)
        topWall.endFill()
        topWall.position.set(hx, hy)
        wallsContainer.addChild(topWall)
      }
      if (cell.walls.Left) {
        const leftWall = new PIXI.Graphics()
        leftWall.beginFill(mazeMap.color)
        leftWall.drawRect(-vw / 2, -vh / 2, vw, vh)
        leftWall.endFill()
        leftWall.position.set(vx, vy)
        wallsContainer.addChild(leftWall)
      }
      // 补齐
      if (i == mazeMap.grids.length - 1) {
        if (cell.walls.Bottom) {
          const bottomWall = new PIXI.Graphics()
          bottomWall.beginFill(mazeMap.color)
          bottomWall.drawRect(-hw / 2, -hh / 2 + mazeMap.cellSize, hw, hh)
          bottomWall.endFill()
          bottomWall.position.set(hx, hy)
          wallsContainer.addChild(bottomWall)
        }
      }
      if (j == row.length - 1) {
        if (cell.walls.Right) {
          const rightWall = new PIXI.Graphics()
          rightWall.beginFill(mazeMap.color)
          rightWall.drawRect(-vw / 2 + mazeMap.cellSize, -vh / 2, vw, vh)
          rightWall.endFill()
          rightWall.position.set(vx, vy)
          wallsContainer.addChild(rightWall)
        }
      }
    }
  }
  return wallsContainer
}

export function drawPlayer(player: Player) {
  const tankGraphics = new PIXI.Graphics()

  tankGraphics.lineStyle(1, 0x000000, 1) // 边框
  tankGraphics
    .beginFill(player.color)
    .drawRect(-player.width / 2, -player.height / 2, player.width, player.height)
    .endFill()

  // 炮管转盘
  tankGraphics.beginFill(player.color)
  tankGraphics.drawCircle(0, 0, 10)
  tankGraphics.endFill()
  // 计算炮管的位置，使其居中在坦克身体的上方
  const cannonWidth = 8
  const cannonHeight = 25
  const cannonX = -cannonWidth / 2
  const cannonY = -cannonHeight
  // 绘制炮管的矩形部分
  tankGraphics.beginFill(player.color)
  tankGraphics.drawRect(cannonX, cannonY, cannonWidth, cannonHeight)
  tankGraphics.endFill()

  // 位置与旋转弧度
  tankGraphics.rotation = player.rotation
  tankGraphics.position.set(player.centerX, player.centerY)
  return tankGraphics
}
