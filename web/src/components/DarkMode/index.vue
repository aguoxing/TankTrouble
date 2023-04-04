<script lang="ts" setup>
import useStore from '@/store'
import { useDark, useToggle } from '@vueuse/core'
import Dark from './dark.vue'
import Light from './light.vue'

const isDark = useDark()
const { setting } = useStore()

const toggleDark = () => {
  const theme = isDark.value ? 'dark' : 'light'
  setting.changeSetting({ key: 'blogTheme', value: theme })
  useToggle(isDark)
}
</script>

<template>
  <div>
    <el-switch v-model="isDark" inline-prompt :active-icon="Dark" :inactive-icon="Light" @change="toggleDark" />
  </div>
</template>

<style lang="scss" scoped>
.switch {
  color: #afafaf;
  cursor: pointer;
}
</style>
