<script setup lang="ts">
import { ref } from 'vue'
import { Bell, Save } from 'lucide-vue-next'
import { Button } from '@/components/ui'
import { useNotificationStore } from '@/stores/notification'

const notification = useNotificationStore()

const settings = ref({
  newOrderSound: true,
  newOrderNotify: true,
  cancelOrderNotify: true,
  refundNotify: true,
  lowStockNotify: true,
  notifyEmail: '',
})

function save() {
  notification.success('通知设置保存成功')
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold text-gray-800">订单通知</h1>
      <Button variant="primary" @click="save"><Save class="w-4 h-4" />保存</Button>
    </div>
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-yellow-100 rounded-lg"><Bell class="w-6 h-6 text-yellow-600" /></div>
        <div><h2 class="font-bold text-gray-800">通知设置</h2><p class="text-sm text-gray-500">配置订单和系统通知方式</p></div>
      </div>
      <div class="space-y-4 max-w-xl">
        <label class="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
          <div><p class="font-medium">新订单提示音</p><p class="text-sm text-gray-500">有新订单时播放提示音</p></div>
          <input type="checkbox" v-model="settings.newOrderSound" class="w-5 h-5 text-emerald-600 rounded" />
        </label>
        <label class="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
          <div><p class="font-medium">新订单通知</p><p class="text-sm text-gray-500">有新订单时发送通知</p></div>
          <input type="checkbox" v-model="settings.newOrderNotify" class="w-5 h-5 text-emerald-600 rounded" />
        </label>
        <label class="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
          <div><p class="font-medium">取消订单通知</p><p class="text-sm text-gray-500">订单被取消时通知</p></div>
          <input type="checkbox" v-model="settings.cancelOrderNotify" class="w-5 h-5 text-emerald-600 rounded" />
        </label>
        <label class="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
          <div><p class="font-medium">退款通知</p><p class="text-sm text-gray-500">有退款申请时通知</p></div>
          <input type="checkbox" v-model="settings.refundNotify" class="w-5 h-5 text-emerald-600 rounded" />
        </label>
        <label class="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
          <div><p class="font-medium">库存预警通知</p><p class="text-sm text-gray-500">库存低于预警线时通知</p></div>
          <input type="checkbox" v-model="settings.lowStockNotify" class="w-5 h-5 text-emerald-600 rounded" />
        </label>
      </div>
    </div>
  </div>
</template>
