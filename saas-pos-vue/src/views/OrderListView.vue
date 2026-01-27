<script setup lang="ts">
import { ref, computed } from 'vue'
import { useOrderStore } from '@/stores/order'
import { useTableStore } from '@/stores/table'
import { OrderStatus } from '@/types'
import { Search, Eye, XCircle, RefreshCw, ClipboardList } from 'lucide-vue-next'
import { Modal, Button } from '@/components/ui'

const orderStore = useOrderStore()
const tableStore = useTableStore()

// State
const searchQuery = ref('')
const statusFilter = ref<string>('all')
const showDetailModal = ref(false)
const selectedOrder = ref<any>(null)

// Computed
const filteredOrders = computed(() => {
  let orders = [...orderStore.orders].sort((a, b) => b.timestamp - a.timestamp)

  if (statusFilter.value !== 'all') {
    orders = orders.filter(o => o.status === statusFilter.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    orders = orders.filter(o =>
      o.orderNo.toLowerCase().includes(query) ||
      o.items.some(item => item.name.toLowerCase().includes(query))
    )
  }

  return orders
})

const statusOptions = [
  { value: 'all', label: '全部' },
  { value: 'PENDING', label: '待处理' },
  { value: 'COMPLETED', label: '已完成' },
  { value: 'CANCELLED', label: '已取消' },
  { value: 'REFUNDED', label: '已退款' },
]

// Methods
function getStatusStyle(status: OrderStatus) {
  const styles: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    COMPLETED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-gray-100 text-gray-500',
    REFUNDED: 'bg-red-100 text-red-700',
  }
  return styles[status] || styles.PENDING
}

function getStatusLabel(status: OrderStatus) {
  const labels: Record<string, string> = {
    PENDING: '待处理',
    COMPLETED: '已完成',
    CANCELLED: '已取消',
    REFUNDED: '已退款',
  }
  return labels[status] || status
}

function getOrderTypeLabel(type: string) {
  const labels: Record<string, string> = {
    DINE_IN: '堂食',
    DELIVERY: '外卖',
    PICKUP: '自取',
  }
  return labels[type] || type
}

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleString('zh-CN')
}

function viewOrder(order: any) {
  selectedOrder.value = order
  showDetailModal.value = true
}

function completeOrder(order: any) {
  orderStore.updateOrderStatus(order.id, OrderStatus.COMPLETED)
}

function cancelOrder(order: any) {
  if (confirm('确定要取消此订单吗？')) {
    orderStore.cancelOrder(order.id)
  }
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold text-gray-800">订单列表</h1>
      <div class="text-sm text-gray-500">
        共 {{ filteredOrders.length }} 个订单
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg shadow-sm">
      <div class="flex flex-wrap gap-4">
        <!-- Search -->
        <div class="relative flex-1 min-w-[200px]">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索订单号或商品..."
            class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <!-- Status filter -->
        <div class="flex gap-2">
          <button
            v-for="option in statusOptions"
            :key="option.value"
            @click="statusFilter = option.value"
            :class="[
              'px-3 py-2 text-sm rounded-lg transition-colors',
              statusFilter === option.value
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Orders table -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">订单号</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">桌台</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">商品</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">金额</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">时间</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 text-sm font-mono text-gray-600">
              {{ order.orderNo }}
            </td>
            <td class="px-4 py-3">
              <span class="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700">
                {{ getOrderTypeLabel(order.type) }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-600">
              {{ order.tableId ? tableStore.getTableName(order.tableId) + '号桌' : '-' }}
            </td>
            <td class="px-4 py-3">
              <div class="text-sm text-gray-600">
                {{ order.items.map(i => i.name).slice(0, 2).join(', ') }}
                <span v-if="order.items.length > 2" class="text-gray-400">
                  等{{ order.items.length }}件
                </span>
              </div>
            </td>
            <td class="px-4 py-3 text-sm font-medium text-emerald-600">
              ¥{{ order.total.toFixed(2) }}
            </td>
            <td class="px-4 py-3">
              <span :class="['px-2 py-1 text-xs rounded-full', getStatusStyle(order.status)]">
                {{ getStatusLabel(order.status) }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-500">
              {{ formatTime(order.timestamp) }}
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-1">
                <button
                  @click="viewOrder(order)"
                  class="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                  title="查看详情"
                >
                  <Eye class="w-4 h-4" />
                </button>
                <button
                  v-if="order.status === 'PENDING'"
                  @click="completeOrder(order)"
                  class="p-1 text-green-600 hover:bg-green-50 rounded"
                  title="完成订单"
                >
                  <RefreshCw class="w-4 h-4" />
                </button>
                <button
                  v-if="order.status === 'PENDING'"
                  @click="cancelOrder(order)"
                  class="p-1 text-red-600 hover:bg-red-50 rounded"
                  title="取消订单"
                >
                  <XCircle class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredOrders.length === 0" class="py-12 text-center text-gray-400">
        <ClipboardList class="w-12 h-12 mx-auto mb-4" />
        <p>没有找到订单</p>
      </div>
    </div>

    <!-- Order Detail Modal -->
    <Modal v-model="showDetailModal" title="订单详情" size="lg">
      <div v-if="selectedOrder" class="space-y-4">
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-gray-500">订单号：</span>
            <span class="font-mono">{{ selectedOrder.orderNo }}</span>
          </div>
          <div>
            <span class="text-gray-500">订单类型：</span>
            <span>{{ getOrderTypeLabel(selectedOrder.type) }}</span>
          </div>
          <div>
            <span class="text-gray-500">桌台：</span>
            <span>{{ selectedOrder.tableId ? tableStore.getTableName(selectedOrder.tableId) + '号桌' : '-' }}</span>
          </div>
          <div>
            <span class="text-gray-500">状态：</span>
            <span :class="['px-2 py-1 text-xs rounded-full', getStatusStyle(selectedOrder.status)]">
              {{ getStatusLabel(selectedOrder.status) }}
            </span>
          </div>
          <div>
            <span class="text-gray-500">下单时间：</span>
            <span>{{ formatTime(selectedOrder.timestamp) }}</span>
          </div>
          <div>
            <span class="text-gray-500">支付方式：</span>
            <span>{{ selectedOrder.paymentMethod || '-' }}</span>
          </div>
        </div>

        <div class="border-t pt-4">
          <h4 class="font-medium text-gray-800 mb-3">商品明细</h4>
          <div class="space-y-2">
            <div
              v-for="item in selectedOrder.items"
              :key="item.id"
              class="flex justify-between items-center p-2 bg-gray-50 rounded"
            >
              <div class="flex items-center gap-2">
                <img
                  :src="item.image || 'https://via.placeholder.com/40'"
                  class="w-10 h-10 rounded object-cover"
                />
                <div>
                  <p class="text-sm font-medium">{{ item.name }}</p>
                  <p class="text-xs text-gray-500">¥{{ item.price.toFixed(2) }} × {{ item.quantity }}</p>
                </div>
              </div>
              <span class="font-medium text-emerald-600">
                ¥{{ (item.price * item.quantity).toFixed(2) }}
              </span>
            </div>
          </div>
        </div>

        <div class="border-t pt-4 flex justify-between text-lg">
          <span class="font-medium">订单总额</span>
          <span class="font-bold text-emerald-600">¥{{ selectedOrder.total.toFixed(2) }}</span>
        </div>
      </div>

      <template #footer>
        <Button variant="outline" @click="showDetailModal = false">关闭</Button>
      </template>
    </Modal>
  </div>
</template>
