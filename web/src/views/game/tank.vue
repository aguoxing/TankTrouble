<template>
  <div class="app-container">
    <div class="game-wrapper">
      <el-radio-group v-model="gameMode">
        <el-radio :label="1" size="large" border>人机模式</el-radio>
        <el-radio :label="2" size="large" border>双人模式</el-radio>
        <el-radio :label="3" size="large" border>在线模式</el-radio>
      </el-radio-group>
      <el-divider />
      <div class="bottom-wrapper">
        <el-button v-if="gameMode !== 3" type="primary" @click="handleStartLocal">开始游戏</el-button>
        <div class="bottom-wrapper" v-if="gameMode === 3">
          <el-form ref="gameFormRef" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="房间号" prop="roomId">
              <div class="input-wrapper">
                <!-- <el-input v-model="form.roomId" placeholder="请输入房间号" /> -->
                <el-select v-model="form.roomId" placeholder="Select" allow-create filterable>
                  <el-option v-for="(item, index) in roomOptions" :key="index" :label="item.roomName" :value="item.roomId" :disabled="true" />
                </el-select>
                <el-button text @click="handleGenRoomId">
                  <ep:refresh />
                </el-button>
              </div>
              <span class="text-tip">当房间存在时加入，否则创建</span>
            </el-form-item>
            <el-form-item label="玩家名称" prop="playerName">
              <el-input v-model="form.playerName" placeholder="请输入玩家名称" />
            </el-form-item>
          </el-form>
          <el-button type="primary" @click="handleJoinOrCreateRoom">进入房间</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { generateRandomCode } from '@/game/tank/math'
import { useLocalStorage } from '@vueuse/core'

const router = useRouter()

const gameMode = ref(1)
const data = reactive({
  form: {
    roomId: generateRandomCode(6),
    playerName: '玩家1'
  },
  rules: {
    roomId: [{ required: true, message: '房间号不能为空', trigger: 'blur' }],
    playerName: [{ required: true, message: '玩家名称不能为空', trigger: 'blur' }]
  }
})
const roomOptions = [
  {
    roomId: 'Option1',
    roomName: 'TODO...'
  }
]

const { form, rules } = toRefs(data)
const gameFormRef = ref()

const state = useLocalStorage('online-game', { roomId: '001', playerName: '玩家1' })
form.value.playerName = state.value.playerName

const handleStartLocal = () => {
  router.push('/tank/local/' + gameMode.value)
}

const handleGenRoomId = () => {
  form.value.roomId = generateRandomCode(6)
}

const handleJoinOrCreateRoom = () => {
  gameFormRef.value.validate((valid: any) => {
    if (valid) {
      state.value.playerName = form.value.playerName
      state.value.roomId = form.value.roomId
      router.push('/tank/online/' + form.value.roomId)
    }
  })
}

onMounted(() => {})
</script>

<style scoped>
.game-wrapper {
  margin: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.online-mode-wrapper {
  margin: 10px;
}

.input-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.text-tip {
  font-size: 12px;
  color: #606266;
}

.bottom-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
