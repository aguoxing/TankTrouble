import defaultSettings from '@/settings'
import useStore from '@/store'

/**
 * 动态修改标题
 */
export function useDynamicTitle() {
  const { setting } = useStore()
  if (setting.dynamicTitle) {
    document.title = setting.title + ' - ' + defaultSettings.title
  } else {
    document.title = defaultSettings.title
  }
}
