<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-slate-900">订单管理</h2>
      <div class="flex gap-3">
        <button class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-sm font-medium">
          筛选导出
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Date Range -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">日期范围</label>
          <select class="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-500">
            <option>今天</option>
            <option>昨天</option>
            <option>本周</option>
            <option>本月</option>
            <option>自定义</option>
          </select>
        </div>
        
        <!-- Order Status -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">订单状态</label>
          <select class="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-500">
            <option>全部状态</option>
            <option>待处理</option>
            <option>已完成</option>
            <option>已取消</option>
          </select>
        </div>
        
        <!-- Order Type -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">订单类型</label>
          <select class="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-500">
            <option>全部类型</option>
            <option>堂食</option>
            <option>自取</option>
            <option>配送</option>
          </select>
        </div>
        
        <!-- Search -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">搜索</label>
          <div class="relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="18" />
            <input 
              type="text" 
              placeholder="订单号/桌台号"
              class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-emerald-500"
              v-model="searchTerm"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="text-left py-3 px-4 text-sm font-medium text-slate-600">订单信息</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-slate-600">桌台/类型</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-slate-600">金额</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-slate-600">状态</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-slate-600">时间</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-slate-600">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in filteredOrders" :key="order.id" class="border-b border-slate-100 hover:bg-slate-50">
              <td class="py-3 px-4">
                <div>
                  <div class="font-medium text-slate-800">{{ order.orderNo }}</div>
                  <div class="text-xs text-slate-500 mt-1">
                    {{ order.items.length }} 件商品
                  </div>
                </div>
              </td>
              <td class="py-3 px-4">
                <div>
                  <div class="text-sm text-slate-800">桌台 {{ order.tableId }}</div>
                  <div class="text-xs text-slate-500 mt-1">
                    {{ getOrderTypeName(order.type) }}
                  </div>
                </div>
              </td>
              <td class="py-3 px-4">
                <div class="font-bold text-slate-900">¥{{ order.total.toFixed(2) }}</div>
                <div v-if="order.totalCost" class="text-xs text-slate-500">
                  成本: ¥{{ order.totalCost.toFixed(2) }}
                </div>
              </td>
              <td class="py-3 px-4">
                <span :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  getStatusClass(order.status)
                ]">
                  {{ getStatusName(order.status) }}
                </span>
              </td>
              <td class="py-3 px-4">
                <div class="text-sm text-slate-600">
                  {{ formatTime(order.timestamp) }}
                </div>
              </td>
              <td class="py-3 px-4">
                <div class="flex items-center gap-2">
                  <button class="px-3 py-1 border border-slate-300 rounded text-xs text-slate-600 hover:bg-slate-50">
                    详情
                  </button>
                  <button v-if="order.status === 'PENDING'" class="px-3 py-1 bg-emerald-500 text-white rounded text-xs hover:bg-emerald-600">
                    完成
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="filteredOrders.length === 0" class="py-12 text-center text-slate-400">
        <Search :size="48" class="mx-auto mb-3 text-slate-300" />
        <p>没有找到匹配的订单</p>
        <p class="text-sm mt-1">尝试调整筛选条件</p>
      </div>

      <!-- Pagination -->
      <div class="px-4 py-3 border-t border-slate-200 flex items-center justify-between">
        <div class="text-sm text-slate-600">
          共 {{ filteredOrders.length }} 个订单
        </div>
        <div class="flex items-center gap-2">
          <button class="px-3 py-1 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50">
            上一页
          </button>
          <span class="px-3 py-1 bg-emerald-500 text-white rounded text-sm">1</span>
          <button class="px-3 py-1 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50">
            下一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search } from 'lucide-vue-next'
import type { Order, OrderStatus } from '@/types'

interface Props {
  orders: Order[]
}

const props = withDefaults(defineProps<Props>(), {
  orders: () => []
})

// State
const searchTerm = ref('')

// Computed
const filteredOrders = computed(() => {
  let result = props.orders
  
  // Search filter
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    result = result.filter(order => 
      order.orderNo.toLowerCase().includes(term) ||
      order.tableId.toLowerCase().includes(term)
    )
  }
  
  return result
})

// Methods
const getOrderTypeName = (type: string) => {
  const typeMap: Record<string, string> = {
    'DINE_IN': '堂食',
    'DELIVERY': '配送',
    'PICKUP': '自取'
  }
  return typeMap[type] || type
}

const getStatusName = (status: OrderStatus) => {
  const statusMap: Record<OrderStatus, string> = {
    'PENDING': '待处理',
    'COMPLETED': '已完成',
    'CANCELLED': '已取消',
    'REFUNDED': '已退款'
  }
  return statusMap[status] || status
}

const getStatusClass = (status: OrderStatus) => {
  const classMap: Record<OrderStatus, string> = {
    'PENDING': 'bg-amber-100 text-amber-700',
    'COMPLETED': 'bg-emerald-100 text-emerald-700',
    'CANCELLED': 'bg-red-100 text-red-700',
    'REFUNDED': 'bg-slate-100 text-slate-700'
  }
  return classMap[status] || 'bg-slate-100 text-slate-700'
}

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>