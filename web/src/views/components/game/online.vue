<template>
  <div class="game-wrapper">
    <div ref="containerRef"></div>
  </div>
</template>

<script lang="ts">
import { drawPlayer } from '@/game/tank/game'
import { drawMazeMap } from '@/game/tank/game'
import { MazeMap, Player } from '@/types/game/online'
import * as PIXI from 'pixi.js'
import { PropType } from 'vue'

export default defineComponent({
  name: 'GameScene',
  props: {
    state: String,
    mazeMap: Object as PropType<MazeMap>,
    players: Array as PropType<Player[]>,
    roomId: String,
    playerId: String
  },
  emits: ['update:roomId', 'update:playerId', 'update:mazeMap', 'update:players', 'update:state', 'handleSendMessage'],
  setup(props, context) {
    // 初始化场景
    let pixiApp: PIXI.Application<PIXI.ICanvas>, appContainer: PIXI.Container<PIXI.DisplayObject>
    const containerRef = ref()
    const initPixiApp = () => {
      const pixiAppWidth = modelMazeMap.value.width
      const pixiAppHeight = modelMazeMap.value.height
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
    }

    // 键盘监听
    const keys = ref([])
    const handleKeyDown = (event: { code: string | number }) => {
      keys.value[event.code] = true
    }
    const handleKeyUp = (event: { code: string | number }) => {
      keys.value[event.code] = false
    }
    const keywordListener = () => {
      // Handle keyboard input
      window.addEventListener('keydown', handleKeyDown)
      window.addEventListener('keyup', handleKeyUp)
    }

    const roomIdModel = computed({
      get: () => props.roomId || '',
      set: val => {
        context.emit('update:roomId', val)
      }
    })
    const playerIdModel = computed({
      get: () => props.playerId || '',
      set: val => {
        context.emit('update:playerId', val)
      }
    })
    const modelMazeMap = computed({
      get: () => props.mazeMap || '',
      set: val => {
        context.emit('update:mazeMap', val)
      }
    })
    const modelPlayers = computed({
      get: () => props.players || '',
      set: val => {
        context.emit('update:players', val)
      }
    })
    const modelState = computed({
      get: () => props.state || '',
      set: val => {
        context.emit('update:state', val)
      }
    })

    const players = ref<PIXI.Graphics[]>([])
    const draw = () => {
      const sceneContainer = new PIXI.Container()
      const mazeMap = drawMazeMap(modelMazeMap.value)
      sceneContainer.addChild(mazeMap)
      for (let i = 0; i < modelPlayers.value.length; i++) {
        const player = drawPlayer(modelPlayers.value[i])
        players.value.push(player)
        sceneContainer.addChild(player)
      }
      appContainer.addChild(sceneContainer)
    }

    const send = (val: string) => {
      const moveMsg = {
        roomId: String(roomIdModel.value),
        playerId: playerIdModel.value,
        messageType: 'move',
        messageValue: val
      }
      context.emit('handleSendMessage', moveMsg)
    }
    const handleMove = (keys: { [keyCode: string]: [v: boolean] }) => {
      if (keys['KeyW']) {
        send('MoveForward')
        // console.log("MoveForward");
      }
      if (keys['KeyS']) {
        send('MoveBackward')
        // console.log("MoveBackward");
      }
      if (keys['KeyA']) {
        send('RotateLeft')
        // console.log("RotateLeft");
      }
      if (keys['KeyD']) {
        send('RotateRight')
        // console.log("RotateRight");
      }
      if (keys['KeyQ']) {
        send('Fire')
      }
    }
    const updateState1 = () => {
      // console.log(keys.value);
      handleMove(keys.value)
    }

    const updateState = () => {
      pixiApp.ticker.add(updateState1)
    }

    // 监听
    watch(
      () => modelPlayers.value,
      (newValue, oldValue) => {
        // console.log(newValue);
        for (let i = 0; i < modelPlayers.value.length; i++) {
          players.value[i].x = modelPlayers.value[i].centerX
          players.value[i].y = modelPlayers.value[i].centerY
          players.value[i].rotation = modelPlayers.value[i].rotation
        }
      }
    )

    onMounted(() => {
      if (modelState.value === 'start') {
        initPixiApp()
        keywordListener()
        console.log(modelMazeMap.value, modelPlayers.value)
        draw()
        updateState()
      }
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
