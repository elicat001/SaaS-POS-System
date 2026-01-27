import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProductStore } from '@/stores/product'
import { INITIAL_PRODUCTS, CATEGORIES } from '@/constants'

describe('Product Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with mock data', () => {
    const store = useProductStore()

    expect(store.products.length).toBe(INITIAL_PRODUCTS.length)
    expect(store.categories.length).toBe(CATEGORIES.length)
  })

  it('should filter products by category', () => {
    const store = useProductStore()

    const allProducts = store.productsByCategory('c1')
    expect(allProducts.length).toBe(INITIAL_PRODUCTS.length)

    const categoryProducts = store.productsByCategory('c3')
    expect(categoryProducts.every(p => p.categoryId === 'c3')).toBe(true)
  })

  it('should get available products', () => {
    const store = useProductStore()

    const available = store.availableProducts
    expect(available.every(p => p.isOnShelf && p.stock > 0)).toBe(true)
  })

  it('should get low stock products', () => {
    const store = useProductStore()

    const lowStock = store.lowStockProducts
    expect(lowStock.every(p => p.minStock && p.stock <= p.minStock)).toBe(true)
  })

  it('should get category name by id', () => {
    const store = useProductStore()

    expect(store.getCategoryName('c1')).toBe('全部')
    expect(store.getCategoryName('c3')).toBe('进店福利')
  })

  it('should create a new product locally', async () => {
    const store = useProductStore()
    const initialCount = store.products.length

    await store.createProduct({
      name: 'Test Product',
      price: 10,
      costPrice: 5,
      categoryId: 'c2',
      stock: 100,
      unit: '份',
      isOnShelf: true,
    })

    expect(store.products.length).toBe(initialCount + 1)
    expect(store.products.find(p => p.name === 'Test Product')).toBeDefined()
  })

  it('should update a product', async () => {
    const store = useProductStore()
    const product = store.products[0]
    const newName = 'Updated Product Name'

    await store.updateProduct({ ...product, name: newName })

    expect(store.products.find(p => p.id === product.id)?.name).toBe(newName)
  })

  it('should delete a product', async () => {
    const store = useProductStore()
    const product = store.products[0]
    const initialCount = store.products.length

    await store.deleteProduct(product.id)

    expect(store.products.length).toBe(initialCount - 1)
    expect(store.products.find(p => p.id === product.id)).toBeUndefined()
  })

  it('should reset to initial state', () => {
    const store = useProductStore()
    store.products = []

    store.reset()

    expect(store.products.length).toBe(INITIAL_PRODUCTS.length)
  })
})
