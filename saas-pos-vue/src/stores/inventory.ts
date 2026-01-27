import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { inventoryApi } from '@/services/api'
import type { StockLog, StockTransactionType } from '@/types'
import { MOCK_STOCK_LOGS } from '@/constants'
import { useNotificationStore } from './notification'
import { useProductStore } from './product'

export const useInventoryStore = defineStore('inventory', () => {
  const notification = useNotificationStore()
  const productStore = useProductStore()

  // State
  const stockLogs = ref<StockLog[]>([...MOCK_STOCK_LOGS])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const recentLogs = computed(() => {
    return [...stockLogs.value]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 20)
  })

  const inboundLogs = computed(() => {
    return stockLogs.value.filter(log =>
      log.type === '采购入库' || log.type === '退货入库'
    )
  })

  const outboundLogs = computed(() => {
    return stockLogs.value.filter(log =>
      log.type === '销售出库' || log.type === '损耗出库'
    )
  })

  const logsByProduct = computed(() => {
    return (productId: string) => stockLogs.value.filter(log => log.productId === productId)
  })

  const totalStockValue = computed(() => {
    return productStore.products.reduce((sum, p) => sum + p.price * p.stock, 0)
  })

  const totalStockCost = computed(() => {
    return productStore.products.reduce((sum, p) => sum + (p.costPrice || 0) * p.stock, 0)
  })

  // Actions
  async function fetchLogs(params?: { productId?: string; type?: string; startDate?: number; endDate?: number }) {
    loading.value = true
    error.value = null
    try {
      const data = await inventoryApi.getLogs(params)
      stockLogs.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取库存日志失败'
      // Keep mock data on error
    } finally {
      loading.value = false
    }
  }

  async function createStockLog(
    productId: string,
    productName: string,
    type: StockTransactionType,
    delta: number,
    currentStock: number,
    operator: string,
    note?: string
  ) {
    const logData = {
      productId,
      productName,
      type: type as unknown as string,
      delta,
      currentStock,
      operator,
      timestamp: Date.now(),
      note,
    }

    try {
      const newLog = await inventoryApi.createLog(logData)
      stockLogs.value.push(newLog)
      return newLog
    } catch (err) {
      // Fallback: create locally
      const newLog: StockLog = {
        id: `log-${Date.now()}`,
        productId,
        productName,
        type,
        delta,
        currentStock,
        operator,
        timestamp: Date.now(),
        note,
      }
      stockLogs.value.push(newLog)
      return newLog
    }
  }

  async function recordPurchase(
    productId: string,
    quantity: number,
    operator: string,
    note?: string
  ) {
    const product = productStore.products.find(p => p.id === productId)
    if (!product) {
      notification.error('商品不存在')
      return
    }

    const newStock = product.stock + quantity
    await createStockLog(
      productId,
      product.name,
      '采购入库' as unknown as StockTransactionType,
      quantity,
      newStock,
      operator,
      note
    )

    product.stock = newStock
    notification.success(`${product.name} 入库 ${quantity} ${product.unit}`)
  }

  async function recordSale(
    productId: string,
    quantity: number,
    operator: string = '系统'
  ) {
    const product = productStore.products.find(p => p.id === productId)
    if (!product) return

    const newStock = product.stock - quantity
    await createStockLog(
      productId,
      product.name,
      '销售出库' as unknown as StockTransactionType,
      -quantity,
      newStock,
      operator
    )

    product.stock = newStock
  }

  async function recordLoss(
    productId: string,
    quantity: number,
    operator: string,
    note?: string
  ) {
    const product = productStore.products.find(p => p.id === productId)
    if (!product) {
      notification.error('商品不存在')
      return
    }

    const newStock = product.stock - quantity
    await createStockLog(
      productId,
      product.name,
      '损耗出库' as unknown as StockTransactionType,
      -quantity,
      newStock,
      operator,
      note
    )

    product.stock = newStock
    notification.success(`${product.name} 损耗 ${quantity} ${product.unit}`)
  }

  async function adjustStock(
    productId: string,
    actualStock: number,
    operator: string,
    note?: string
  ) {
    const product = productStore.products.find(p => p.id === productId)
    if (!product) {
      notification.error('商品不存在')
      return
    }

    const delta = actualStock - product.stock
    await createStockLog(
      productId,
      product.name,
      '库存盘点' as unknown as StockTransactionType,
      delta,
      actualStock,
      operator,
      note || `盘点调整: ${product.stock} → ${actualStock}`
    )

    product.stock = actualStock
    notification.success(`${product.name} 库存已调整为 ${actualStock} ${product.unit}`)
  }

  function reset() {
    stockLogs.value = [...MOCK_STOCK_LOGS]
  }

  return {
    // State
    stockLogs,
    loading,
    error,
    // Getters
    recentLogs,
    inboundLogs,
    outboundLogs,
    logsByProduct,
    totalStockValue,
    totalStockCost,
    // Actions
    fetchLogs,
    createStockLog,
    recordPurchase,
    recordSale,
    recordLoss,
    adjustStock,
    reset,
  }
})
