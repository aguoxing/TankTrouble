<template>
  <div class="app-container">
    <div v-if="state === 'wait'" class="room-wrapper">
      <!-- <div v-for="(item, index) in playerList" :key="index">
        <div v-text="item"></div>
      </div> -->
      <el-button @click="handleStartGame">开始游戏</el-button>
    </div>
    <div v-if="state === 'start'">
      <online :roomId="roomId" :playerId="playerId" :state="state" :maze-map="mazeMap" :players="players" @handleSendMessage="handleSendMessage" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { decodeGameResp, encodeGameReq } from '@/game/proto/game'
import { generateRandomCode } from '@/game/tank/math'
import { MazeMap, Player } from '@/types/game/online'
import { useWebSocket } from '@vueuse/core'

const storage = localStorage.getItem('online-game')
const storageJson = JSON.parse(storage)

const route = useRoute()

const roomId = String(route.params.roomId)
const playerId = generateRandomCode(8)
const state = ref('wait')
const mazeMap = ref<MazeMap>()
const players = ref<Player[]>()

const wsUrl = 'ws://localhost:8089/game/tank/' + roomId
const { data, status, close, open, send, ws } = useWebSocket(wsUrl, {
  onConnected: ws => {
    ws.binaryType = 'arraybuffer'
    console.log('connected...')
    const connectedMsg = {
      roomId: String(roomId),
      playerId: playerId,
      messageType: 'connected',
      messageValue: storageJson.playerName
    }
    send(encodeGameReq(connectedMsg))
  },
  onMessage: () => {
    handleReceiveData()
  }
})

const handleReceiveData = () => {
  const buffer = new Uint8Array(data.value)
  const decodeData = decodeGameResp(buffer)
  switch (decodeData.messageType) {
    case 'Join':
      // playerList.value.push(decodeData.messageValue)
      break
    case 'state':
      if (decodeData.messageValue === 'run') {
        state.value = 'start'
        mazeMap.value = decodeData.mazeMap
        players.value = decodeData.players
      }
      break
    case 'move':
      players.value = decodeData.players
      break
  }
}

const handleSendMessage = (data: any) => {
  if (data !== null || data !== undefined) {
    send(encodeGameReq(data))
  }
}

const handleStartGame = () => {
  const startMsg = {
    roomId: roomId,
    messageType: 'state',
    messageValue: 'start'
  }
  send(encodeGameReq(startMsg))
}

onMounted(() => {})
</script>

<style scoped>
.room-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
