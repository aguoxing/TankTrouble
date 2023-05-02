<template>
  <div class="game-wrapper">
    <div ref="containerRef"></div>

    <el-dialog v-model="localDialogVisible" title="本地模式选择" width="30%" center>
      <div>
        <el-radio-group v-model="gameMode" class="radio-group-container">
          <el-radio :label="1" size="large" border>人机模式</el-radio>
          <el-radio :label="2" size="large" border>双人模式</el-radio>
        </el-radio-group>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="localDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleStartLocalMode"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="onlineDialogVisible" title="在线模式选择" width="30%" center>
      <span> TODO </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onlineDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleStartOnlineMode"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
import PixiButton from '@/game/tank/button'
import Maze from '@/game/tank/maze'
import AI from '@/game/tank/player0'
import Player1 from '@/game/tank/player1'
import Player2 from '@/game/tank/player2'

export default {
  setup() {
    let maze
    let playerList = []
    let player0, player1, player2
    let pixiApp, appContainer, scene0, scene1, scene2, scene3
    let player0ScoreText, player1ScoreText, player2ScoreText

    const containerRef = ref(null)
    const gameMode = ref(1)
    const localDialogVisible = ref(false)
    const onlineDialogVisible = ref(false)

    const appWidth = ref(850)
    const appHeight = ref(550)
    const mazeWidth = ref(800) // 迷宫宽度
    const mazeHeight = ref(500) // 迷宫高度

    const keys = ref([])

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

    const handleStartLocalMode = () => {
      localDialogVisible.value = false
      playerList = []
      player0 = null
      player1 = null
      player2 = null
      appContainer.removeChild(scene0)
      if (gameMode.value === 1) {
        scene1Create()
        pixiApp.ticker.add(scene1Update)
      }
      if (gameMode.value === 2) {
        scene2Create()
        pixiApp.ticker.add(scene2Update)
      }
    }

    const handleStartOnlineMode = () => {
      onlineDialogVisible.value = false
    }

    const scene0Create = () => {
      // 场景0
      scene0 = new PIXI.Container()

      const pixiButton = new PixiButton(150, 50, '本地模式', 24)
      const button1 = pixiButton.createButton()
      button1.position.set(mazeWidth.value / 2, mazeHeight.value / 2)
      button1.on('click', () => {
        localDialogVisible.value = true
      })

      const pixiButton2 = new PixiButton(150, 50, '在线模式', 24)
      const button2 = pixiButton2.createButton()
      button2.position.set(mazeWidth.value / 2, mazeHeight.value / 2 + 60)
      button2.on('click', () => {
        onlineDialogVisible.value = true
      })

      scene0.addChild(button1)
      scene0.addChild(button2)
      appContainer.addChild(scene0)
    }
    const scene0Update = () => {
      // todo
    }

    // 人机模式场景
    const scene1Create = () => {
      // 场景1
      scene1 = new PIXI.Container()

      maze = new Maze()
      maze.draw(scene1)
      // scene1.addChild(maze.wallGraphics)

      player0 = new AI('player0', '0x2b2b2b')
      // player0 = AI.getInstance("player0", "0x2b2b2b")
      player0.drawTank(maze)
      scene1.addChild(player0.tankGraphics)
      playerList.push(player0)

      player1 = new Player1('player1', '0xff0000')
      // player1 = Player1.getInstance("player1", "0xff0000")
      player1.drawTank(maze)
      scene1.addChild(player1.tankGraphics)
      playerList.push(player1)

      player0ScoreText = new PIXI.Text('Player0: ' + player0.score, {
        fontSize: 18,
        fill: '0x2b2b2b'
      })
      player0ScoreText.anchor.set(0.5)
      player0ScoreText.position.set(50, -10)
      scene1.addChild(player0ScoreText)

      player1ScoreText = new PIXI.Text('Player1: ' + player1.score, {
        fontSize: 18,
        fill: '0xff0000'
      })
      player1ScoreText.anchor.set(0.5)
      player1ScoreText.position.set(mazeWidth.value - 50, -10)
      scene1.addChild(player1ScoreText)

      appContainer.addChild(scene1)
    }
    const scene1Update = () => {
      player0ScoreText.text = 'Player0: ' + player0.score
      player1ScoreText.text = 'Player1: ' + player1.score
      player0.move(keys.value, maze, scene1)
      const end = player0.updateBullet(scene1, maze, playerList)
      player1.move(keys.value, maze, scene1)
      const end2 = player1.updateBullet(scene1, maze, playerList)
      if (end || end2) {
        restart(scene1, playerList)
      }
    }

    // 双人模式场景
    const scene2Create = () => {
      // 场景2
      scene2 = new PIXI.Container()

      maze = new Maze()
      maze.draw(scene2)
      // scene2.addChild(maze.wallGraphics)

      player1 = new Player1('player1', '0xff0000')
      // player1 = Player1.getInstance("player1", "0xff0000")
      player1.drawTank(maze)
      scene2.addChild(player1.tankGraphics)
      playerList.push(player1)

      player2 = new Player2('player2', '0x00ff00')
      // player2 = Player2.getInstance("player2", "0x00ff00")
      player2.drawTank(maze)
      scene2.addChild(player2.tankGraphics)
      playerList.push(player2)

      player1ScoreText = new PIXI.Text('Player1: ' + player1.score, {
        fontSize: 18,
        fill: '0xff0000'
      })
      player1ScoreText.anchor.set(0.5)
      player1ScoreText.position.set(50, -10)
      scene2.addChild(player1ScoreText)

      player2ScoreText = new PIXI.Text('Player2: ' + player2.score, {
        fontSize: 18,
        fill: '0x00ff00'
      })
      player2ScoreText.anchor.set(0.5)
      player2ScoreText.position.set(mazeWidth.value - 50, -10)
      scene2.addChild(player2ScoreText)

      appContainer.addChild(scene2)
    }
    const scene2Update = delta => {
      // console.log("delta", delta);
      player1ScoreText.text = 'Player1: ' + player1.score
      player2ScoreText.text = 'Player2: ' + player2.score
      player1.move(keys.value, maze, scene2)
      const end = player1.updateBullet(scene2, maze, playerList)
      player2.move(keys.value, maze, scene2)
      const end2 = player2.updateBullet(scene2, maze, playerList)
      if (end || end2) {
        // let fun = () => console.log('time out');
        // let sleep2 = (time) => new Promise((resolve) => {
        //   setTimeout(resolve, time)
        // })
        // sleep2(2000).then();
        restart(scene2, playerList)
      }
    }

    // 重新开始
    const restart = (container, playerList) => {
      // setTimeout(() => {
      //   console.log("1s后重新开始...");
      // }, 3000);
      container.removeChild(maze.wallsContainer)
      maze = new Maze()
      // maze.draw()
      maze.draw(scene2)
      // container.addChild(maze.wallsContainer)
      for (let i = 0; i < playerList.length; i++) {
        for (let j = 0; j < playerList[i].bullets.length; j++) {
          const currBullet = playerList[i].bullets[j]
          const bulletGraphics = currBullet.bulletGraphics
          container.removeChild(bulletGraphics)
        }
        playerList[i].bullets = []
        playerList[i].bulletNum = 5
        playerList[i].firstShoot = true
        playerList[i].drawTank(maze)
      }
    }

    // 初始化初始场景
    const initScene = () => {
      scene0Create()
      scene0Update()
    }

    const keywordListener = () => {
      // Handle keyboard input
      window.addEventListener('keydown', function (event) {
        keys.value[event.code] = true
      })
      window.addEventListener('keyup', function (event) {
        keys.value[event.code] = false
      })
    }

    // 监听
    // watch(
    //   () => gameMode.value,
    //   (newValue, oldValue) => {}
    // )

    onMounted(() => {
      keywordListener()
      initPixiApp()
      initScene()
    })

    return {
      containerRef,
      gameMode,
      localDialogVisible,
      onlineDialogVisible,
      handleStartLocalMode,
      handleStartOnlineMode
    }
  }
}
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
