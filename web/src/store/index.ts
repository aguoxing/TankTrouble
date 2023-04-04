import useUserStore from './modules/user'
import useAppStore from './modules/app'
import useSettingStore from './modules/settings'

const useStore = () => ({
  user: useUserStore(),
  setting: useSettingStore(),
  app: useAppStore()
})

export default useStore
