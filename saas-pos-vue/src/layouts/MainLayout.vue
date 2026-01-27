<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <AppHeader />

    <!-- Sidebar -->
    <AppSidebar />

    <!-- Main content -->
    <main class="pl-56 pt-14 min-h-screen">
      <div class="p-6">
        <slot />
      </div>
    </main>
  </div>
</template>
