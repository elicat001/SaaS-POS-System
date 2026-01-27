import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNotificationStore } from '@/stores/notification'

describe('Notification Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  it('should start with empty notifications', () => {
    const store = useNotificationStore()
    expect(store.notifications).toHaveLength(0)
  })

  it('should add a success notification', () => {
    const store = useNotificationStore()
    const id = store.success('Test message')

    expect(store.notifications).toHaveLength(1)
    expect(store.notifications[0].type).toBe('success')
    expect(store.notifications[0].message).toBe('Test message')
    expect(store.notifications[0].id).toBe(id)
  })

  it('should add notifications of different types', () => {
    const store = useNotificationStore()

    store.success('Success')
    store.error('Error')
    store.warning('Warning')
    store.info('Info')

    expect(store.notifications).toHaveLength(4)
    expect(store.notifications.map(n => n.type)).toEqual(['success', 'error', 'warning', 'info'])
  })

  it('should remove notification by id', () => {
    const store = useNotificationStore()
    const id = store.success('Test')

    expect(store.notifications).toHaveLength(1)
    store.removeNotification(id)
    expect(store.notifications).toHaveLength(0)
  })

  it('should clear all notifications', () => {
    const store = useNotificationStore()
    store.success('One')
    store.success('Two')
    store.success('Three')

    expect(store.notifications).toHaveLength(3)
    store.clearAll()
    expect(store.notifications).toHaveLength(0)
  })

  it('should limit to max 5 notifications', () => {
    const store = useNotificationStore()

    for (let i = 0; i < 7; i++) {
      store.success(`Message ${i}`)
    }

    expect(store.notifications).toHaveLength(5)
  })

  it('should auto-remove notifications after duration', () => {
    const store = useNotificationStore()
    store.success({ message: 'Test', duration: 1000 })

    expect(store.notifications).toHaveLength(1)

    vi.advanceTimersByTime(1100)
    expect(store.notifications).toHaveLength(0)
  })
})
