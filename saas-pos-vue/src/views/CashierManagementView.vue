<script setup lang="ts">
import { ref } from 'vue'
import { Calculator, DollarSign, CreditCard, Clock } from 'lucide-vue-next'
import { Button } from '@/components/ui'

const shifts = ref([
  { id: '1', cashier: '张三', startTime: '09:00', endTime: '17:00', openingBalance: 500, closingBalance: 2580, sales: 2080, status: 'completed' },
  { id: '2', cashier: '李四', startTime: '17:00', endTime: null, openingBalance: 500, closingBalance: null, sales: 850, status: 'active' },
])

const currentShift = shifts.value.find(s => s.status === 'active')
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold text-gray-800">收银管理</h1>
      <Button variant="primary" v-if="!currentShift">开始交班</Button>
      <Button variant="outline" v-else>结束交班</Button>
    </div>
    <div class="grid grid-cols-4 gap-4">
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-blue-100 rounded-lg"><Calculator class="w-6 h-6 text-blue-600" /></div>
          <div><div class="text-sm text-gray-500">当前收银员</div><div class="text-xl font-bold">{{ currentShift?.cashier || '无' }}</div></div>
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-green-100 rounded-lg"><DollarSign class="w-6 h-6 text-green-600" /></div>
          <div><div class="text-sm text-gray-500">当班销售额</div><div class="text-xl font-bold text-green-600">¥{{ (currentShift?.sales || 0).toFixed(2) }}</div></div>
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-purple-100 rounded-lg"><CreditCard class="w-6 h-6 text-purple-600" /></div>
          <div><div class="text-sm text-gray-500">备用金</div><div class="text-xl font-bold text-purple-600">¥{{ (currentShift?.openingBalance || 0).toFixed(2) }}</div></div>
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-orange-100 rounded-lg"><Clock class="w-6 h-6 text-orange-600" /></div>
          <div><div class="text-sm text-gray-500">当班开始</div><div class="text-xl font-bold">{{ currentShift?.startTime || '-' }}</div></div>
        </div>
      </div>
    </div>
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="p-4 border-b"><h3 class="font-bold text-gray-800">交班记录</h3></div>
      <table class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">收银员</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">开始时间</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">结束时间</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">备用金</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">销售额</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="shift in shifts" :key="shift.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 font-medium">{{ shift.cashier }}</td>
            <td class="px-4 py-3 text-gray-600">{{ shift.startTime }}</td>
            <td class="px-4 py-3 text-gray-600">{{ shift.endTime || '-' }}</td>
            <td class="px-4 py-3">¥{{ shift.openingBalance.toFixed(2) }}</td>
            <td class="px-4 py-3 font-medium text-green-600">¥{{ shift.sales.toFixed(2) }}</td>
            <td class="px-4 py-3"><span :class="['px-2 py-1 text-xs rounded-full', shift.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600']">{{ shift.status === 'active' ? '进行中' : '已完成' }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
