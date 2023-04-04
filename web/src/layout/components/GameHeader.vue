<template>
  <el-affix>
    <div class="header-container">
      <div class="nav-container">
        <div class="nav-logo">
          <img src="@/assets/vue.svg" @click="goto('/tank')" style="width: 30px; height: 30px" />
        </div>
        <div class="nav-menu">
          <div
            class="menu-item"
            v-for="(menu, index) in navMenus"
            :key="index"
            v-text="menu.name"
            :class="{ 'menu-item-bgc': currentPath === menu.path }"
            @click="goto(menu.path)"
          ></div>
          <!-- <lang-select class="menu-item" /> -->
          <dark-mode class="menu-item" />
        </div>
        <div class="nav-menu-mobile">
          <!-- <el-dropdown>
            <div class="menu-btn">
              <ep:menu />
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="(menu, index) in navMenus" :key="index" @click="goto(menu.path)">{{ menu.name }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown> -->
          <div class="menu-btn" @click="toggleDrawerMenu">
            <ep:menu />
          </div>
          <el-drawer size="55%" v-model="drawerMenu" title="I am the title" :with-header="false">
            <div class="nav-menu-mobile">
              <div
                class="menu-item"
                v-for="(menu, index) in navMenus"
                :key="index"
                v-text="menu.name"
                :class="{ 'menu-item-bgc': currentPath === menu.path }"
                @click="goto(menu.path)"
              ></div>
              <lang-select class="menu-item" />
              <dark-mode class="menu-item" />
            </div>
          </el-drawer>
        </div>
      </div>
    </div>
  </el-affix>
</template>

<script lang="ts">
import i18n from '@/i18n'

export default defineComponent({
  name: 'BlogHeader',
  setup() {
    const navMenus = [
      { name: i18n.global.t('menu.home'), path: '/tank' }
    ]

    const router = useRouter()
    const currentPath = ref(router.currentRoute.value.path)
    const goto = (url: string) => {
      currentPath.value = url
      router.push(url)
    }

    const drawerMenu = ref(false)
    const toggleDrawerMenu = () => {
      drawerMenu.value = !drawerMenu.value
    }

    return {
      currentPath,
      goto,
      toggleDrawerMenu,
      drawerMenu,
      navMenus
    }
  }
})
</script>

<style scoped>
.nav-container {
  width: 90%;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: space-between;
  align-items: center;
}
.nav-logo {
  width: 50px;
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.nav-logo:hover {
  cursor: pointer;
}
</style>
