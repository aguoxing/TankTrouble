import * as PIXI from 'pixi.js'

class Bullet {
  _from: string
  _firstShoot: boolean
  _bulletColor: string
  _radius: number
  _rotation: number
  _speed: number
  _bounces: number
  _bulletGraphics: any

  constructor(from: string, rotation: number, bulletColor: string) {
    this._from = from
    this._firstShoot = true
    this._rotation = rotation
    this._bulletColor = bulletColor
    this._radius = 5
    this._speed = 5
    this._bounces = 20
    this._bulletGraphics = new PIXI.Graphics()
  }

  get from(): string {
    return this._from
  }
  set form(val: string) {
    this._from = val
  }
  get firstShoot(): boolean {
    return this._firstShoot
  }
  set firstShoot(val: boolean) {
    this._firstShoot = val
  }
  get radius(): number {
    return this._radius
  }
  get rotation(): number {
    return this._rotation
  }
  get bulletColor(): string {
    return this._bulletColor
  }
  get speed(): number {
    return this._speed
  }
  get bounces(): number {
    return this._bounces
  }
  set bounces(val: number) {
    this._bounces = val
  }
  get bulletGraphics(): any {
    return this._bulletGraphics
  }
  set bulletGraphics(val: any) {
    this._bulletGraphics = val
  }

  draw(cantainer: any, x: number, y: number): void {
    this.bulletGraphics.beginFill('0x000000')
    this.bulletGraphics.drawCircle(0, 0, this.radius)
    this.bulletGraphics.endFill()

    this.bulletGraphics.position.set(x, y)

    this.bulletGraphics.from = this.from
    this.bulletGraphics.radius = this.radius
    this.bulletGraphics.firstShoot = this.firstShoot
    this.bulletGraphics.rotation = this.rotation // 方向弧度

    cantainer.addChild(this.bulletGraphics)
  }
}

export default Bullet
