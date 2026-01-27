<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'

defineProps<{
  size?: 'sm' | 'md' | 'lg'
  text?: string
}>()

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3">
    <Loader2 :class="['animate-spin text-emerald-600', sizeClasses[size || 'md']]" />
    <span v-if="text" class="text-sm text-gray-500">{{ text }}</span>
  </div>
</template>
