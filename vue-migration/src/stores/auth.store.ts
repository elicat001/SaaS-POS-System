import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/services/api'
import type { AuthUser, LoginRequest } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<AuthUser | null>(null)
  const isLoading = ref(true)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const userPermissions = computed(() => user.value?.permissions || [])
  const userRoles = computed(() => user.value?.roles || [])

  // Actions
  const initialize = async () => {
    // 检查是否有token（模拟或真实）
    const token = localStorage.getItem('auth_token')
    if (token) {
      try {
        // 模拟获取当前用户
        const mockUser: AuthUser = {
          id: '1',
          username: 'admin',
          email: 'admin@example.com',
          roles: ['admin'],
          permissions: ['all'],
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
        }
        user.value = mockUser
        
        // 实际API调用（注释掉，因为后端有问题）
        // const userData = await authApi.getCurrentUser()
        // user.value = userData
      } catch (err) {
        console.error('初始化认证失败:', err)
        user.value = null
        // 清除无效token
        localStorage.removeItem('auth_token')
        localStorage.removeItem('refresh_token')
      }
    }
    isLoading.value = false
  }

  const login = async (credentials: LoginRequest) => {
    try {
      isLoading.value = true
      error.value = null
      
      // 模拟登录 - 由于后端API有问题，先使用模拟数据
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        // 模拟成功登录
        const mockUser: AuthUser = {
          id: '1',
          username: 'admin',
          email: 'admin@example.com',
          roles: ['admin'],
          permissions: ['all'],
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
        }
        user.value = mockUser
        
        // 设置模拟token
        localStorage.setItem('auth_token', 'mock-jwt-token-' + Date.now())
        localStorage.setItem('refresh_token', 'mock-refresh-token-' + Date.now())
        
        return mockUser
      } else {
        // 模拟登录失败
        throw new Error('用户名或密码错误')
      }
      
      // 实际API调用（注释掉，因为后端有问题）
      // const userData = await authApi.login(credentials)
      // user.value = userData
    } catch (err: any) {
      error.value = err.message || '登录失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } finally {
      user.value = null
    }
  }

  const clearError = () => {
    error.value = null
  }

  const hasPermission = (permission: string) => {
    return userPermissions.value.includes(permission)
  }

  const hasRole = (role: string | string[]) => {
    const roles = Array.isArray(role) ? role : [role]
    return roles.some(r => userRoles.value.includes(r))
  }

  // 初始化
  initialize()

  return {
    // State
    user,
    isLoading,
    error,
    
    // Getters
    isAuthenticated,
    userPermissions,
    userRoles,
    
    // Actions
    login,
    logout,
    clearError,
    hasPermission,
    hasRole,
  }
})