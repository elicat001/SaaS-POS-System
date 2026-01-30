import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { setupRouterGuards } from './guards'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// 设置路由守卫
setupRouterGuards(router)

export default router