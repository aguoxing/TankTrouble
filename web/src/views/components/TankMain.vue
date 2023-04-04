<template>
  <div class="app-container">
    <div ref="containerRef"></div>
  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
import Maze from "@/utils/game/maze"
import Player1 from "@/utils/game/player1"
import Player2 from "@/utils/game/player2"

export default {
  setup () {
    let maze;
    let player1;
    let player2;
    let playerList = [];
    let scene1, scene2, scene3;
    let gameState = 2;

    const containerRef = ref(null);
    const appContainer = ref(null);
    const tankContainer = ref(null);
    const pixiApp = ref(null);

    const appWidth = ref(850);
    const appHeight = ref(550);
    const mazeWidth = ref(800) // 迷宫宽度
    const mazeHeight = ref(500) // 迷宫高度

    const keys = ref([])

    const initPixiApp = () => {
      pixiApp.value = new PIXI.Application({
        width: appWidth.value,
        height: appHeight.value,
        backgroundColor: 0xeeeeee,
        antialias: true, // default: false 反锯齿，使字体和图形边缘更加平滑
        transparent: false, // default: false 透明度，使canvas背景透明
        resolution: 1, // default: 1 分辨率
      });
      // 将pixiApp添加到dom中
      containerRef.value.appendChild(pixiApp.value.view);

      // 添加主容器
      appContainer.value = new PIXI.Container();
      pixiApp.value.stage.addChild(appContainer.value);

      // 主容器居中
      appContainer.value.position.set(appWidth.value / 2, appHeight.value / 2);
      appContainer.value.pivot.set(mazeWidth.value / 2, mazeHeight.value / 2);
    }

    const scene1Create = () => {
      // 场景1
      scene1 = new PIXI.Container()
      const text1 = new PIXI.Text('Scene 1', {
        fontSize: 48,
        fill: 'white',
      });
      text1.anchor.set(0.5);
      text1.position.set(appWidth.value / 2, appHeight.value / 2);

      // 创建按钮对象
      const button = new PIXI.Graphics();
      button.lineStyle(5, 0xffffff)
      button.beginFill(0x00ff00);
      button.drawRect(50, 50, 100, 50);
      button.endFill();

      // 设置交互属性
      button.hitArea = button.getBounds();
      button.eventMode = 'auto'

      // 添加点击事件监听器
      button.on('click', () => {
        console.log('Button clicked!');
      });

      scene1.addChild(text1)
      scene1.addChild(button)
      appContainer.value.addChild(scene1)
    }
    const scene1Update = () => {
      // todo
    }

    const scene2Create = () => {
      // 场景2
      scene2 = new PIXI.Container()

      maze = new Maze()
      maze.draw()
      scene2.addChild(maze.wallGraphics)

      player1 = new Player1("player1", "0xff0000")
      player1.drawTank(maze)
      scene2.addChild(player1.tankGraphics)
      playerList.push(player1.tankGraphics)

      player2 = new Player2("player2", "0x00ff00")
      player2.drawTank(maze)
      scene2.addChild(player2.tankGraphics)
      playerList.push(player2.tankGraphics)

      appContainer.value.addChild(scene2)
    }
    const scene2Update = (delta) => {
      // console.log("delta", delta);
      player1.move(keys.value, maze, scene2)
      player1.updateBullet(scene2, maze, playerList)
      player2.move(keys.value, maze, scene2)
      player2.updateBullet(scene2, maze, playerList)
    }

    const scene3Create = () => {
      // 场景3
      scene3 = new PIXI.Container()
      const text1 = new PIXI.Text('Scene 3', {
        fontSize: 48,
        fill: 'white',
      });
      text1.anchor.set(0.5);
      text1.position.set(appWidth.value / 2, appHeight.value / 2);
      scene3.addChild(text1)

      appContainer.value.addChild(scene3)
    }
    const scene3Update = () => {
      // todo
    }

    const stateChange = () => {
      if (gameState == 1) {
        scene1Create()
        scene1Update()
      } else if (gameState == 2) {
        scene2Create()
        pixiApp.value.ticker.add(scene2Update)
      } else {
        scene3Create()
        scene3Update()
      }
    }

    const keywordListener = () => {
      // Handle keyboard input
      window.addEventListener("keydown", function (event) {
        keys.value[event.code] = true;
      });
      window.addEventListener("keyup", function (event) {
        keys.value[event.code] = false;
      });
    }

    // 监听状态
    watch(() => gameState, (newValue, oldValue) => {
      console.log(newValue, oldValue);
      if (oldValue == 1) {
        pixiApp.value.removeChild(scene1)
      } else if (oldValue == 2) {
        pixiApp.value.removeChild(scene2)
      } else {
        pixiApp.value.removeChild(scene3)
      }
    })

    onMounted(() => {
      keywordListener();
      initPixiApp();
      stateChange();
    });

    return {
      containerRef,
      tankContainer
    };
  }
}
</script>
<style>
.app-container {
  display: flex;
  justify-content: center;
}
</style>
