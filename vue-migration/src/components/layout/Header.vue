<template>
  <header class="h-14 bg-white border-b border-slate-200 fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 shadow-sm">
    <div class="flex items-center gap-4">
      <!-- Logo Area -->
      <div class="w-9 h-9 bg-[#fcd34d] rounded-full flex items-center justify-center text-slate-800 font-bold shadow-sm text-xs border border-[#f59e0b]">
        棠小一
      </div>
      
      <button class="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
        <Menu :size="20" />
      </button>
      
      <!-- Breadcrumb / Title -->
      <div class="hidden md:flex items-center text-sm text-slate-500 ml-2">
        <span class="font-bold text-slate-800 text-base mr-2">首页</span>
        <span class="mx-2">/</span>
        <span>运营数据</span>
      </div>
    </div>

    <div class="flex items-center gap-6">
      <!-- Renewal Info -->
      <div class="hidden md:flex items-center text-xs text-slate-500">
        <span class="mr-2">2026-07-08到期</span>
        <button class="text-emerald-500 border border-emerald-500 px-2 py-0.5 rounded hover:bg-emerald-50 transition-colors">
          续费
        </button>
      </div>
      
      <!-- Shop Selector & Profile -->
      <div class="flex items-center gap-4 pl-4 border-l border-slate-200">
        <div class="flex items-center gap-1 cursor-pointer hover:text-emerald-600 transition-colors">
          <span class="text-sm text-slate-600">棠小一(主店)</span>
          <ChevronDown :size="14" class="text-slate-400" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Menu, ChevronDown } from 'lucide-vue-next'
</script>