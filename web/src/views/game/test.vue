<template>
  <div class="game-wrapper">
    <div ref="containerRef"></div>
  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
import { isCollide, isCollide2, isCollide3, circleRectOverlap, calculateReflection, rectCircleColliding } from '@/game/tank/check2'
import { deg2Rad } from '@/game/tank/math'

export default {
  setup () {
    let pixiApp, appContainer, ballGraphics, rectGraphics, boardGraphics
    let walls = []
    const containerRef = ref(null)
    const appWidth = ref(850)
    const appHeight = ref(550)
    const mazeWidth = ref(800) // 迷宫宽度
    const mazeHeight = ref(500) // 迷宫高度

    const initPixiApp = () => {
      pixiApp = new PIXI.Application({
        width: appWidth.value,
        height: appHeight.value,
        backgroundColor: 0xeeeeee,
        antialias: true, // default: false 反锯齿，使字体和图形边缘更加平滑
        transparent: false, // default: false 透明度，使canvas背景透明
        resolution: 1 // default: 1 分辨率
      })
      // 将pixiApp添加到dom中
      containerRef.value.appendChild(pixiApp.view)

      // 添加主容器
      appContainer = new PIXI.Container()
      pixiApp.stage.addChild(appContainer)

      // 主容器居中
      appContainer.position.set(appWidth.value / 2, appHeight.value / 2)
      appContainer.pivot.set(mazeWidth.value / 2, mazeHeight.value / 2)
    }

    const drawWall = () => {
      const wallsContainer = new PIXI.Container()

      const wallThickness = 10
      // 水平
      const hw = mazeWidth.value + wallThickness
      const hh = wallThickness
      const hx = hw / 2
      const hy = hh / 2

      // 垂直
      const vw = wallThickness
      const vh = mazeHeight.value + wallThickness
      const vx = vw / 2
      const vy = vh / 2

      const topWall = new PIXI.Graphics()
      topWall.beginFill("0x4d4d4d")
      topWall.drawRect(-hw / 2, -hh / 2, hw, hh)
      topWall.endFill()
      topWall.position.set(hx, hy)
      wallsContainer.addChild(topWall)
      walls.push({ width: hw, height: hh, x: hx, y: hy, angle: 0, direction: 'horizontal' })

      const bottomWall = new PIXI.Graphics()
      bottomWall.beginFill("0x4d4d4d")
      bottomWall.drawRect(-hw / 2, -hh / 2, hw, hh)
      bottomWall.endFill()
      bottomWall.position.set(hx, hy + mazeHeight.value)
      wallsContainer.addChild(bottomWall)
      walls.push({ width: hw, height: hh, x: hx, y: hy + mazeHeight.value, angle: 0, direction: 'horizontal' })

      const leftWall = new PIXI.Graphics()
      leftWall.beginFill("0x4d4d4d")
      leftWall.drawRect(-vw / 2, -vh / 2, vw, vh)
      leftWall.endFill()
      leftWall.position.set(vx, vy)
      wallsContainer.addChild(leftWall)
      walls.push({ width: vw, height: vh, x: vx, y: vy, angle: 0, direction: 'vertical' })

      const rightWall = new PIXI.Graphics()
      rightWall.beginFill("0x4d4d4d")
      rightWall.drawRect(-vw / 2, -vh / 2, vw, vh)
      rightWall.endFill()
      rightWall.position.set(vx + mazeWidth.value, vy)
      wallsContainer.addChild(rightWall)
      walls.push({ width: vw, height: vh, x: vx + mazeWidth.value, y: vy, angle: 0, direction: 'vertical' })

      console.log(walls);
      appContainer.addChild(wallsContainer)
    }

    const drawBall = () => {
      ballGraphics = new PIXI.Graphics()
      ballGraphics.beginFill('0x4d4d4d')
      ballGraphics.drawCircle(0, 0, 15)
      ballGraphics.endFill()
      ballGraphics.position.set(200, 200)
      ballGraphics.rotation = Math.random() - 0.5
      appContainer.addChild(ballGraphics)

      const wallThickness = 10
      // 水平
      const hw = mazeWidth.value / 4
      const hh = wallThickness
      const hx = mazeWidth.value / 2
      const hy = mazeHeight.value / 2
      boardGraphics = new PIXI.Graphics()
      boardGraphics.beginFill('0x4d4d4d')
      boardGraphics.drawRect(-hw / 2, -hh / 2, hw, hh)
      boardGraphics.endFill()
      boardGraphics.position.set(hx, hy)
      appContainer.addChild(boardGraphics)
      // walls.push({
      //   width: boardGraphics.width,
      //   height: boardGraphics.height,
      //   x: boardGraphics.x,
      //   y: boardGraphics.y,
      //   angle: boardGraphics.rotation,
      //   direction: 'vertical'
      // })

      rectGraphics = new PIXI.Graphics()
      rectGraphics.beginFill('0x4d4d4d')
      rectGraphics.drawRect(-15, -15, 30, 30)
      rectGraphics.endFill()
      rectGraphics.position.set(300, 300)
      appContainer.addChild(rectGraphics)
    }

    const updateRect = (delta) => {
      const rectSpeed = 2 * delta

      const oldX = rectGraphics.x
      const oldY = rectGraphics.y
      const vx = Math.sin(rectGraphics.rotation)
      const vy = -Math.cos(rectGraphics.rotation)
      const nextX = rectGraphics.x + vx * rectSpeed
      const nextY = rectGraphics.y + vy * rectSpeed

      let rectObb = {
        // x: nextX,
        // y: nextY,
        // width: rect.width,
        // height: rect.height,
        // center: [nextX, nextY],
        // halfExtents: [rect.width / 2, rect.height / 2],
        center: { x: nextX, y: nextY },
        halfExtents: { x: 30 / 2, y: 30 / 2 },
        angle: rectGraphics.rotation
        // axis: [
        //   { x: 1, y: 0 },
        //   { x: 0, y: 1 },
        // ],
      }
      if (rectRectCheck(rectObb)) {
        rectGraphics.x = oldX
        rectGraphics.y = oldY
        rectGraphics.rotation += 0.01
      } else {
        rectGraphics.x = nextX
        rectGraphics.y = nextY
      }
    }
    const rectRectCheck = (rectObb) => {
      for (let i = 0; i < walls.length; i++) {
        let wallObb = {
          // x: rect2.x,
          // y: rect2.y,
          // width: rect2.width,
          // height: rect2.height,
          // center: [rect2.x, rect2.y],
          // halfExtents: [rect2.width / 2, rect2.height / 2],
          center: { x: walls[i].x, y: walls[i].y },
          halfExtents: { x: walls[i].width / 2, y: walls[i].height / 2 },
          angle: walls[i].angle
          // axis: [
          //   { x: 1, y: 0 },
          //   { x: 0, y: 1 },
          // ],
        }
        if (isCollide3(wallObb, rectObb)) {
          return true
        }
      }
      return false
    }

    const updateBall = (delta) => {
      const ballSpeed = 5 * delta
      boardGraphics.rotation += deg2Rad(1)

      const oldX = ballGraphics.x
      const oldY = ballGraphics.y
      const vx = Math.sin(ballGraphics.rotation)
      const vy = -Math.cos(ballGraphics.rotation)
      const nextX = ballGraphics.x + vx * ballSpeed
      const nextY = ballGraphics.y + vy * ballSpeed

      const ballCircle = {
        x: nextX,
        y: nextY,
        radius: 15
      }

      if (circleRectCheck(ballCircle)) {
        ballGraphics.x = oldX
        ballGraphics.y = oldY
      } else {
        ballGraphics.x = nextX
        ballGraphics.y = nextY
      }
    }
    const circleRectCheck = (ballCircle) => {
      for (let i = 0; i < walls.length; i++) {
        const wallRect = {
          x: walls[i].x,
          y: walls[i].y,
          width: walls[i].width,
          height: walls[i].height,
          angle: walls[i].angle
        }
        if (circleRectOverlap(ballCircle, wallRect)) {
          if (walls[i].direction == "horizontal") {
            ballGraphics.rotation = Math.PI - ballGraphics.rotation
          } else {
            ballGraphics.rotation = - ballGraphics.rotation
          }
          return true
        }
      }
      return false
    }

    const update = (delta) => {
      updateBall(delta)
      updateRect(delta)
    }

    const loop = () => {
      pixiApp.ticker.add(delta => {
        update(delta)
      })
    }

    onMounted(() => {
      initPixiApp()
      drawWall()
      drawBall()
      loop()
    })

    return {
      containerRef
    }
  }
}
</script>
<style>
.game-wrapper {
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.left-wrapper {
  margin: 5px;
  display: flex;
  flex-direction: column;
}

.right-wrapper {
  margin: 5px;
  display: flex;
  flex-direction: column;
}
</style>
