<template>
  <div class="app-main">
    <game-header></game-header>
    <router-view class="container" />
    <game-footer></game-footer>
  </div>
</template>

<style lang="scss" scoped>
.app-main {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
}
</style>
