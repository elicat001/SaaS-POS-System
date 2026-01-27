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
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm">
        <span class="text-white font-bold text-sm">云</span>
      </div>
      <div class="flex flex-col">
        <span class="font-bold text-gray-800 text-base">客如云</span>
        <span class="text-xs text-gray-400">智慧餐饮</span>
      </div>
    </div>

    <!-- User info -->
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2 text-sm text-gray-600">
        <User class="w-4 h-4" />
        <span>{{ authStore.user?.name || '用户' }}</span>
        <span class="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">
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
