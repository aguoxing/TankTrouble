import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import '@/permission' // 路由守卫

// svg图标
import 'virtual:svg-icons-register'

import 'element-plus/theme-chalk/dark/css-vars.css'

// 自定义样式
import '@/assets/styles/index.scss'

// 注册指令
import plugins from './plugins' // plugins

// 国际化
import i18n from './i18n/index'

import directive from './directive' // directive

const app = createApp(App)
// 创建pinia 实例
const pinia = createPinia()

import { parseTime } from '@/utils/ruoyi'
// 全局方法挂载
app.config.globalProperties.parseTime = parseTime

app.use(pinia)
app.use(router)
app.use(plugins)
app.use(i18n)

directive(app)

app.mount('#app')
