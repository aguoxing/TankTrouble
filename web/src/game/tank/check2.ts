import { Circle1, Rect1 } from '@/types/game/tank'
import Maze from './maze'

type Vector2D = {
  x: number
  y: number
}

interface OBB {
  center: Vector2D
  halfExtents: Vector2D
  axis: Vector2D[]
  angle: number
}

interface Circle {
  center: Vector2D
  radius: number
}

export function isCollide(rect1: OBB, rect2: OBB): boolean {
  const axes = [...rect1.axis, ...rect2.axis]

  for (let i = 0; i < axes.length; i++) {
    const axis = axes[i]

    const proj1 = project(rect1, axis)
    const proj2 = project(rect2, axis)

    if (proj1.max < proj2.min || proj1.min > proj2.max) {
      return false
    }
  }
  return true
}
function project(rect: OBB, axis: Vector2D): { min: number; max: number } {
  const v = [rect.halfExtents.x, rect.halfExtents.y]
  const u = [axis.x, axis.y]

  const proj = Math.abs(u[0] * v[0]) + Math.abs(u[1] * v[1])
  const pos = [rect.center.x, rect.center.y]

  const projCenter = u[0] * pos[0] + u[1] * pos[1]
  const projMin = projCenter - proj
  const projMax = projCenter + proj

  return {
    min: projMin,
    max: projMax
  }
}

export function isCollide2(ob1: OBB, ob2: OBB): boolean {
  const axes1 = getAxes(ob1)
  const axes2 = getAxes(ob2)

  for (const axis of [...axes1, ...axes2]) {
    let min1 = Infinity,
      max1 = -Infinity
    let min2 = Infinity,
      max2 = -Infinity

    for (const point of [
      { x: -1, y: -1 },
      { x: -1, y: 1 },
      { x: 1, y: -1 },
      { x: 1, y: 1 }
    ]) {
      const projection1 = ob1.center.x * axis.x + ob1.center.y * axis.y
      const projection2 = ob2.center.x * axis.x + ob2.center.y * axis.y
      const pointProjection = (point.x * ob1.halfExtents.x * axis.x + point.y * ob1.halfExtents.y * axis.y) * Math.sign(projection1)
      min1 = Math.min(min1, projection1 - pointProjection)
      max1 = Math.max(max1, projection1 + pointProjection)

      const pointProjection2 = (point.x * ob2.halfExtents.x * axis.x + point.y * ob2.halfExtents.y * axis.y) * Math.sign(projection2)
      min2 = Math.min(min2, projection2 - pointProjection2)
      max2 = Math.max(max2, projection2 + pointProjection2)
    }

    if (max1 < min2 || max2 < min1) {
      return false
    }
  }

  return true
}
function rotateVector(vector: { x: number; y: number }, angle: number): { x: number; y: number } {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  return {
    x: vector.x * cos - vector.y * sin,
    y: vector.x * sin + vector.y * cos
  }
}
function getAxes(ob: OBB): [{ x: number; y: number }, { x: number; y: number }] {
  const xAxis = rotateVector({ x: 1, y: 0 }, ob.angle)
  const yAxis = rotateVector({ x: 0, y: 1 }, ob.angle)
  return [xAxis, yAxis]
}

export function isCollide3(obb1: OBB, obb2: OBB) {
  const axes = [
    { x: Math.cos(obb1.angle), y: Math.sin(obb1.angle) },
    { x: -Math.sin(obb1.angle), y: Math.cos(obb1.angle) },
    { x: Math.cos(obb2.angle), y: Math.sin(obb2.angle) },
    { x: -Math.sin(obb2.angle), y: Math.cos(obb2.angle) }
  ]

  for (let i = 0; i < axes.length; i++) {
    const axis = axes[i]
    const projection1 = getProjection(obb1, axis)
    const projection2 = getProjection(obb2, axis)

    if (!isOverlap(projection1, projection2)) {
      return false
    }
  }

  return true
}
function getProjection(obb: OBB, axis: Vector2D) {
  const vertices = [
    { x: -obb.halfExtents.x, y: -obb.halfExtents.y },
    { x: obb.halfExtents.x, y: -obb.halfExtents.y },
    { x: obb.halfExtents.x, y: obb.halfExtents.y },
    { x: -obb.halfExtents.x, y: obb.halfExtents.y }
  ]

  const points = vertices.map(v => {
    const x = v.x * Math.cos(obb.angle) - v.y * Math.sin(obb.angle) + obb.center.x
    const y = v.x * Math.sin(obb.angle) + v.y * Math.cos(obb.angle) + obb.center.y
    return { x, y }
  })

  const dotProducts = points.map(p => p.x * axis.x + p.y * axis.y)
  const min = Math.min(...dotProducts)
  const max = Math.max(...dotProducts)

  return { min, max }
}
function isOverlap(projection1: { min: number; max: number }, projection2: { min: number; max: number }) {
  return projection1.min <= projection2.max && projection1.max >= projection2.min
}

// 坦克与墙
export function check3(tank: any, maze: Maze): boolean {
  const wallsMap = maze.gridWalls
  // const tankObb = new OBB(tank.nextX, tank.nextY, tank.width, tank.height, tank.rotation)
  const tankObb = {
    center: { x: tank.nextX, y: tank.nextY },
    halfExtents: { x: tank.width / 2, y: tank.height / 2 },
    angle: tank.rotation,
    axis: [
      { x: 0, y: 0 },
      { x: 0, y: 0 }
    ]
  }
  const gridRow = Math.floor(tank.nextY / maze.cellSize)
  const gridCol = Math.floor(tank.nextX / maze.cellSize)
  // console.log(`${tank.nextX},${tank.nextY}`)
  // console.log(`${gridRow},${gridCol}`)
  // console.log(wallsMap.get(`${gridRow},${gridCol}`))

  const walls = wallsMap.get(`${gridRow},${gridCol}`)
  for (let i = 0; i < walls.length; i++) {
    const wallObb = {
      center: { x: walls[i].wallCenterX, y: walls[i].wallCenterY },
      halfExtents: { x: walls[i].wallWidth / 2, y: walls[i].wallHeight / 2 },
      angle: 0,
      axis: [
        { x: 0, y: 0 },
        { x: 0, y: 0 }
      ]
    }
    if (isCollide3(wallObb, tankObb)) {
      console.log(walls[i])
      return true
    }
  }
  return false
}

// 子弹与墙
export function checkBullet3(bullet: any, maze: Maze): any {
  const wallsMap = maze.gridWalls
  const res = { hitWall: false, wall: 'null' }
  // 检查子弹是否与迷宫的墙壁碰撞
  const gridRow = Math.floor(bullet.y / maze.cellSize)
  const gridCol = Math.floor(bullet.x / maze.cellSize)

  const bulletCircle: Circle1 = {
    x: bullet.x,
    y: bullet.y,
    radius: bullet.radius
  }

  const walls = wallsMap.get(`${gridRow},${gridCol}`)
  for (let i = 0; i < walls.length; i++) {
    const wallRect: Rect1 = {
      x: walls[i].wallCenterX,
      y: walls[i].wallCenterY,
      width: walls[i].wallWidth,
      height: walls[i].wallHeight,
      angle: 0
    }
    if (circleRectOverlap(bulletCircle, wallRect)) {
      console.log(walls[i])
      res.hitWall = true
      res.wall = walls[i].direction.split('-')[1]
      return res
    }
  }
  return res
}

interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export function rectCircleColliding(rect: Rect, circle: Circle): boolean {
  // 将矩形的坐标系移到圆心
  const dx = circle.center.x - (rect.x + rect.width / 2)
  const dy = circle.center.y - (rect.y + rect.height / 2)

  // 矩形的四条边的向量
  const edges: Vector2D[] = [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 0, y: -1 }
  ]

  // 对于每条边，计算圆心到边的垂线长度
  for (const edge of edges) {
    const len = Math.abs(dx * edge.x + dy * edge.y)

    // 如果垂线长度小于等于圆的半径，说明相交
    if (len <= circle.radius) {
      return true
    }
  }

  // 判断圆心是否在矩形内部
  if (dx >= -rect.width / 2 && dx <= rect.width / 2 && dy >= -rect.height / 2 && dy <= rect.height / 2) {
    return true
  }

  // 判断圆心是否在矩形的顶点之一
  const corners: Vector2D[] = [
    { x: rect.x, y: rect.y },
    { x: rect.x + rect.width, y: rect.y },
    { x: rect.x, y: rect.y + rect.height },
    { x: rect.x + rect.width, y: rect.y + rect.height }
  ]

  for (const corner of corners) {
    const dx2 = circle.center.x - corner.x
    const dy2 = circle.center.y - corner.y

    if (dx2 * dx2 + dy2 * dy2 <= circle.radius * circle.radius) {
      return true
    }
  }

  // 没有相交
  return false
}

function rotatePoint(x: number, y: number, angle: number) {
  const rad = (angle * Math.PI) / 180
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)
  return {
    x: x * cos - y * sin,
    y: x * sin + y * cos
  }
}
function pointInRect(point: { x: number; y: number }, rect: Rect1): boolean {
  const { x, y, width, height, angle } = rect
  const p = rotatePoint(point.x - x, point.y - y, -angle)
  return p.x >= -width / 2 && p.x <= width / 2 && p.y >= -height / 2 && p.y <= height / 2
}
export function circleRectOverlap(circle: Circle1, rect: Rect1): boolean {
  const { x, y, radius } = circle
  const topLeft = { x: x - radius, y: y - radius }
  const topRight = { x: x + radius, y: y - radius }
  const bottomLeft = { x: x - radius, y: y + radius }
  const bottomRight = { x: x + radius, y: y + radius }

  return pointInRect(topLeft, rect) || pointInRect(topRight, rect) || pointInRect(bottomLeft, rect) || pointInRect(bottomRight, rect)
}


export function checkCollision(circle: Circle1, rectangle: Rect1): boolean {
  // 计算圆心在矩形局部坐标系中的坐标
  const circleX = circle.x - rectangle.x;
  const circleY = circle.y - rectangle.y;

  // 计算圆心在矩形局部坐标系中的最近点
  const closestX = Math.max(rectangle.x, Math.min(circleX, rectangle.x + rectangle.width));
  const closestY = Math.max(rectangle.y, Math.min(circleY, rectangle.y + rectangle.height));

  // 计算圆心与最近点的距离
  const distanceX = circleX - closestX;
  const distanceY = circleY - closestY;
  const distanceSquared = distanceX * distanceX + distanceY * distanceY;

  console.log("check...");

  // 判断距离是否小于圆的半径的平方，若是则发生碰撞
  return distanceSquared <= circle.radius * circle.radius;
}

export function calculateReflection(circle: Circle1, rectangle: Rect1): number {
  // 计算圆心在矩形局部坐标系中的坐标
  const circleX = circle.x - rectangle.x;
  const circleY = circle.y - rectangle.y;

  // 计算圆心与矩形的相对位置关系
  const relativeX = circleX - rectangle.width / 2;
  const relativeY = circleY - rectangle.height / 2;

  // 计算碰撞角度
  const collisionAngle = Math.atan2(relativeY, relativeX);

  // 计算反弹角度
  const reflectionAngle = Math.PI - collisionAngle;

  // 将反弹角度转换为度数
  const reflectionAngleDegrees = reflectionAngle * 180 / Math.PI;

  return reflectionAngleDegrees;
}
