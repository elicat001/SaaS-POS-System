import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore, PERMISSIONS } from '@/stores/auth'

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('should start with unauthenticated state', () => {
    const store = useAuthStore()
    expect(store.isAuthenticated).toBe(false)
    expect(store.user).toBe(null)
  })

  it('should login with demo credentials', async () => {
    const store = useAuthStore()
    const result = await store.login({ username: 'admin', password: 'admin123' })

    expect(result.success).toBe(true)
    expect(store.isAuthenticated).toBe(true)
    expect(store.user).not.toBe(null)
    expect(store.user?.role).toBe('admin')
  })

  it('should have all permissions for admin', async () => {
    const store = useAuthStore()
    await store.login({ username: 'admin', password: 'admin123' })

    expect(store.hasPermission(PERMISSIONS.PRODUCT_VIEW)).toBe(true)
    expect(store.hasPermission(PERMISSIONS.SYSTEM_ADMIN)).toBe(true)
  })

  it('should logout correctly', async () => {
    const store = useAuthStore()
    await store.login({ username: 'admin', password: 'admin123' })
    expect(store.isAuthenticated).toBe(true)

    await store.logout()
    expect(store.isAuthenticated).toBe(false)
    expect(store.user).toBe(null)
  })

  it('should persist user to localStorage', async () => {
    const store = useAuthStore()
    await store.login({ username: 'admin', password: 'admin123' })

    const storedUser = localStorage.getItem('auth_user')
    expect(storedUser).not.toBe(null)
  })
})
