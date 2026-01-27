<script setup lang="ts">
import { computed } from 'vue'
import { useTableStore } from '@/stores/table'
import { useOrderStore } from '@/stores/order'
import { Table2, Users, Clock, TrendingUp } from 'lucide-vue-next'

const tableStore = useTableStore()
const orderStore = useOrderStore()

const tableStats = computed(() => {
  return tableStore.tables.map(table => {
    const orders = orderStore.getOrdersByTable(table.id)
    const completedOrders = orders.filter(o => o.status === 'COMPLETED')
    const revenue = completedOrders.reduce((sum, o) => sum + o.total, 0)
    return { ...table, orderCount: orders.length, completedCount: completedOrders.length, revenue }
  })
})

const totalRevenue = computed(() => tableStats.value.reduce((sum, t) => sum + t.revenue, 0))
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-xl font-bold text-gray-800">桌台统计</h1>
    <div class="grid grid-cols-4 gap-4">
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-blue-100 rounded-lg"><Table2 class="w-6 h-6 text-blue-600" /></div>
          <div><div class="text-sm text-gray-500">总桌台数</div><div class="text-2xl font-bold">{{ tableStore.tables.length }}</div></div>
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-green-100 rounded-lg"><Users class="w-6 h-6 text-green-600" /></div>
          <div><div class="text-sm text-gray-500">总容纳人数</div><div class="text-2xl font-bold">{{ tableStore.tables.reduce((sum, t) => sum + t.capacity, 0) }}</div></div>
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-purple-100 rounded-lg"><Clock class="w-6 h-6 text-purple-600" /></div>
          <div><div class="text-sm text-gray-500">使用中</div><div class="text-2xl font-bold text-purple-600">{{ tableStore.occupiedTables.length }}</div></div>
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-orange-100 rounded-lg"><TrendingUp class="w-6 h-6 text-orange-600" /></div>
          <div><div class="text-sm text-gray-500">总营业额</div><div class="text-2xl font-bold text-orange-600">¥{{ totalRevenue.toFixed(2) }}</div></div>
        </div>
      </div>
    </div>
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">桌台</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">区域</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">容量</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">订单数</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">营业额</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="table in tableStats" :key="table.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 font-medium">{{ table.name }}号桌</td>
            <td class="px-4 py-3 text-gray-600">{{ table.area || '-' }}</td>
            <td class="px-4 py-3 text-gray-600">{{ table.capacity }}人</td>
            <td class="px-4 py-3"><span :class="['px-2 py-1 text-xs rounded-full', table.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700']">{{ table.status === 'AVAILABLE' ? '空闲' : '使用中' }}</span></td>
            <td class="px-4 py-3">{{ table.orderCount }}</td>
            <td class="px-4 py-3 font-medium text-blue-600">¥{{ table.revenue.toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
