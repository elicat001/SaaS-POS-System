import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  timestamp: number
}

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])
  const maxNotifications = 5

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const id = Date.now().toString()
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: Date.now(),
      duration: notification.duration || 5000,
    }

    notifications.value.unshift(newNotification)

    // 限制通知数量
    if (notifications.value.length > maxNotifications) {
      notifications.value = notifications.value.slice(0, maxNotifications)
    }

    // 自动移除
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }

    return id
  }

  const success = (title: string, message: string, duration?: number) => {
    return addNotification({
      type: 'success',
      title,
      message,
      duration,
    })
  }

  const error = (title: string, message: string, duration?: number) => {
    return addNotification({
      type: 'error',
      title,
      message,
      duration: duration || 10000, // 错误消息显示更久
    })
  }

  const warning = (title: string, message: string, duration?: number) => {
    return addNotification({
      type: 'warning',
      title,
      message,
      duration,
    })
  }

  const info = (title: string, message: string, duration?: number) => {
    return addNotification({
      type: 'info',
      title,
      message,
      duration,
    })
  }

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearAll = () => {
    notifications.value = []
  }

  const clearByType = (type: Notification['type']) => {
    notifications.value = notifications.value.filter(n => n.type !== type)
  }

  return {
    notifications,
    addNotification,
    success,
    error,
    warning,
    info,
    removeNotification,
    clearAll,
    clearByType,
  }
})