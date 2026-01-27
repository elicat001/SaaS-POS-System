<script setup lang="ts">
import { ref } from 'vue'
import { Layout, Check } from 'lucide-vue-next'
import { Button } from '@/components/ui'
import { useNotificationStore } from '@/stores/notification'

const notification = useNotificationStore()

const templates = ref([
  { id: '1', name: '简约风格', category: 'official', thumbnail: 'https://via.placeholder.com/200x300?text=简约', useCount: 156 },
  { id: '2', name: '餐饮专用', category: 'industry', thumbnail: 'https://via.placeholder.com/200x300?text=餐饮', useCount: 89 },
  { id: '3', name: '清新绿色', category: 'official', thumbnail: 'https://via.placeholder.com/200x300?text=清新', useCount: 234 },
  { id: '4', name: '商务蓝', category: 'official', thumbnail: 'https://via.placeholder.com/200x300?text=商务', useCount: 67 },
])

const selectedCategory = ref('all')
const categories = [
  { value: 'all', label: '全部' },
  { value: 'official', label: '官方模板' },
  { value: 'industry', label: '行业模板' },
  { value: 'custom', label: '自定义' },
]

function applyTemplate(template: any) {
  notification.success(`模板 "${template.name}" 应用成功`)
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold text-gray-800">模板库</h1>
    </div>
    <div class="bg-white rounded-lg shadow-sm p-4">
      <div class="flex gap-2 mb-6">
        <button v-for="cat in categories" :key="cat.value" @click="selectedCategory = cat.value" :class="['px-4 py-2 text-sm rounded-lg transition-colors', selectedCategory === cat.value ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']">{{ cat.label }}</button>
      </div>
      <div class="grid grid-cols-4 gap-4">
        <div v-for="template in templates" :key="template.id" class="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
          <img :src="template.thumbnail" :alt="template.name" class="w-full h-40 object-cover" />
          <div class="p-3">
            <h3 class="font-medium text-gray-800">{{ template.name }}</h3>
            <p class="text-xs text-gray-500 mb-3">{{ template.useCount }} 人使用</p>
            <Button variant="outline" size="sm" block @click="applyTemplate(template)"><Check class="w-4 h-4" />应用模板</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
