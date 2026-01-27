import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { productApi, categoryApi, supplierApi } from '@/services/api'
import type { Product, Category, Supplier, StockTransactionType } from '@/types'
import { INITIAL_PRODUCTS, CATEGORIES, MOCK_SUPPLIERS } from '@/constants'
import { useNotificationStore } from './notification'

export const useProductStore = defineStore('product', () => {
  const notification = useNotificationStore()

  // State
  const products = ref<Product[]>([...INITIAL_PRODUCTS])
  const categories = ref<Category[]>([...CATEGORIES])
  const suppliers = ref<Supplier[]>([...MOCK_SUPPLIERS])
  const loading = ref({
    products: false,
    categories: false,
    suppliers: false,
  })
  const errors = ref({
    products: null as string | null,
    categories: null as string | null,
    suppliers: null as string | null,
  })

  // Getters
  const productsByCategory = computed(() => {
    return (categoryId: string) => {
      if (categoryId === 'c1') return products.value // 'All' category
      return products.value.filter(p => p.categoryId === categoryId)
    }
  })

  const availableProducts = computed(() => {
    return products.value.filter(p => p.isOnShelf && p.stock > 0)
  })

  const lowStockProducts = computed(() => {
    return products.value.filter(p => p.minStock && p.stock <= p.minStock)
  })

  const getCategoryName = computed(() => {
    return (categoryId: string) => {
      return categories.value.find(c => c.id === categoryId)?.name || ''
    }
  })

  const getSupplierName = computed(() => {
    return (supplierId: string | undefined) => {
      if (!supplierId) return ''
      return suppliers.value.find(s => s.id === supplierId)?.name || ''
    }
  })

  // Actions
  async function fetchProducts() {
    loading.value.products = true
    errors.value.products = null
    try {
      const data = await productApi.list()
      products.value = data
    } catch (err) {
      errors.value.products = err instanceof Error ? err.message : '获取商品失败'
      // Keep mock data on error
    } finally {
      loading.value.products = false
    }
  }

  async function fetchCategories() {
    loading.value.categories = true
    errors.value.categories = null
    try {
      const data = await categoryApi.list()
      categories.value = data
    } catch (err) {
      errors.value.categories = err instanceof Error ? err.message : '获取分类失败'
      // Keep mock data on error
    } finally {
      loading.value.categories = false
    }
  }

  async function fetchSuppliers() {
    loading.value.suppliers = true
    errors.value.suppliers = null
    try {
      const data = await supplierApi.list()
      suppliers.value = data
    } catch (err) {
      errors.value.suppliers = err instanceof Error ? err.message : '获取供应商失败'
      // Keep mock data on error
    } finally {
      loading.value.suppliers = false
    }
  }

  async function createProduct(data: Omit<Product, 'id'>) {
    try {
      const newProduct = await productApi.create(data)
      products.value.push(newProduct)
      notification.success('商品创建成功')
      return newProduct
    } catch (err) {
      // Fallback: create locally
      const newProduct: Product = {
        ...data,
        id: `p${Date.now()}`,
      }
      products.value.push(newProduct)
      notification.success('商品创建成功 (本地)')
      return newProduct
    }
  }

  async function updateProduct(product: Product) {
    try {
      const updated = await productApi.update(product.id, product)
      const index = products.value.findIndex(p => p.id === product.id)
      if (index > -1) {
        products.value[index] = updated
      }
      notification.success('商品更新成功')
      return updated
    } catch (err) {
      // Fallback: update locally
      const index = products.value.findIndex(p => p.id === product.id)
      if (index > -1) {
        products.value[index] = product
      }
      notification.success('商品更新成功 (本地)')
      return product
    }
  }

  async function deleteProduct(id: string) {
    try {
      await productApi.delete(id)
      products.value = products.value.filter(p => p.id !== id)
      notification.success('商品删除成功')
    } catch (err) {
      // Fallback: delete locally
      products.value = products.value.filter(p => p.id !== id)
      notification.success('商品删除成功 (本地)')
    }
  }

  async function updateStock(productId: string, delta: number, type: StockTransactionType, note?: string) {
    try {
      await productApi.updateStock(productId, delta, type, note)
      const product = products.value.find(p => p.id === productId)
      if (product) {
        product.stock += delta
      }
      notification.success('库存更新成功')
    } catch (err) {
      // Fallback: update locally
      const product = products.value.find(p => p.id === productId)
      if (product) {
        product.stock += delta
      }
      notification.success('库存更新成功 (本地)')
    }
  }

  async function addSupplier(supplier: Omit<Supplier, 'id'>) {
    try {
      const newSupplier = await supplierApi.create(supplier)
      suppliers.value.push(newSupplier)
      notification.success('供应商添加成功')
      return newSupplier
    } catch (err) {
      // Fallback: create locally
      const newSupplier: Supplier = {
        ...supplier,
        id: `sup-${Date.now()}`,
      }
      suppliers.value.push(newSupplier)
      notification.success('供应商添加成功 (本地)')
      return newSupplier
    }
  }

  function reset() {
    products.value = [...INITIAL_PRODUCTS]
    categories.value = [...CATEGORIES]
    suppliers.value = [...MOCK_SUPPLIERS]
  }

  return {
    // State
    products,
    categories,
    suppliers,
    loading,
    errors,
    // Getters
    productsByCategory,
    availableProducts,
    lowStockProducts,
    getCategoryName,
    getSupplierName,
    // Actions
    fetchProducts,
    fetchCategories,
    fetchSuppliers,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    addSupplier,
    reset,
  }
})
