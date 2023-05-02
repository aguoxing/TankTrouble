import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

export const GameLayout = () => import('@/layout/game.vue')

/**
 * https://router.vuejs.org/zh/guide/
 */
// 公共路由
export const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/redirect',
    component: GameLayout,
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login.vue'),
    meta: { hidden: true }
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/error/404.vue'),
    meta: { hidden: true }
  },
  {
    path: '/404',
    component: () => import('@/views/error/404.vue'),
    meta: { hidden: true }
  },
  {
    path: '/401',
    component: () => import('@/views/error/401.vue'),
    meta: { hidden: true }
  },
  {
    path: '',
    component: GameLayout,
    redirect: '/index',
    children: [
      {
        path: '/index',
        component: () => import('@/views/index.vue'),
        name: 'Home',
        meta: { title: 'Home', icon: 'dashboard', affix: true }
      },
      {
        path: '/tank',
        component: () => import('@/views/game/tank.vue'),
        name: 'TankTrouble',
        meta: { title: 'TankTrouble', icon: 'dashboard', affix: true }
      },
      {
        path: '/tank/online/:roomId',
        component: () => import('@/views/game/room.vue'),
        name: 'TankTroubleOnline',
        meta: { title: 'TankTroubleOnline', icon: 'dashboard', affix: true }
      },
      {
        path: '/tank/local/:gameMode',
        component: () => import('@/views/game/local.vue'),
        name: 'TankTroubleLocal',
        meta: { title: 'TankTroubleLocal', icon: 'dashboard', affix: true }
      },
      {
        path: '/chat',
        component: () => import('@/views/chat/index.vue'),
        name: 'chat',
        meta: { title: 'chat', icon: 'dashboard', affix: true }
      },
      {
        path: '/test',
        component: () => import('@/views/game/test.vue'),
        name: 'test',
        meta: { title: 'test', icon: 'dashboard', affix: true }
      }
    ]
  }
]

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = []

// createWebHashHistory hash 路由
// createWebHistory history 路由
// createMemoryHistory 带缓存 history 路由
const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export default router
