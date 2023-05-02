<template>
  <div class="app-container">
    <el-scrollbar style="height: 500px; border: 1px solid #cccccc; margin-bottom: 10px">
      <div style="margin: 10px">
        <div v-for="(item, index) in messageList" :key="index">
          <p>{{ item }}</p>
        </div>
      </div>
    </el-scrollbar>
    <el-form ref="chatFormRef" :model="chatForm" :rules="chatFormRules">
      <el-form-item prop="content">
        <el-input v-model="chatForm.content" placeholder="Please input" @keyup.enter="sendMessage">
          <template #append>
            <el-button type="primary" @click="sendMessage"> <ep:promotion /> 发送 </el-button>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts">
import { encodeMessageReq, decodeMessageResp } from '@/game/proto/message'
import { decodeGameResp, encodeGameReq } from '@/game/proto/game'
import { useWebSocket } from '@vueuse/core'

export default {
  setup() {
    const roomId = ref()
    const messageList = ref<any>([])
    const state = reactive({
      chatForm: {
        id: '0',
        content: ''
      },
      chatFormRules: {
        content: [{ required: true, trigger: 'blur', message: '请输入内容...' }]
      }
    })

    const chatFormRef = ref<ElForm>(null)

    const { chatForm, chatFormRules } = toRefs(state)

    const storage = localStorage.getItem('online-game')
    const storageJson = JSON.parse(storage)

    const wsUrl = 'ws://localhost:8089/game/tank/001'
    const { data, status, close, open, send, ws } = useWebSocket(wsUrl, {
      onConnected: ws => {
        console.log('connected...')
        ws.binaryType = 'arraybuffer'
        const s = {
          messageType: 'clientName',
          messageValue: storageJson.playerName
        }
        send(encodeGameReq(s))
      },
      onMessage: () => {
        const buffer = new Uint8Array(data.value)
        const d = decodeGameResp(buffer)
        messageList.value.push(d.messageValue)
        console.log(d.messageValue)
      }
    })

    const handleReset = () => {
      chatFormRef.value?.resetFields()
      chatFormRef.value?.clearValidate()
    }

    const sendMessage = () => {
      chatFormRef.value.validate((valid: any) => {
        if (valid) {
          const data = {
            messageType: 'Chat',
            messageValue: chatForm.value.content
          }
          send(encodeGameReq(data))
          send(encodeGameReq(data))
          handleReset()
        }
      })
    }

    onMounted(() => {})

    return {
      chatForm,
      chatFormRef,
      chatFormRules,
      roomId,
      sendMessage,
      messageList
    }
  }
}
</script>
