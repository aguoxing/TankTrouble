<template>
  <div class="game-wrapper">
    <div ref="containerRef"></div>
  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
import { isCollide, isCollide2, isCollide3, circleRectOverlap, rectCircleColliding } from '@/game/tank/check2'

export default {
  setup() {
    let appContainer
    const containerRef = ref(null)
    const appWidth = ref(850)
    const appHeight = ref(550)
    const mazeWidth = ref(800) // 迷宫宽度
    const mazeHeight = ref(500) // 迷宫高度

    const initPixiApp = () => {
      const pixiApp = new PIXI.Application({
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

      // 创建按钮对象
      const graphics = new PIXI.Graphics()
      // 设置矩形的初始位置和大小
      let rect = {
        x: 100,
        y: 100,
        width: 100,
        height: 100
      }
      // 绘制矩形
      graphics.beginFill(0x336699)
      // graphics.drawRect(-rect.width / 2, -rect.height / 2, rect.width, rect.height);
      graphics.drawCircle(0, 0, 10)
      graphics.endFill()
      graphics.position.set(rect.x, rect.y)

      appContainer.addChild(graphics)

      // 创建按钮对象
      const graphics2 = new PIXI.Graphics()
      // 设置矩形的初始位置和大小
      let rect2 = {
        x: 500,
        y: 300,
        width: 100,
        height: 100
      }
      // 绘制矩形
      graphics2.beginFill(0x336699)
      graphics2.drawRect(-rect2.width / 2, -rect2.height / 2, rect2.width, rect2.height)
      graphics2.endFill()
      graphics2.position.set(rect2.x, rect2.y)

      appContainer.addChild(graphics2)

      // 添加键盘事件
      const keys = {}
      document.addEventListener('keydown', event => {
        keys[event.keyCode] = true
      })
      document.addEventListener('keyup', event => {
        keys[event.keyCode] = false
      })

      // 每帧更新精灵对象的位置和角度
      pixiApp.ticker.add(() => {
        // 根据按键状态更新位置和角度
        const speed = 5
        let wallObb = {
          x: rect2.x,
          y: rect2.y,
          width: rect2.width,
          height: rect2.height,
          // center: { x: rect2.x, y: rect2.y },
          // halfExtents: [rect2.width / 2, rect2.height / 2],
          // center: { x: rect2.x, y: rect2.y },
          // halfExtents: { x: rect2.width / 2, y: rect2.height / 2 },
          angle: 0
          // axis: [
          //   { x: 1, y: 0 },
          //   { x: 0, y: 1 },
          // ],
        }
        if (keys['37']) {
          // 左箭头
          graphics.rotation -= (Math.PI / 180) * 5
        }
        if (keys['39']) {
          // 右箭头
          graphics.rotation += (Math.PI / 180) * 5
        }
        if (keys['38']) {
          // 上箭头
          const vx = Math.sin(graphics.rotation)
          const vy = -Math.cos(graphics.rotation)
          const nextX = graphics.x + vx * speed
          const nextY = graphics.y + vy * speed
          let tankObb = {
            x: nextX,
            y: nextY,
            radius: 10
            // width: rect.width,
            // height: rect.height,
            // center: { x: nextX, y: nextY },
            // halfExtents: [rect.width / 2, rect.height / 2],
            // center: { x: nextX, y: nextY },
            // halfExtents: { x: rect.width / 2, y: rect.height / 2 },
            // angle: graphics.rotation,
            // axis: [
            //   { x: 1, y: 0 },
            //   { x: 0, y: 1 },
            // ],
          }
          // if (!circleRectOverlap(tankObb, wallObb)) {
          if (!circleRectOverlap(tankObb, wallObb)) {
            graphics.x = nextX
            graphics.y = nextY
          }
        }
        if (keys['40']) {
          // 下箭头
          const vx = Math.sin(graphics.rotation)
          const vy = -Math.cos(graphics.rotation)
          const nextX = graphics.x - vx * speed
          const nextY = graphics.y - vy * speed
          let tankObb = {
            x: nextX,
            y: nextY,
            radius: 10
            // width: rect.width,
            // height: rect.height,
            // center: { x: nextX, y: nextY },
            // halfExtents: [rect.width / 2, rect.height / 2],
            // center: { x: nextX, y: nextY },
            // halfExtents: { x: rect.width / 2, y: rect.height / 2 },
            // angle: graphics.rotation,
            // axis: [
            //   { x: 1, y: 0 },
            //   { x: 0, y: 1 },
            // ],
          }
          // if (!circleRectOverlap(tankObb, wallObb)) {
          if (!circleRectOverlap(tankObb, wallObb)) {
            graphics.x = nextX
            graphics.y = nextY
          }
        }
      })

      // 主容器居中
      appContainer.position.set(appWidth.value / 2, appHeight.value / 2)
      appContainer.pivot.set(mazeWidth.value / 2, mazeHeight.value / 2)
    }

    onMounted(() => {
      initPixiApp()
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
