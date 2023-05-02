// import OBB from './obb'
import Maze from './maze'
import { AABB, Circle, Rect, Vec, OBB } from '@/types/game/tank'

// 坦克与墙碰撞检测 矩形与矩形
export function check3(tank: any, maze: Maze): boolean {
  const wallsMap = maze.gridWalls
  // const tankObb = new OBB(tank.nextX, tank.nextY, tank.width, tank.height, tank.rotation)
  const tankObb: OBB = {
    center: [tank.nextX, tank.nextY],
    halfExtents: [tank.width / 2, tank.height / 2],
    rotation: tank.rotation
  }
  const gridRow = Math.floor(tank.nextY / maze.cellSize)
  const gridCol = Math.floor(tank.nextX / maze.cellSize)
  // console.log(`${tank.nextX},${tank.nextY}`)
  // console.log(`${gridRow},${gridCol}`)
  console.log(wallsMap.get(`${gridRow},${gridCol}`))

  const walls = wallsMap.get(`${gridRow},${gridCol}`)
  for (let i = 0; i < walls.length; i++) {
    // const wallObb = new OBB(walls[i].wallCenterX, walls[i].wallCenterY, walls[i].wallWidth, walls[i].wallHeight, 0)
    // if (tankObb.isIntersecting(wallObb)) {
    // return true
    // }
    const wallObb: OBB = {
      center: [walls[i].wallCenterX, walls[i].wallCenterY],
      halfExtents: [walls[i].wallWidth / 2, walls[i].wallHeight / 2],
      rotation: 0
    }
    if (obbIntersects(tankObb, wallObb)) {
      console.log(walls[i])
      // console.log(tankObb)
      return true
    }
  }
  return false
}
function obbIntersects(obb1: OBB, obb2: OBB): boolean {
  const aabb1 = obbToAabb(obb1)
  const aabb2 = obbToAabb(obb2)

  return aabbIntersects(aabb1, aabb2)
}
function obbToAabb(obb: OBB): AABB {
  const cos = Math.cos(obb.rotation)
  const sin = Math.sin(obb.rotation)

  const x = obb.center[0]
  const y = obb.center[1]

  const w = obb.halfExtents[0]
  const h = obb.halfExtents[1]

  const rx = Math.abs(w * cos) + Math.abs(h * sin)
  const ry = Math.abs(w * sin) + Math.abs(h * cos)

  return {
    left: x - rx,
    top: y - ry,
    right: x + rx,
    bottom: y + ry
  }
}
function aabbIntersects(aabb1: AABB, aabb2: AABB): boolean {
  return aabb1.left < aabb2.right && aabb1.right > aabb2.left && aabb1.top < aabb2.bottom && aabb1.bottom > aabb2.top
}

// 子弹与墙碰撞检测 圆与矩形
export function checkBullet(bullet: any, maze: Maze) {
  const res = { hitWall: false, wall: 'null' }
  // 检查子弹是否与迷宫的墙壁碰撞
  const gridRow = Math.floor(bullet.y / maze.cellSize)
  const gridCol = Math.floor(bullet.x / maze.cellSize)

  if (gridRow >= 0 && gridRow < maze.grid.length && gridCol >= 0 && gridCol < maze.grid[0].length) {
    const currentGrid = maze.grid[gridRow][gridCol]
    if (currentGrid.walls.top && bullet.y < currentGrid.row * maze.cellSize + (bullet.radius * 2 + maze.wallThickness / 2)) {
      res.hitWall = true
      res.wall = 'top'
      return res
    }
    if (currentGrid.walls.right && bullet.x > (currentGrid.col + 1) * maze.cellSize - (bullet.radius * 2 + maze.wallThickness)) {
      res.hitWall = true
      res.wall = 'right'
      return res
    }
    if (currentGrid.walls.bottom && bullet.y > (currentGrid.row + 1) * maze.cellSize - (bullet.radius * 2 + maze.wallThickness / 2)) {
      res.hitWall = true
      res.wall = 'bottom'
      return res
    }
    if (currentGrid.walls.left && bullet.x < currentGrid.col * maze.cellSize + (bullet.radius * 2 + maze.wallThickness)) {
      res.hitWall = true
      res.wall = 'left'
      return res
    }
  }
  return res
}
export function checkBullet2(bullet: any, maze: Maze) {
  const res = { hitWall: false, wall: 'null' }
  // 检查子弹是否与迷宫的墙壁碰撞
  const gridRow = Math.floor(bullet.y / maze.cellSize)
  const gridCol = Math.floor(bullet.x / maze.cellSize)

  if (gridRow >= 0 && gridRow < maze.grid.length && gridCol >= 0 && gridCol < maze.grid[0].length) {
    const currentGrid = maze.grid[gridRow][gridCol]
    const bulletCircle = {
      x: bullet.x,
      y: bullet.y,
      radius: bullet.radius
    }
    const bulletRectObb: OBB = {
      center: [bullet.x, bullet.y],
      halfExtents: [bullet.radius, bullet.radius],
      rotation: bullet.rotation
    }
    const topWallRectObb: OBB = {
      center: [currentGrid.col * maze.cellSize + maze.cellSize / 2, currentGrid.row * maze.cellSize],
      halfExtents: [maze.cellSize / 2, maze.wallThickness / 2],
      rotation: 0
    }
    const topWallRect: Rect = {
      x: currentGrid.col * maze.cellSize + maze.cellSize / 2,
      y: currentGrid.row * maze.cellSize,
      width: maze.cellSize,
      height: maze.wallThickness,
      rotation: 0
    }
    const rightWallRectObb: OBB = {
      center: [(currentGrid.col + 1) * maze.cellSize, currentGrid.row * maze.cellSize + maze.cellSize / 2],
      halfExtents: [maze.wallThickness / 2, maze.cellSize / 2],
      rotation: 0
    }
    const rightWallRect: Rect = {
      x: (currentGrid.col + 1) * maze.cellSize,
      y: currentGrid.row * maze.cellSize + maze.cellSize / 2,
      width: maze.wallThickness,
      height: maze.cellSize,
      rotation: 0
    }
    const bottomWallRectObb: OBB = {
      center: [currentGrid.col * maze.cellSize + maze.cellSize / 2, (currentGrid.row + 1) * maze.cellSize],
      halfExtents: [maze.cellSize / 2, maze.wallThickness / 2],
      rotation: 0
    }
    const bottomWallRect: Rect = {
      x: currentGrid.col * maze.cellSize + maze.cellSize / 2,
      y: (currentGrid.row + 1) * maze.cellSize,
      width: maze.cellSize,
      height: maze.wallThickness,
      rotation: 0
    }
    const leftWallRectObb: OBB = {
      center: [currentGrid.col * maze.cellSize, currentGrid.row * maze.cellSize + maze.cellSize / 2],
      halfExtents: [maze.wallThickness / 2, maze.cellSize / 2],
      rotation: 0
    }
    const leftWallRect: Rect = {
      x: currentGrid.col * maze.cellSize,
      y: currentGrid.row * maze.cellSize + maze.cellSize / 2,
      width: maze.wallThickness,
      height: maze.cellSize,
      rotation: 0
    }

    // if (currentGrid.walls.top && isCollidingRectCircle(topWallRect, bulletCircle)) {
    if (currentGrid.walls.top && obbIntersects(topWallRectObb, bulletRectObb)) {
      res.hitWall = true
      res.wall = 'top'
      return res
    }
    // if (currentGrid.walls.right && isCollidingRectCircle(rightWallRect, bulletCircle)) {
    if (currentGrid.walls.right && obbIntersects(rightWallRectObb, bulletRectObb)) {
      res.hitWall = true
      res.wall = 'right'
      return res
    }
    // if (currentGrid.walls.bottom && isCollidingRectCircle(bottomWallRect, bulletCircle)) {
    if (currentGrid.walls.bottom && obbIntersects(bottomWallRectObb, bulletRectObb)) {
      res.hitWall = true
      res.wall = 'bottom'
      return res
    }
    // if (currentGrid.walls.left && isCollidingRectCircle(leftWallRect, bulletCircle)) {
    if (currentGrid.walls.left && obbIntersects(leftWallRectObb, bulletRectObb)) {
      res.hitWall = true
      res.wall = 'left'
      return res
    }
  }
  return res
}
function isRectCircleColliding(rect: Rect, circle: Circle): boolean {
  const circleDistance: Vec = {
    x: Math.abs(circle.x - (rect.x + rect.width / 2)),
    y: Math.abs(circle.y - (rect.y + rect.height / 2))
  }

  if (circleDistance.x > rect.width / 2 + circle.radius) {
    return false
  }

  if (circleDistance.y > rect.height / 2 + circle.radius) {
    return false
  }

  if (circleDistance.x <= rect.width / 2) {
    return true
  }

  if (circleDistance.y <= rect.height / 2) {
    return true
  }

  const cornerDistanceSq = Math.pow(circleDistance.x - rect.width / 2, 2) + Math.pow(circleDistance.y - rect.height / 2, 2)

  return cornerDistanceSq <= Math.pow(circle.radius, 2)
}
function isCollidingRectCircle(rect: Rect, circle: Circle): boolean {
  // 计算圆心与矩形中心点的距离
  const distX = Math.abs(circle.x - rect.x - rect.width / 2)
  const distY = Math.abs(circle.y - rect.y - rect.height / 2)

  // 如果圆心到矩形中心点的距离大于矩形对角线的一半，则一定不相交
  if (distX > rect.width / 2 + circle.radius || distY > rect.height / 2 + circle.radius) {
    return false
  }

  // 如果圆心到矩形中心点的距离小于等于矩形对角线的一半，则一定相交
  if (distX <= rect.width / 2 || distY <= rect.height / 2) {
    return true
  }

  // 否则需要判断圆心是否在矩形的四个角落中
  const dx = distX - rect.width / 2
  const dy = distY - rect.height / 2
  return dx * dx + dy * dy <= circle.radius * circle.radius
}

// 子弹与坦克碰撞检测2 圆与矩形
export function circleInRectangle(rectangle: Rect, circle: Circle): boolean {
  const topRight = { x: rectangle.x + rectangle.width, y: rectangle.y }
  const bottomLeft = { x: rectangle.x, y: rectangle.y + rectangle.height }
  const center = { x: circle.x, y: circle.y }

  if (pointInRectangle(circle.x, circle.y, rectangle)) {
    return true // Circle center is inside rectangle
  }

  const closestX = clamp(center.x, rectangle.x, topRight.x)
  const closestY = clamp(center.y, rectangle.y, bottomLeft.y)

  const distance = Math.sqrt(Math.pow(center.x - closestX, 2) + Math.pow(center.y - closestY, 2))

  return distance < circle.radius // Circle intersects with rectangle
}
function pointInRectangle(x: number, y: number, rectangle: Rect): boolean {
  return x >= rectangle.x && x <= rectangle.x + rectangle.width && y >= rectangle.y && y <= rectangle.y + rectangle.height
}
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

// 子弹与坦克碰撞检测3 圆与矩形(考虑矩形角度)
export function circleRectCollisionWithAngle(rect: Rect, bullet: Circle): boolean {
  // 将圆心坐标转换为相对于矩形左上角的局部坐标系中的坐标
  const dx = bullet.x - rect.x
  const dy = bullet.y - rect.y

  // 根据矩形的旋转角度计算出局部坐标系中的坐标
  const rotatedDx = dx * Math.cos(-rect.rotation) - dy * Math.sin(-rect.rotation)
  const rotatedDy = dx * Math.sin(-rect.rotation) + dy * Math.cos(-rect.rotation)

  // 计算圆心到局部坐标系中的矩形中心的距离
  const distX = Math.abs(rotatedDx - rect.width / 2)
  const distY = Math.abs(rotatedDy - rect.height / 2)

  // 如果圆心到局部坐标系中的矩形中心的距离大于圆的半径和矩形对角线长度的一半，则不相交
  if (distX > rect.width / 2 + bullet.radius || distY > rect.height / 2 + bullet.radius) {
    return false
  }

  // 如果圆心到局部坐标系中的矩形中心的距离小于等于矩形宽度或高度的一半，则相交
  if (distX <= rect.width / 2 || distY <= rect.height / 2) {
    return true
  }

  // 否则，计算圆心到局部坐标系中的矩形四个角的距离
  const cornerDistSquared = Math.pow(distX - rect.width / 2, 2) + Math.pow(distY - rect.height / 2, 2)

  // 如果圆心到局部坐标系中的矩形四个角的距离小于等于圆的半径的平方，则相交
  return cornerDistSquared <= bullet.radius * bullet.radius
}
