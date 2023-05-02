<template>
  <div class="game-list-wrapper">
    <div v-for="(item, index) in gameList" :key="index" class="box-card">
      <div v-text="item.name"></div>
      <el-button type="primary" @click="goto(item.path)">进入游戏</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const gameList = [
  { name: 'TankTrouble v1.0.0', path: '/tank' }
  // { name: 'TankTrouble v1.2.0', path: '/tank' },
]

const state = reactive({
  form: {}
})

const { form } = toRefs(state)

const router = useRouter()
const goto = (url: string) => {
  router.push(url)
}
</script>

<style>
.game-list-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  align-content: center;
  justify-content: center;
}

.box-card {
  padding: 5px;
  margin: 5px;
  background-color: #cccccc;
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  justify-content: center;
}
</style>
