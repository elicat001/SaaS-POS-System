<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import MainLayout from '@/layouts/MainLayout.vue'
import NotificationContainer from '@/components/ui/NotificationContainer.vue'

const route = useRoute()
const authStore = useAuthStore()

const showLayout = computed(() => {
  return authStore.isAuthenticated && route.name !== 'Login'
})
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Notification container -->
    <NotificationContainer />

    <!-- Main content -->
    <MainLayout v-if="showLayout">
      <router-view />
    </MainLayout>
    <router-view v-else />
  </div>
</template>
