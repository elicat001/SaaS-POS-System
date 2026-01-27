<script setup lang="ts">
import { ref } from 'vue'
import { Store, Save, MapPin, Phone, Clock } from 'lucide-vue-next'
import { Button, Input } from '@/components/ui'
import { useNotificationStore } from '@/stores/notification'

const notification = useNotificationStore()

const store = ref({
  name: '美味餐厅',
  address: '北京市朝阳区建国路88号',
  phone: '010-12345678',
  openTime: '09:00',
  closeTime: '22:00',
  description: '专注美食，用心服务',
})

function save() {
  notification.success('店铺信息保存成功')
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold text-gray-800">店铺设置</h1>
      <Button variant="primary" @click="save"><Save class="w-4 h-4" />保存</Button>
    </div>
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-blue-100 rounded-lg"><Store class="w-6 h-6 text-blue-600" /></div>
        <div><h2 class="font-bold text-gray-800">店铺基本信息</h2><p class="text-sm text-gray-500">设置您的店铺展示信息</p></div>
      </div>
      <div class="grid gap-4 max-w-xl">
        <Input v-model="store.name" label="店铺名称" placeholder="请输入店铺名称" />
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"><MapPin class="w-4 h-4 inline mr-1" />店铺地址</label>
          <input v-model="store.address" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入店铺地址" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"><Phone class="w-4 h-4 inline mr-1" />联系电话</label>
          <input v-model="store.phone" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入联系电话" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"><Clock class="w-4 h-4 inline mr-1" />营业开始</label>
            <input v-model="store.openTime" type="time" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">营业结束</label>
            <input v-model="store.closeTime" type="time" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">店铺简介</label>
          <textarea v-model="store.description" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入店铺简介"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>
