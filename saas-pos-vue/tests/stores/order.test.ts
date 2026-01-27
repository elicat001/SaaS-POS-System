import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useOrderStore } from '@/stores/order'
import { useProductStore } from '@/stores/product'
import { useTableStore } from '@/stores/table'
import { MOCK_ORDERS } from '@/constants'

describe('Order Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with mock orders', () => {
    const store = useOrderStore()
    expect(store.orders.length).toBe(MOCK_ORDERS.length)
  })

  it('should get pending orders', () => {
    const store = useOrderStore()
    const pending = store.pendingOrders
    expect(pending.every(o => o.status === 'PENDING')).toBe(true)
  })

  it('should get completed orders', () => {
    const store = useOrderStore()
    const completed = store.completedOrders
    expect(completed.every(o => o.status === 'COMPLETED')).toBe(true)
  })

  it('should calculate today revenue', () => {
    const store = useOrderStore()
    const revenue = store.todayRevenue
    expect(typeof revenue).toBe('number')
    expect(revenue).toBeGreaterThanOrEqual(0)
  })

  it('should get orders by table', () => {
    const store = useOrderStore()
    const orders = store.getOrdersByTable('t2')
    expect(orders.every(o => o.tableId === 't2')).toBe(true)
  })

  it('should create a new order', async () => {
    const orderStore = useOrderStore()
    const productStore = useProductStore()
    const tableStore = useTableStore()

    const initialCount = orderStore.orders.length
    const product = productStore.products[0]
    const cartItems = [{ ...product, quantity: 2 }]

    await orderStore.createOrder('t1', cartItems, product.price * 2, 'DINE_IN')

    expect(orderStore.orders.length).toBe(initialCount + 1)
  })

  it('should update order status', async () => {
    const store = useOrderStore()
    const order = store.orders.find(o => o.status === 'PENDING')

    if (order) {
      await store.updateOrderStatus(order.id, 'COMPLETED')
      expect(store.orders.find(o => o.id === order.id)?.status).toBe('COMPLETED')
    }
  })

  it('should cancel an order', async () => {
    const store = useOrderStore()
    const order = store.orders.find(o => o.status === 'PENDING')

    if (order) {
      await store.cancelOrder(order.id)
      expect(store.orders.find(o => o.id === order.id)?.status).toBe('CANCELLED')
    }
  })

  it('should reset to initial state', () => {
    const store = useOrderStore()
    store.orders = []

    store.reset()

    expect(store.orders.length).toBe(MOCK_ORDERS.length)
  })
})
