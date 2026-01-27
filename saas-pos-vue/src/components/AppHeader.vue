<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { User, LogOut } from 'lucide-vue-next'

const authStore = useAuthStore()

function handleLogout() {
  authStore.logout()
}
</script>

<template>
  <header class="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50">
    <!-- Logo -->
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
        <span class="text-white font-bold text-sm">POS</span>
      </div>
      <span class="font-semibold text-gray-800">SaaS POS System</span>
    </div>

    <!-- User info -->
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2 text-sm text-gray-600">
        <User class="w-4 h-4" />
        <span>{{ authStore.user?.name || '用户' }}</span>
        <span class="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
          {{ authStore.user?.role || 'staff' }}
        </span>
      </div>
      <button
        @click="handleLogout"
        class="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
      >
        <LogOut class="w-4 h-4" />
        <span>退出</span>
      </button>
    </div>
  </header>
</template>
