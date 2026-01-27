import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { tableApi, reservationApi } from '@/services/api'
import { ReservationStatus, type Table, type Reservation, type TableStatus } from '@/types'
import { INITIAL_TABLES, MOCK_RESERVATIONS } from '@/constants'
import { useNotificationStore } from './notification'

export const useTableStore = defineStore('table', () => {
  const notification = useNotificationStore()

  // State
  const tables = ref<Table[]>([...INITIAL_TABLES])
  const reservations = ref<Reservation[]>([...MOCK_RESERVATIONS])
  const loading = ref({
    tables: false,
    reservations: false,
  })
  const errors = ref({
    tables: null as string | null,
    reservations: null as string | null,
  })

  // Getters
  const availableTables = computed(() => {
    return tables.value.filter(t => t.status === 'AVAILABLE')
  })

  const occupiedTables = computed(() => {
    return tables.value.filter(t => t.status !== 'AVAILABLE')
  })

  const tablesByArea = computed(() => {
    return (area: string) => tables.value.filter(t => t.area === area)
  })

  const areas = computed(() => {
    return [...new Set(tables.value.map(t => t.area).filter(Boolean))] as string[]
  })

  const getTableName = computed(() => {
    return (tableId: string) => {
      return tables.value.find(t => t.id === tableId)?.name || ''
    }
  })

  const todayReservations = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    return reservations.value.filter(r => {
      const resTime = new Date(r.reservationTime).getTime()
      return resTime >= today.getTime() && resTime < tomorrow.getTime()
    })
  })

  // Actions
  async function fetchTables() {
    loading.value.tables = true
    errors.value.tables = null
    try {
      const data = await tableApi.list()
      tables.value = data
    } catch (err) {
      errors.value.tables = err instanceof Error ? err.message : '获取桌台失败'
      // Keep mock data on error
    } finally {
      loading.value.tables = false
    }
  }

  async function fetchReservations(params?: { date?: string; status?: string }) {
    loading.value.reservations = true
    errors.value.reservations = null
    try {
      const data = await reservationApi.list(params)
      reservations.value = data
    } catch (err) {
      errors.value.reservations = err instanceof Error ? err.message : '获取预订失败'
      // Keep mock data on error
    } finally {
      loading.value.reservations = false
    }
  }

  async function createTable(data: Omit<Table, 'id'>) {
    try {
      const newTable = await tableApi.create(data)
      tables.value.push(newTable)
      notification.success('桌台创建成功')
      return newTable
    } catch (err) {
      // Fallback: create locally
      const newTable: Table = {
        ...data,
        id: `t${Date.now()}`,
      }
      tables.value.push(newTable)
      notification.success('桌台创建成功 (本地)')
      return newTable
    }
  }

  async function updateTable(table: Table) {
    try {
      const updated = await tableApi.update(table.id, table)
      const index = tables.value.findIndex(t => t.id === table.id)
      if (index > -1) {
        tables.value[index] = updated
      }
      notification.success('桌台更新成功')
      return updated
    } catch (err) {
      const index = tables.value.findIndex(t => t.id === table.id)
      if (index > -1) {
        tables.value[index] = table
      }
      notification.success('桌台更新成功 (本地)')
      return table
    }
  }

  async function deleteTable(id: string) {
    try {
      await tableApi.delete(id)
      tables.value = tables.value.filter(t => t.id !== id)
      notification.success('桌台删除成功')
    } catch (err) {
      tables.value = tables.value.filter(t => t.id !== id)
      notification.success('桌台删除成功 (本地)')
    }
  }

  async function updateTableStatus(tableId: string, status: TableStatus | string, orderId?: string) {
    try {
      await tableApi.updateStatus(tableId, status)
      const table = tables.value.find(t => t.id === tableId)
      if (table) {
        table.status = status as TableStatus
        if (orderId !== undefined) {
          table.currentOrderId = orderId
        }
        if (status === 'AVAILABLE' || status === 'PAID') {
          table.currentOrderId = undefined
        }
      }
    } catch (err) {
      // Fallback: update locally
      const table = tables.value.find(t => t.id === tableId)
      if (table) {
        table.status = status as TableStatus
        if (orderId !== undefined) {
          table.currentOrderId = orderId
        }
        if (status === 'AVAILABLE' || status === 'PAID') {
          table.currentOrderId = undefined
        }
      }
    }
  }

  async function addReservation(reservation: Omit<Reservation, 'id'>) {
    try {
      const newReservation = await reservationApi.create(reservation)
      reservations.value.push(newReservation)
      notification.success('预订创建成功')
      return newReservation
    } catch (err) {
      // Fallback: create locally
      const newReservation: Reservation = {
        ...reservation,
        id: `res-${Date.now()}`,
      }
      reservations.value.push(newReservation)
      notification.success('预订创建成功 (本地)')
      return newReservation
    }
  }

  async function cancelReservation(id: string) {
    try {
      await reservationApi.cancel(id)
      const reservation = reservations.value.find(r => r.id === id)
      if (reservation) {
        reservation.status = ReservationStatus.CANCELLED
      }
      notification.success('预订已取消')
    } catch (err) {
      const reservation = reservations.value.find(r => r.id === id)
      if (reservation) {
        reservation.status = ReservationStatus.CANCELLED
      }
      notification.success('预订已取消 (本地)')
    }
  }

  function reset() {
    tables.value = [...INITIAL_TABLES]
    reservations.value = [...MOCK_RESERVATIONS]
  }

  return {
    // State
    tables,
    reservations,
    loading,
    errors,
    // Getters
    availableTables,
    occupiedTables,
    tablesByArea,
    areas,
    getTableName,
    todayReservations,
    // Actions
    fetchTables,
    fetchReservations,
    createTable,
    updateTable,
    deleteTable,
    updateTableStatus,
    addReservation,
    cancelReservation,
    reset,
  }
})
