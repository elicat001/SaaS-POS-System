import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userApi } from '@/services/api'
import type { User } from '@/types'
import { MOCK_USERS } from '@/constants'
import { useNotificationStore } from './notification'

export const useUserStore = defineStore('user', () => {
  const notification = useNotificationStore()

  // State
  const users = ref<User[]>([...MOCK_USERS])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const members = computed(() => {
    return users.value.filter(u => u.type === 'MEMBER')
  })

  const normalUsers = computed(() => {
    return users.value.filter(u => u.type === 'NORMAL')
  })

  const totalBalance = computed(() => {
    return users.value.reduce((sum, u) => sum + u.balance, 0)
  })

  const totalPoints = computed(() => {
    return users.value.reduce((sum, u) => sum + u.points, 0)
  })

  const getUserByPhone = computed(() => {
    return (phone: string) => users.value.find(u => u.phone === phone)
  })

  // Actions
  async function fetchUsers(params?: { type?: string; search?: string }) {
    loading.value = true
    error.value = null
    try {
      const data = await userApi.list(params)
      users.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取用户失败'
      // Keep mock data on error
    } finally {
      loading.value = false
    }
  }

  async function createUser(data: Omit<User, 'id'>) {
    try {
      const newUser = await userApi.create(data)
      users.value.push(newUser)
      notification.success('用户创建成功')
      return newUser
    } catch (err) {
      // Fallback: create locally
      const newUser: User = {
        ...data,
        id: `u${Date.now()}`,
      }
      users.value.push(newUser)
      notification.success('用户创建成功 (本地)')
      return newUser
    }
  }

  async function updateUser(user: User) {
    try {
      const updated = await userApi.update(user.id, user)
      const index = users.value.findIndex(u => u.id === user.id)
      if (index > -1) {
        users.value[index] = updated
      }
      notification.success('用户更新成功')
      return updated
    } catch (err) {
      const index = users.value.findIndex(u => u.id === user.id)
      if (index > -1) {
        users.value[index] = user
      }
      notification.success('用户更新成功 (本地)')
      return user
    }
  }

  async function deleteUser(id: string) {
    try {
      await userApi.delete(id)
      users.value = users.value.filter(u => u.id !== id)
      notification.success('用户删除成功')
    } catch (err) {
      users.value = users.value.filter(u => u.id !== id)
      notification.success('用户删除成功 (本地)')
    }
  }

  async function addBalance(userId: string, amount: number) {
    try {
      await userApi.addBalance(userId, amount)
      const user = users.value.find(u => u.id === userId)
      if (user) {
        user.balance += amount
      }
      notification.success('充值成功')
    } catch (err) {
      const user = users.value.find(u => u.id === userId)
      if (user) {
        user.balance += amount
      }
      notification.success('充值成功 (本地)')
    }
  }

  async function addPoints(userId: string, points: number) {
    try {
      await userApi.addPoints(userId, points)
      const user = users.value.find(u => u.id === userId)
      if (user) {
        user.points += points
      }
      notification.success('积分添加成功')
    } catch (err) {
      const user = users.value.find(u => u.id === userId)
      if (user) {
        user.points += points
      }
      notification.success('积分添加成功 (本地)')
    }
  }

  function reset() {
    users.value = [...MOCK_USERS]
  }

  return {
    // State
    users,
    loading,
    error,
    // Getters
    members,
    normalUsers,
    totalBalance,
    totalPoints,
    getUserByPhone,
    // Actions
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    addBalance,
    addPoints,
    reset,
  }
})
