<script setup lang="ts">
import { useNotificationStore, type NotificationType } from '@/stores/notification'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-vue-next'

const notificationStore = useNotificationStore()

const iconMap: Record<NotificationType, any> = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const colorMap: Record<NotificationType, string> = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
}

const iconColorMap: Record<NotificationType, string> = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
}
</script>

<template>
  <div class="fixed top-4 right-4 z-[100] space-y-2 w-80">
    <TransitionGroup name="notification">
      <div
        v-for="notification in notificationStore.notifications"
        :key="notification.id"
        :class="[
          'p-4 rounded-lg border shadow-lg animate-slide-in',
          colorMap[notification.type]
        ]"
      >
        <div class="flex items-start gap-3">
          <component
            :is="iconMap[notification.type]"
            :class="['w-5 h-5 flex-shrink-0', iconColorMap[notification.type]]"
          />
          <div class="flex-1 min-w-0">
            <p v-if="notification.title" class="font-medium text-sm">
              {{ notification.title }}
            </p>
            <p class="text-sm" :class="notification.title ? 'mt-1' : ''">
              {{ notification.message }}
            </p>
            <button
              v-if="notification.action"
              @click="notification.action.onClick"
              class="mt-2 text-sm font-medium underline hover:no-underline"
            >
              {{ notification.action.label }}
            </button>
          </div>
          <button
            @click="notificationStore.removeNotification(notification.id)"
            class="flex-shrink-0 p-1 hover:bg-black/5 rounded transition-colors"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.notification-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>
