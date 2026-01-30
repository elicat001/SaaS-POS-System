import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

export function setupRouterGuards(router: Router) {
  // 全局前置守卫
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    
    // 设置页面标题
    if (to.meta.title) {
      document.title = `${to.meta.title} - SaaS POS系统`
    }
    
    // 检查是否需要认证
    if (to.meta.requiresAuth) {
      if (authStore.isAuthenticated) {
        next()
      } else {
        // 重定向到登录页，并保存目标路径
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        })
      }
    } else {
      // 如果已登录但访问登录页，重定向到首页
      if (to.path === '/login' && authStore.isAuthenticated) {
        next('/')
      } else {
        next()
      }
    }
  })
  
  // 全局后置守卫
  router.afterEach((to, from) => {
    // 可以在这里添加页面访问统计等
  })
}