interface DefaultSettings {
  title: string
  blogTheme: string
  editorPreviewTheme: string
  editorCodeTheme: string
  showSettings: boolean
  topNav: boolean
  tagsView: boolean
  fixedHeader: boolean
  sidebarLogo: boolean
  dynamicTitle: boolean
  errorLog: string
}

const defaultSettings: DefaultSettings = {
  /**
   * 网页标题
   */
  title: import.meta.env.VITE_APP_TITLE,

  /**
   * 博客主题 dark light
   */
  blogTheme: 'light',

  /**
   * md预览主题
   */
  editorPreviewTheme: 'default',

  /**
   * 代码主题
   */
  editorCodeTheme: 'github',

  /**
   * 是否系统布局配置
   */
  showSettings: false,

  /**
   * 是否显示顶部导航
   */
  topNav: false,

  /**
   * 是否显示 tagsView
   */
  tagsView: true,

  /**
   * 是否固定头部
   */
  fixedHeader: false,

  /**
   * 是否显示logo
   */
  sidebarLogo: true,

  /**
   * 是否显示动态标题
   */
  dynamicTitle: true,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production'
}

export default defaultSettings
