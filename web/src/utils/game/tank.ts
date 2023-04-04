import * as PIXI from 'pixi.js'
import Maze from './maze'
import { check3, checkBullet, circleRectCollisionWithAngle } from './check'
import Bullet from './bullet'

const bullets: any[] = []
// 记录上一次发射子弹的时间
let lastShootTime = 0
// 定义最小发射子弹时间间隔为0.2秒
const minShootInterval = 200

class Tank {
  _name: string
  _alive: boolean
  _width: number
  _height: number
  _color: string
  _vx: number
  _vy: number
  _nextX: number
  _nextY: number
  _hitWall: boolean
  _speed: number
  _rotation: number
  _tankGraphics: any
  _bulletNum: number

  constructor(name: string, color: string) {
    this._name = name
    this._alive = true
    this._width = 30
    this._height = 40
    this._color = color
    this._nextX = 0
    this._nextY = 0
    this._hitWall = false
    this._speed = 2
    this._rotation = Math.random() - 0.5
    this._vx = Math.sin(this.rotation)
    this._vy = -Math.cos(this.rotation)
    this._tankGraphics = new PIXI.Graphics()
    this._bulletNum = 5
  }

  get tankGraphics(): any {
    return this._tankGraphics
  }

  get name(): string {
    return this._name
  }
  set name(val: string) {
    this.name = val
  }
  get alive(): boolean {
    return this._alive
  }
  set alive(val: boolean) {
    this._alive = val
  }
  get color(): string {
    return this._color
  }
  set color(val: string) {
    this._color = val
  }
  get width(): number {
    return this._width
  }
  get height(): number {
    return this._height
  }
  get nextX(): number {
    return this._nextX
  }
  set nextX(val: number) {
    this._nextX = val
  }
  get nextY(): number {
    return this._nextY
  }
  set nextY(val: number) {
    this._nextY = val
  }
  get hitWall(): boolean {
    return this._hitWall
  }
  set hitWall(val: boolean) {
    this._hitWall = val
  }
  get rotation(): number {
    return this._rotation
  }
  set rotation(val: number) {
    this._rotation = val
  }
  get bulletNum(): number {
    return this._bulletNum
  }
  set bulletNum(val: number) {
    this._bulletNum = val
  }
  get speed(): number {
    return this._speed
  }
  get vx(): number {
    return this._vx
  }
  set vx(val: number) {
    this._vx = val
  }
  get vy(): number {
    return this._vy
  }
  set vy(val: number) {
    this._vy = val
  }

  drawTank(maze: Maze): void {
    // 随机初始位置
    const random = Math.floor(Math.random() * 10 + 1)
    const x = Math.floor(Math.random() * maze.grid[0].length) * maze.cellSize + (random + maze.cellSize) / 2
    const y = Math.floor(Math.random() * maze.grid.length) * maze.cellSize + (random + maze.cellSize) / 2

    this.tankGraphics.lineStyle(1, 0x000000, 1) // 边框
    this.tankGraphics
      .beginFill(this.color)
      .drawRect(-this.width / 2, -this.height / 2, this.width, this.height)
      .endFill()

    // 炮管转盘
    this.tankGraphics.beginFill(this.color)
    this.tankGraphics.drawCircle(0, 0, 10)
    this.tankGraphics.endFill()
    // 计算炮管的位置，使其居中在坦克身体的上方
    const cannonWidth = 8
    const cannonHeight = 25
    const cannonX = -cannonWidth / 2
    const cannonY = -cannonHeight
    // 绘制炮管的矩形部分
    this.tankGraphics.beginFill(this.color)
    this.tankGraphics.drawRect(cannonX, cannonY, cannonWidth, cannonHeight)
    this.tankGraphics.endFill()

    this.tankGraphics.alive = this.alive
    this.tankGraphics.name = this.name

    // 位置与旋转弧度
    this.tankGraphics.rotation = this.rotation
    this.tankGraphics.position.set(x, y)
  }
  moveForward(mazeMap: Maze): void {
    this.vx = Math.sin(this.rotation)
    this.vy = -Math.cos(this.rotation)
    this.nextX = this.tankGraphics.x + this.vx * this.speed
    this.nextY = this.tankGraphics.y + this.vy * this.speed
    if (this.isCollisionWall(mazeMap)) {
      this.hitWall = true
    } else {
      this.tankGraphics.x = this.nextX
      this.tankGraphics.y = this.nextY
      this.hitWall = false
    }
  }
  moveBackward(mazeMap: Maze): void {
    this.vx = Math.sin(this.rotation)
    this.vy = -Math.cos(this.rotation)
    this.nextX = this.tankGraphics.x - this.vx * this.speed
    this.nextY = this.tankGraphics.y - this.vy * this.speed
    if (this.isCollisionWall(mazeMap)) {
      this.hitWall = true
    } else {
      this.tankGraphics.x = this.nextX
      this.tankGraphics.y = this.nextY
      this.hitWall = false
    }
  }
  rotateLeft(): void {
    // if (!this.hitWall) {
    if (this.tankGraphics.rotation < -Math.PI) {
      this.tankGraphics.rotation += Math.PI * 2
    }
    if (this.tankGraphics.rotation > Math.PI) {
      this.tankGraphics.rotation -= Math.PI * 2
    }
    this.tankGraphics.rotation -= (Math.PI / 180) * 5
    this.rotation = this.tankGraphics.rotation
    // }
  }
  rotateRight(): void {
    // if (!this.hitWall) {
    if (this.tankGraphics.rotation < -Math.PI) {
      this.tankGraphics.rotation += Math.PI * 2
    }
    if (this.tankGraphics.rotation > Math.PI) {
      this.tankGraphics.rotation -= Math.PI * 2
    }
    this.tankGraphics.rotation += (Math.PI / 180) * 5
    this.rotation = this.tankGraphics.rotation
    // }
  }
  fire(container: any): void {
    // 计算当前时间和上一次发射子弹的时间间隔
    const currentTime = new Date().getTime()
    const shootInterval = currentTime - lastShootTime

    // 如果时间间隔大于最小发射子弹时间间隔，则发射子弹
    if (shootInterval >= minShootInterval) {
      const bullet = new Bullet(this._name, this.rotation, this.color)
      bullets.push(bullet)
      // 更新上一次发射子弹的时间为当前时间
      lastShootTime = currentTime
      if (this.tankGraphics.alive && this.bulletNum > 0) {
        bullet.draw(container, this.tankGraphics.x, this.tankGraphics.y)
        this.bulletNum--
      }
    }
  }
  updateBullet(container: any, maze: Maze, playerList: any): void {
    // 更新子弹
    for (let i = 0; i < bullets.length; i++) {
      const currBullet = bullets[i]
      const bulletGraphics = bullets[i].bulletGraphics

      if (currBullet.bounces > 0) {
        const res = checkBullet(bulletGraphics, maze)
        if (res.hitWall) {
          // 左右 则角度取反  上下 则Math.PI - currBullet.direction
          if (res.wall == 'left' || res.wall == 'right') {
            bulletGraphics.rotation = -bulletGraphics.rotation
          } else {
            bulletGraphics.rotation = Math.PI - bulletGraphics.rotation
          }
          bulletGraphics.form = this.name
          bulletGraphics.firstShoot = false
          currBullet.bounces--
        }
        bulletGraphics.x += Math.sin(bulletGraphics.rotation) * currBullet.speed
        bulletGraphics.y += -Math.cos(bulletGraphics.rotation) * currBullet.speed

        if (this.isHitPlayer(container, bulletGraphics, playerList)) {
          bullets.splice(i, 1)
          i--
          // 消失一个后 弹药+1
          this.bulletNum++
        }
      } else {
        // 消失一个后 弹药+1
        this.bulletNum++
        container.removeChild(bulletGraphics)
        bullets.splice(i, 1)
        i--
      }
    }
  }
  isHitPlayer(container: any, bulletGraphics: any, playerList: any): boolean {
    // 击中检测
    const bulletCircle = {
      from: bulletGraphics.from,
      firstShoot: bulletGraphics.firstShoot,
      x: bulletGraphics.x,
      y: bulletGraphics.y,
      radius: bulletGraphics.radius
    }
    for (let i = 0; i < playerList.length; i++) {
      const playerRect = {
        x: playerList[i].x,
        y: playerList[i].y,
        width: playerList[i].width,
        height: playerList[i].height,
        rotation: playerList[i].rotation
      }
      if (circleRectCollisionWithAngle(bulletCircle, playerRect)) {
        if (bulletCircle.from == playerList[i].name && bulletCircle.firstShoot) {
          return false
        }
        playerList[i].alive = false
        container.removeChild(playerList[i])
        container.removeChild(bulletGraphics)
        playerList.splice(i, 1)
        return true
      }
    }
    return false
  }
  isCollisionWall(maze: Maze): boolean {
    const tankParams = {
      nextX: this.nextX,
      nextY: this.nextY,
      width: this.width,
      height: this.height,
      rotation: this.rotation,
      tankGraphics: this.tankGraphics,
      direction: 'up'
    }
    return check3(tankParams, maze)
  }
}

export default Tank
