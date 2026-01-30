import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product, Table, Order, Supplier, StockLog, StockTransactionType } from '@/types'
import { productApi, tableApi, orderApi, supplierApi, inventoryApi } from '@/services/api'

export const useAppStore = defineStore('app', () => {
  // State
  const products = ref<Product[]>([])
  const tables = ref<Table[]>([])
  const orders = ref<Order[]>([])
  const suppliers = ref<Supplier[]>([])
  const stockLogs = ref<StockLog[]>([])
  
  const loading = ref({
    global: false,
    products: false,
    tables: false,
    orders: false,
    suppliers: false,
    inventory: false,
  })

  const error = ref<string | null>(null)

  // Getters
  const availableTables = computed(() => 
    tables.value.filter(table => table.status === 'AVAILABLE')
  )

  const lowStockProducts = computed(() =>
    products.value.filter(product => 
      product.minStock && product.stock <= product.minStock
    )
  )

  const todayOrders = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    const todayTimestamp = new Date(today).getTime()
    const tomorrowTimestamp = todayTimestamp + 24 * 60 * 60 * 1000
    
    return orders.value.filter(order => 
      order.timestamp >= todayTimestamp && order.timestamp < tomorrowTimestamp
    )
  })

  // Actions
  const initializeData = async () => {
    try {
      loading.value.global = true
      error.value = null
      
      await Promise.all([
        fetchProducts(),
        fetchTables(),
        fetchOrders(),
        fetchSuppliers(),
        fetchStockLogs(),
      ])
    } catch (err: any) {
      error.value = err.message || '初始化数据失败'
      console.error('初始化数据失败:', err)
    } finally {
      loading.value.global = false
    }
  }

  const fetchProducts = async () => {
    try {
      loading.value.products = true
      products.value = await productApi.list()
    } finally {
      loading.value.products = false
    }
  }

  const fetchTables = async () => {
    try {
      loading.value.tables = true
      tables.value = await tableApi.list()
    } finally {
      loading.value.tables = false
    }
  }

  const fetchOrders = async () => {
    try {
      loading.value.orders = true
      orders.value = await orderApi.list()
    } finally {
      loading.value.orders = false
    }
  }

  const fetchSuppliers = async () => {
    try {
      loading.value.suppliers = true
      suppliers.value = await supplierApi.list()
    } finally {
      loading.value.suppliers = false
    }
  }

  const fetchStockLogs = async () => {
    try {
      loading.value.inventory = true
      stockLogs.value = await inventoryApi.getLogs()
    } finally {
      loading.value.inventory = false
    }
  }

  const updateProduct = async (productId: string, updates: Partial<Product>) => {
    try {
      const updatedProduct = await productApi.update(productId, updates)
      const index = products.value.findIndex(p => p.id === productId)
      if (index !== -1) {
        products.value[index] = { ...products.value[index], ...updatedProduct }
      }
      return updatedProduct
    } catch (err: any) {
      error.value = err.message || '更新商品失败'
      throw err
    }
  }

  const updateStock = async (productId: string, quantity: number, type: StockTransactionType, note?: string) => {
    try {
      await productApi.updateStock(productId, quantity, type, note)
      await fetchProducts()
      await fetchStockLogs()
    } catch (err: any) {
      error.value = err.message || '更新库存失败'
      throw err
    }
  }

  const createOrder = async (tableId: string, items: any[], total: number, type: 'DINE_IN' | 'DELIVERY' | 'PICKUP') => {
    try {
      const newOrder = await orderApi.create({
        tableId,
        items,
        total,
        type,
      })
      orders.value.push(newOrder)
      return newOrder
    } catch (err: any) {
      error.value = err.message || '创建订单失败'
      throw err
    }
  }

  const addSupplier = async (supplierData: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newSupplier = await supplierApi.create(supplierData)
      suppliers.value.push(newSupplier)
      return newSupplier
    } catch (err: any) {
      error.value = err.message || '添加供应商失败'
      throw err
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    products,
    tables,
    orders,
    suppliers,
    stockLogs,
    loading,
    error,
    
    // Getters
    availableTables,
    lowStockProducts,
    todayOrders,
    
    // Actions
    initializeData,
    fetchProducts,
    fetchTables,
    fetchOrders,
    fetchSuppliers,
    fetchStockLogs,
    updateProduct,
    updateStock,
    createOrder,
    addSupplier,
    clearError,
  }
})