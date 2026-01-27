import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { orderApi } from '@/services/api'
import type { Order, CartItem, OrderStatus } from '@/types'
import { MOCK_ORDERS } from '@/constants'
import { useNotificationStore } from './notification'
import { useProductStore } from './product'
import { useTableStore } from './table'

export const useOrderStore = defineStore('order', () => {
  const notification = useNotificationStore()
  const productStore = useProductStore()
  const tableStore = useTableStore()

  // State
  const orders = ref<Order[]>([...MOCK_ORDERS])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const pendingOrders = computed(() => {
    return orders.value.filter(o => o.status === 'PENDING')
  })

  const completedOrders = computed(() => {
    return orders.value.filter(o => o.status === 'COMPLETED')
  })

  const todayOrders = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return orders.value.filter(o => o.timestamp >= today.getTime())
  })

  const todayRevenue = computed(() => {
    return todayOrders.value
      .filter(o => o.status === 'COMPLETED')
      .reduce((sum, o) => sum + o.total, 0)
  })

  const todayProfit = computed(() => {
    return todayOrders.value
      .filter(o => o.status === 'COMPLETED')
      .reduce((sum, o) => sum + (o.total - (o.totalCost || 0)), 0)
  })

  const getOrdersByTable = computed(() => {
    return (tableId: string) => orders.value.filter(o => o.tableId === tableId)
  })

  // Actions
  async function fetchOrders(params?: { status?: string; startDate?: number; endDate?: number }) {
    loading.value = true
    error.value = null
    try {
      const data = await orderApi.list(params)
      orders.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取订单失败'
      // Keep mock data on error
    } finally {
      loading.value = false
    }
  }

  async function createOrder(
    tableId: string,
    items: CartItem[],
    total: number,
    type: 'DINE_IN' | 'DELIVERY' | 'PICKUP'
  ) {
    // Calculate total cost
    const totalCost = items.reduce((sum, item) => {
      return sum + (item.costPrice || 0) * item.quantity
    }, 0)

    // Generate order number
    const orderNo = `${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${Date.now().toString().slice(-8)}`

    const orderData = {
      orderNo,
      tableId,
      items: items.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        costPrice: item.costPrice,
        image: item.image,
        unit: item.unit,
        quantity: item.quantity,
      })),
      status: 'PENDING',
      timestamp: Date.now(),
      type,
    }

    try {
      const newOrder = await orderApi.create(orderData)
      orders.value.push(newOrder)

      // Update table status if dine-in
      if (type === 'DINE_IN' && tableId) {
        await tableStore.updateTableStatus(tableId, 'UNPAID', newOrder.id)
      }

      // Deduct stock for each item
      for (const item of items) {
        const product = productStore.products.find(p => p.id === item.id)
        if (product) {
          product.stock -= item.quantity
        }
      }

      notification.success('订单创建成功')
      return newOrder
    } catch (err) {
      // Fallback: create locally
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNo,
        tableId,
        items,
        total,
        totalCost,
        status: 'PENDING' as OrderStatus,
        timestamp: Date.now(),
        type,
      }
      orders.value.push(newOrder)

      // Update table status if dine-in
      if (type === 'DINE_IN' && tableId) {
        tableStore.updateTableStatus(tableId, 'UNPAID', newOrder.id)
      }

      // Deduct stock
      for (const item of items) {
        const product = productStore.products.find(p => p.id === item.id)
        if (product) {
          product.stock -= item.quantity
        }
      }

      notification.success('订单创建成功 (本地)')
      return newOrder
    }
  }

  async function updateOrderStatus(orderId: string, status: OrderStatus) {
    try {
      const updated = await orderApi.updateStatus(orderId, status)
      const order = orders.value.find(o => o.id === orderId)
      if (order) {
        order.status = status
      }

      // If completed, update table status
      if (status === 'COMPLETED' && order?.tableId) {
        await tableStore.updateTableStatus(order.tableId, 'PAID')
      }

      notification.success('订单状态更新成功')
      return updated
    } catch (err) {
      // Fallback: update locally
      const order = orders.value.find(o => o.id === orderId)
      if (order) {
        order.status = status

        // If completed, update table status
        if (status === 'COMPLETED' && order.tableId) {
          tableStore.updateTableStatus(order.tableId, 'PAID')
        }
      }
      notification.success('订单状态更新成功 (本地)')
      return order
    }
  }

  async function cancelOrder(orderId: string, reason?: string) {
    try {
      await orderApi.cancel(orderId, reason)
      const order = orders.value.find(o => o.id === orderId)
      if (order) {
        order.status = 'CANCELLED' as OrderStatus
      }
      notification.success('订单已取消')
    } catch (err) {
      const order = orders.value.find(o => o.id === orderId)
      if (order) {
        order.status = 'CANCELLED' as OrderStatus
      }
      notification.success('订单已取消 (本地)')
    }
  }

  function reset() {
    orders.value = [...MOCK_ORDERS]
  }

  return {
    // State
    orders,
    loading,
    error,
    // Getters
    pendingOrders,
    completedOrders,
    todayOrders,
    todayRevenue,
    todayProfit,
    getOrdersByTable,
    // Actions
    fetchOrders,
    createOrder,
    updateOrderStatus,
    cancelOrder,
    reset,
  }
})
