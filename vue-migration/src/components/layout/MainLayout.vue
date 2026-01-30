<template>
  <div class="min-h-screen bg-[#f1f5f9] font-sans">
    <Header />
    <Sidebar />
    <main class="pt-14 pl-56 min-h-screen transition-all duration-300">
      <div class="p-6 min-w-[1000px]">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from './Header.vue'
import Sidebar from './Sidebar.vue'
</script>