import { AppState } from '@/types/store/app'
import { getLanguage } from '@/i18n'
import { localStorage } from '@/utils/storage'

const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({
    device: 'desktop',
    sidebar: {
      opened: localStorage.get('sidebarStatus') ? !!+localStorage.get('sidebarStatus') : true,
      withoutAnimation: false,
      hide: false
    },
    language: getLanguage(),
    size: localStorage.get('size') || 'default'
  }),
  actions: {
    setLanguage(language: string) {
      this.language = language
      localStorage.set('language', language)
    }
  }
})

export default useAppStore
