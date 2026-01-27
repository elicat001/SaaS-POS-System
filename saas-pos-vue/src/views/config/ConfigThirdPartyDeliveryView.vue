<script setup lang="ts">
import { ref } from 'vue'
import { Truck, Save } from 'lucide-vue-next'
import { Button, Input } from '@/components/ui'
import { useNotificationStore } from '@/stores/notification'

const notification = useNotificationStore()

const deliveryServices = ref([
  { id: 'meituan', name: '美团配送', enabled: true, apiKey: '******' },
  { id: 'eleme', name: '饿了么配送', enabled: false, apiKey: '' },
  { id: 'dada', name: '达达配送', enabled: false, apiKey: '' },
  { id: 'sf', name: '顺丰同城', enabled: false, apiKey: '' },
])

function save() {
  notification.success('配送设置保存成功')
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold text-gray-800">第三方配送</h1>
      <Button variant="primary" @click="save"><Save class="w-4 h-4" />保存</Button>
    </div>
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-orange-100 rounded-lg"><Truck class="w-6 h-6 text-orange-600" /></div>
        <div><h2 class="font-bold text-gray-800">配送平台接入</h2><p class="text-sm text-gray-500">配置第三方配送服务</p></div>
      </div>
      <div class="space-y-4">
        <div v-for="service in deliveryServices" :key="service.id" class="p-4 border rounded-lg">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-600">{{ service.name[0] }}</div>
              <div><p class="font-medium">{{ service.name }}</p><p class="text-xs text-gray-500">{{ service.enabled ? '已启用' : '未启用' }}</p></div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="service.enabled" class="sr-only peer" />
              <div class="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div v-if="service.enabled">
            <Input v-model="service.apiKey" label="API Key" placeholder="请输入API Key" type="password" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
