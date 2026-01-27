import { defineStore } from 'pinia'
import { ref } from 'vue'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title?: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export interface NotificationOptions {
  title?: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

const DEFAULT_DURATIONS: Record<NotificationType, number> = {
  success: 3000,
  error: 5000,
  warning: 4000,
  info: 3000,
}

const MAX_NOTIFICATIONS = 5

export const useNotificationStore = defineStore('notification', () => {
  // State
  const notifications = ref<Notification[]>([])

  // Actions
  function addNotification(type: NotificationType, options: NotificationOptions | string): string {
    const opts = typeof options === 'string' ? { message: options } : options
    const id = `notification-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    const duration = opts.duration ?? DEFAULT_DURATIONS[type]

    const notification: Notification = {
      id,
      type,
      title: opts.title,
      message: opts.message,
      duration,
      action: opts.action,
    }

    // Keep max notifications
    if (notifications.value.length >= MAX_NOTIFICATIONS) {
      notifications.value = notifications.value.slice(1)
    }

    notifications.value.push(notification)

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }

    return id
  }

  function removeNotification(id: string) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  function clearAll() {
    notifications.value = []
  }

  // Convenience methods
  function success(options: NotificationOptions | string) {
    return addNotification('success', options)
  }

  function error(options: NotificationOptions | string) {
    return addNotification('error', options)
  }

  function warning(options: NotificationOptions | string) {
    return addNotification('warning', options)
  }

  function info(options: NotificationOptions | string) {
    return addNotification('info', options)
  }

  return {
    // State
    notifications,
    // Actions
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info,
  }
})
