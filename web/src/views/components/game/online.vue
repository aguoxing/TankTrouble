<template>
  <div class="game-wrapper">
    <div ref="containerRef"></div>
  </div>
</template>

<script lang="ts">
import { Bullet, Command, MazeMap, Tank } from '@/game/proto/game'
import { drawPlayer, drawMazeMap, drawBullet } from '@/game/tank/game'
import { keyword } from '@/types/game/online'
import * as PIXI from 'pixi.js'
import { PropType } from 'vue'

export default defineComponent({
  name: 'GameScene',
  props: {
    command: Object as PropType<Command>,
    state: String,
  },
  emits: ['update:command', 'handleSendMessage', 'showScene'],
  setup(props, context) {
    // 初始化场景
    let pixiApp: PIXI.Application<PIXI.ICanvas>, appContainer: PIXI.Container<PIXI.DisplayObject>, sceneContainer: PIXI.Container<PIXI.DisplayObject>
    const containerRef = ref()
    const initPixiApp = (mazeMap: any) => {
      const pixiAppWidth = mazeMap.width
      const pixiAppHeight = mazeMap.height
      pixiApp = new PIXI.Application({
        width: pixiAppWidth,
        height: pixiAppHeight,
        backgroundColor: 0xeeeeee,
        antialias: true, // default: false 反锯齿，使字体和图形边缘更加平滑
        // transparent: false, // default: false 透明度，使canvas背景透明
        resolution: 1 // default: 1 分辨率
      })
      // 将pixiApp添加到dom中
      containerRef.value.appendChild(pixiApp.view)

      // 添加主容器
      appContainer = new PIXI.Container()
      pixiApp.stage.addChild(appContainer)

      // 主容器居中
      appContainer.position.set(pixiAppWidth / 2, pixiAppHeight / 2)
      appContainer.pivot.set((pixiAppWidth - 50) / 2, (pixiAppHeight - 50) / 2)

      // 场景容器
      sceneContainer = new PIXI.Container()
      appContainer.addChild(sceneContainer)
    }

    // 键盘监听
    const keys = ref<keyword>({})
    const handleKeyDown = (event: { code: string }) => {
      keys.value[event.code] = true
      keydown.value = true
    }
    const handleKeyUp = (event: { code: string | number }) => {
      keys.value[event.code] = false
      keydown.value = false
    }
    const keywordListener = () => {
      // Handle keyboard input
      window.addEventListener('keydown', handleKeyDown)
      window.addEventListener('keyup', handleKeyUp)
    }

    const commandModel = computed({
      get: () => props.command || '',
      set: val => {
        context.emit('update:command', val)
      }
    })

    const roomId = ref()
    const playerId = ref()
    let wallsContainer: PIXI.Container<PIXI.DisplayObject>

    const interpreterCommand = (command: Command) => {
      // console.log(command);

      if (command.msgKey == "game" && command.msgVal == "restart") {
        sceneContainer.removeChild(wallsContainer)
        playersMap.forEach((val, key) => {
          sceneContainer.removeChild(val)
        })
        bulletsMap.forEach((val, key) => {
          sceneContainer.removeChild(val)
        })
        bulletsMap.clear()
      }
      if (command.msgKey == "game" && command.msgVal == "run") {
        roomId.value = command.roomId
        playerId.value = command.playerId
        context.emit('showScene', "run")
      }
      if (command.msgKey === "initMap") {
        if (pixiApp === undefined) {
          initPixiApp(command.mazeMap)
          pixiTicker()
        } else {
          sceneContainer = new PIXI.Container()
          appContainer.addChild(sceneContainer)
        }
        initMap(command.mazeMap)
      }
      if (command.msgKey === "initPlayer") {
        initPlayer(command.player)
      }
      if (command.msgKey === "fire") {
        fire(command.bullet)
      }
    }

    const initMap = (mazeMap: MazeMap) => {
      wallsContainer = drawMazeMap(mazeMap)
      sceneContainer.addChild(wallsContainer)
    }
    const playersMap = new Map()
    const initPlayer = (player: Tank) => {
      const playerGraphics = drawPlayer(player)
      playersMap.set(player.id, playerGraphics)
      sceneContainer.addChild(playerGraphics)
    }
    const bulletsMap = new Map()
    const fire = (bullet: Bullet) => {
      const bulletGraphics = drawBullet(bullet)
      bulletsMap.set(bullet.id, bulletGraphics)
      // console.log(bullet);
      sceneContainer.addChild(bulletGraphics)
    }

    const send = (moveStatus: number) => {
      const updateState = {
        roomId: roomId.value,
        playerId: playerId.value,
        moveStatus: moveStatus,
        isMoveForward: MoveForward.value,
        isMoveBackward: MoveBackward.value,
        isRotateLeft: RotateLeft.value,
        isRotateRight: RotateRight.value,
        isFire: Fire.value,
      }
      context.emit('handleSendMessage', updateState)
    }
    const keydown = ref(false)
    const MoveForward = ref(0)
    const MoveBackward = ref(0)
    const RotateLeft = ref(0)
    const RotateRight = ref(0)
    const Fire = ref(0)
    const commandListening = (keys: { [keyCode: string]: boolean }) => {
      if (keys['KeyW']) {
        MoveForward.value = 1
      } else {
        MoveForward.value = 0
      }
      if (keys['KeyS']) {
        MoveBackward.value = 1
      } else {
        MoveBackward.value = 0
      }
      if (keys['KeyA']) {
        RotateLeft.value = 1
      } else {
        RotateLeft.value = 0
      }
      if (keys['KeyD']) {
        RotateRight.value = 1
      } else {
        RotateRight.value = 0
      }
      if (keys['KeyQ']) {
        Fire.value = 1
      } else {
        Fire.value = 0
      }
      const status = g()
      send(status)
      // console.log(MoveForward.value, RotateLeft.value);
    }

    const g = () => {
      console.log(keydown.value);
      if (MoveForward.value == 1 || MoveBackward.value == 1 ||
        RotateLeft.value == 1 || RotateRight.value == 1 ||
        Fire.value == 1 || bulletsMap.size > 0) {
        return 1
      }
      return 0
    }

    const updateTankState = (command: Command) => {
      // 更新玩家位置
      if (command.msgKey == "update") {
        const player = command.player
        if (player !== undefined) {
          const playerGraphics = playersMap.get(player.id)
          playerGraphics.x = player.centerX
          playerGraphics.y = player.centerY
          playerGraphics.rotation = player.rotation
          updateBulletState(player)
        }
      }
    }

    const updateBulletState = (player: Tank) => {
      if (player.bullets !== undefined) {
        console.log(player.bullets.length, bulletsMap.size);

        for (let i = 0; i < player.bullets.length; i++) {
          const bullet = player.bullets[i]
          // 更新子弹位置
          const bulletGraphics = bulletsMap.get(bullet.id)
          if (bullet.bounces >= 0) {
            bulletGraphics.x = bullet.centerX
            bulletGraphics.y = bullet.centerY
            bulletGraphics.rotation = bullet.rotation
          } else {
            bulletsMap.delete(bullet.id)
            sceneContainer.removeChild(bulletGraphics)
          }
        }
      }
    }
    const updateState = () => {
      commandListening(keys.value)
      updateTankState(commandModel.value)
    }

    const pixiTicker = () => {
      pixiApp.ticker.add(updateState)
      // requestAnimationFrame(pixiTicker);
      // updateState(1)
    }

    // 监听
    watch(
      () => commandModel.value,
      (newValue, oldValue) => {
        if (commandModel.value.action !== 'ping') {
          interpreterCommand(commandModel.value)
        }
      }
    )

    onMounted(() => {
      keywordListener()
    })

    onUnmounted(() => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    })

    return {
      containerRef
    }
  }
})
</script>
<style scoped>
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

.radio-group-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>
