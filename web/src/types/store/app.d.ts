/**
 * 系统类型声明
 */
export type AppState = {
  device: string
  sidebar: {
    opened: boolean
    withoutAnimation: boolean
    hide: boolean
  }
  language: string
  size: string
}
