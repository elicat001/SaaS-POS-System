import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi, setOnUnauthorized, type LoginRequest } from '@/services/api'
import type { AuthUser } from '@/types'

// Permission constants
export const PERMISSIONS = {
  PRODUCT_VIEW: 'product:view',
  PRODUCT_CREATE: 'product:create',
  PRODUCT_EDIT: 'product:edit',
  PRODUCT_DELETE: 'product:delete',
  ORDER_VIEW: 'order:view',
  ORDER_CREATE: 'order:create',
  ORDER_EDIT: 'order:edit',
  ORDER_CANCEL: 'order:cancel',
  INVENTORY_VIEW: 'inventory:view',
  INVENTORY_MANAGE: 'inventory:manage',
  USER_VIEW: 'user:view',
  USER_CREATE: 'user:create',
  USER_EDIT: 'user:edit',
  USER_DELETE: 'user:delete',
  REPORT_VIEW: 'report:view',
  CONFIG_VIEW: 'config:view',
  CONFIG_EDIT: 'config:edit',
  SYSTEM_ADMIN: 'system:admin',
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<AuthUser | null>(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(true)
  const error = ref<string | null>(null)

  // Getters
  const hasPermission = computed(() => {
    return (permission: string): boolean => {
      if (!user.value) return false
      // Admin has all permissions
      if (user.value.role === 'admin') return true
      return user.value.permissions.includes(permission)
    }
  })

  const hasRole = computed(() => {
    return (roles: string | string[]): boolean => {
      if (!user.value) return false
      const roleArray = Array.isArray(roles) ? roles : [roles]
      return roleArray.includes(user.value.role)
    }
  })

  // Actions
  async function login(credentials: LoginRequest) {
    isLoading.value = true
    error.value = null

    try {
      // Fast-track for demo: admin/admin123
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        const demoUser: AuthUser = {
          id: 'demo-admin',
          username: 'admin',
          name: '管理员',
          role: 'admin',
          permissions: Object.values(PERMISSIONS),
        }
        user.value = demoUser
        isAuthenticated.value = true
        localStorage.setItem('auth_user', JSON.stringify(demoUser))
        return { success: true }
      }

      const response = await authApi.login(credentials)
      user.value = response.user
      isAuthenticated.value = true
      localStorage.setItem('auth_user', JSON.stringify(response.user))
      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : '登录失败'
      error.value = message
      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    try {
      await authApi.logout()
    } catch {
      // Ignore errors during logout
    } finally {
      user.value = null
      isAuthenticated.value = false
      localStorage.removeItem('auth_user')
    }
  }

  function clearError() {
    error.value = null
  }

  async function refreshUser() {
    if (!authApi.isAuthenticated()) return

    try {
      const currentUser = await authApi.getCurrentUser()
      user.value = currentUser
      isAuthenticated.value = true
      localStorage.setItem('auth_user', JSON.stringify(currentUser))
    } catch {
      await logout()
    }
  }

  function initialize() {
    // Set up unauthorized callback
    setOnUnauthorized(() => {
      logout()
    })

    // Try to restore user from localStorage
    const storedUser = localStorage.getItem('auth_user')
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
        isAuthenticated.value = true
      } catch {
        localStorage.removeItem('auth_user')
      }
    }
    isLoading.value = false
  }

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    // Getters
    hasPermission,
    hasRole,
    // Actions
    login,
    logout,
    clearError,
    refreshUser,
    initialize,
  }
})
