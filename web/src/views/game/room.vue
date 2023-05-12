<template>
  <div class="app-container">
    <div v-if="state === 'wait'" class="room-wrapper">
      <!-- <div v-for="(item, index) in playerList" :key="index">
        <div v-text="item"></div>
      </div> -->
      <el-button @click="handleStartGame">开始游戏</el-button>
    </div>
    <online :command="commandModel" @handleSendMessage="handleSendMessage" @showScene="showScene" />
  </div>
</template>

<script lang="ts" setup>
import { decodeCommand, encodeCommand } from '@/game/proto/game'
import { useWebSocket } from '@vueuse/core'

const storage = localStorage.getItem('online-game')
const storageJson = JSON.parse(storage)

const route = useRoute()

const roomId = String(route.params.roomId)
const state = ref('wait')
const commandModel = ref()

const pingMsg = {
  action: "ping",
  actionStatus: "ws"
}
const wsUrl = 'ws://localhost:8089/game/tank/' + roomId
const { data, status, close, open, send, ws } = useWebSocket(wsUrl, {
  // heartbeat: {
  //   message: encodeCommand(pingMsg),
  //   interval: 100,
  //   pongTimeout: 100,
  // },
  onConnected: ws => {
    ws.binaryType = 'arraybuffer'
    console.log('connected...')
    const command = {
      msgKey: "connected",
      msgVal: storageJson.playerName,
      roomId: roomId,
      playerId: storageJson.playerId
    }
    send(encodeCommand(command))
  },
  onDisconnected: () => {
    console.log('disconnected...')
  },
  onMessage: () => {
    const command = decodeCommand(new Uint8Array(data.value))
    commandModel.value = command
  }
})

const showScene = (val: string) => {
  state.value = val
}

const handleSendMessage = (data: any) => {
  if (data !== null || data !== undefined) {
    send(encodeCommand(data))
  }
}

const handleStartGame = () => {
  const command = {
    msgKey: "game",
    msgVal: "start",
    roomId: roomId,
    playerId: storageJson.playerId
  }
  send(encodeCommand(command))
}

onMounted(() => { })

onUnmounted(() => {
  close()
})

</script>

<style scoped>
.room-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
