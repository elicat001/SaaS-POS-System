<script setup lang="ts">
import { ref } from 'vue'
import { Percent, Users, TrendingUp, DollarSign } from 'lucide-vue-next'

const commissionData = ref([
  { id: '1', name: '张店长', role: '店长', sales: 12580.00, commission: 628.00, orders: 45 },
  { id: '2', name: '李收银', role: '收银员', sales: 8650.00, commission: 259.50, orders: 32 },
  { id: '3', name: '王服务', role: '服务员', sales: 5200.00, commission: 156.00, orders: 28 },
])

const totalSales = commissionData.value.reduce((sum, d) => sum + d.sales, 0)
const totalCommission = commissionData.value.reduce((sum, d) => sum + d.commission, 0)
const totalOrders = commissionData.value.reduce((sum, d) => sum + d.orders, 0)
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-xl font-bold text-gray-800">佣金统计</h1>
    <div class="grid grid-cols-4 gap-4">
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-emerald-100 rounded-lg"><Users class="w-6 h-6 text-emerald-600" /></div>
          <div><div class="text-sm text-gray-500">员工数</div><div class="text-2xl font-bold">{{ commissionData.length }}</div></div>
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-green-100 rounded-lg"><DollarSign class="w-6 h-6 text-green-600" /></div>
          <div><div class="text-sm text-gray-500">总销售额</div><div class="text-2xl font-bold text-green-600">¥{{ totalSales.toFixed(2) }}</div></div>
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-purple-100 rounded-lg"><Percent class="w-6 h-6 text-purple-600" /></div>
          <div><div class="text-sm text-gray-500">总佣金</div><div class="text-2xl font-bold text-purple-600">¥{{ totalCommission.toFixed(2) }}</div></div>
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-orange-100 rounded-lg"><TrendingUp class="w-6 h-6 text-orange-600" /></div>
          <div><div class="text-sm text-gray-500">总订单数</div><div class="text-2xl font-bold text-orange-600">{{ totalOrders }}</div></div>
        </div>
      </div>
    </div>
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="p-4 border-b"><h3 class="font-bold text-gray-800">员工佣金明细</h3></div>
      <table class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">员工</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">职位</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">销售额</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">订单数</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">佣金</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="item in commissionData" :key="item.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 font-medium">{{ item.name }}</td>
            <td class="px-4 py-3"><span class="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700">{{ item.role }}</span></td>
            <td class="px-4 py-3 text-green-600">¥{{ item.sales.toFixed(2) }}</td>
            <td class="px-4 py-3">{{ item.orders }}</td>
            <td class="px-4 py-3 font-medium text-purple-600">¥{{ item.commission.toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
