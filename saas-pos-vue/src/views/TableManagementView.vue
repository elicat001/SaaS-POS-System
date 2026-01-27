<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTableStore } from '@/stores/table'
import { useNotificationStore } from '@/stores/notification'
import { ReservationStatus, type Table, type TableStatus } from '@/types'
import { Plus, Edit2, Trash2, QrCode, Table2, Users, Calendar } from 'lucide-vue-next'
import { Modal, Button, Input } from '@/components/ui'

const tableStore = useTableStore()
const notification = useNotificationStore()

// State
const selectedArea = ref('all')
const showModal = ref(false)
const showReservationModal = ref(false)
const editingTable = ref<Table | null>(null)

// Form state
const form = ref({
  name: '',
  capacity: 4,
  area: '大厅',
  status: 'AVAILABLE' as TableStatus,
})

const reservationForm = ref({
  tableId: '',
  customerName: '',
  customerPhone: '',
  reservationTime: '',
  guests: 2,
  notes: '',
})

// Computed
const filteredTables = computed(() => {
  if (selectedArea.value === 'all') {
    return tableStore.tables
  }
  return tableStore.tablesByArea(selectedArea.value)
})

const areaOptions = computed(() => {
  return ['all', ...tableStore.areas]
})

// Methods
function getStatusStyle(status: TableStatus) {
  const styles: Record<string, string> = {
    AVAILABLE: 'bg-green-100 border-green-300 text-green-700',
    SCANNED: 'bg-yellow-100 border-yellow-300 text-yellow-700',
    UNPAID: 'bg-red-100 border-red-300 text-red-700',
    PAID: 'bg-blue-100 border-blue-300 text-blue-700',
  }
  return styles[status] || styles.AVAILABLE
}

function getStatusLabel(status: TableStatus) {
  const labels: Record<string, string> = {
    AVAILABLE: '空闲',
    SCANNED: '已扫码',
    UNPAID: '待结账',
    PAID: '已结账',
  }
  return labels[status] || status
}

function openCreateModal() {
  editingTable.value = null
  form.value = {
    name: '',
    capacity: 4,
    area: '大厅',
    status: 'AVAILABLE' as TableStatus,
  }
  showModal.value = true
}

function openEditModal(table: Table) {
  editingTable.value = table
  form.value = {
    name: table.name,
    capacity: table.capacity,
    area: table.area ?? '大厅',
    status: table.status,
  }
  showModal.value = true
}

async function saveTable() {
  if (!form.value.name) {
    notification.error('请填写桌台名称')
    return
  }

  if (editingTable.value) {
    await tableStore.updateTable({
      ...editingTable.value,
      ...form.value,
    })
  } else {
    await tableStore.createTable(form.value)
  }

  showModal.value = false
}

async function deleteTable(table: Table) {
  if (table.status !== 'AVAILABLE') {
    notification.error('只能删除空闲状态的桌台')
    return
  }
  if (confirm(`确定要删除 ${table.name}号桌 吗？`)) {
    await tableStore.deleteTable(table.id)
  }
}

function openReservationModal(table: Table) {
  reservationForm.value = {
    tableId: table.id,
    customerName: '',
    customerPhone: '',
    reservationTime: '',
    guests: 2,
    notes: '',
  }
  showReservationModal.value = true
}

async function createReservation() {
  if (!reservationForm.value.customerName || !reservationForm.value.customerPhone || !reservationForm.value.reservationTime) {
    notification.error('请填写完整的预订信息')
    return
  }

  await tableStore.addReservation({
    ...reservationForm.value,
    status: ReservationStatus.CONFIRMED,
  })

  showReservationModal.value = false
}

function clearTable(table: Table) {
  if (confirm('确定要清台吗？')) {
    tableStore.updateTableStatus(table.id, 'AVAILABLE')
  }
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold text-gray-800">桌台管理</h1>
      <Button variant="primary" @click="openCreateModal">
        <Plus class="w-4 h-4" />
        新增桌台
      </Button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-4 gap-4">
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="text-sm text-gray-500 mb-1">总桌台</div>
        <div class="text-2xl font-bold text-gray-800">{{ tableStore.tables.length }}</div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="text-sm text-gray-500 mb-1">空闲桌台</div>
        <div class="text-2xl font-bold text-green-600">{{ tableStore.availableTables.length }}</div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="text-sm text-gray-500 mb-1">使用中</div>
        <div class="text-2xl font-bold text-red-600">{{ tableStore.occupiedTables.length }}</div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="text-sm text-gray-500 mb-1">今日预订</div>
        <div class="text-2xl font-bold text-blue-600">{{ tableStore.todayReservations.length }}</div>
      </div>
    </div>

    <!-- Area tabs -->
    <div class="bg-white rounded-lg shadow-sm p-4">
      <div class="flex gap-2">
        <button
          v-for="area in areaOptions"
          :key="area"
          @click="selectedArea = area"
          :class="[
            'px-4 py-2 text-sm rounded-lg transition-colors',
            selectedArea === area
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          {{ area === 'all' ? '全部' : area }}
        </button>
      </div>
    </div>

    <!-- Tables grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <div
        v-for="table in filteredTables"
        :key="table.id"
        :class="[
          'p-4 rounded-lg border-2 transition-all hover:shadow-md',
          getStatusStyle(table.status)
        ]"
      >
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-bold">{{ table.name }}号桌</h3>
          <span class="text-xs">{{ table.area }}</span>
        </div>

        <div class="flex items-center gap-2 text-sm mb-3">
          <Users class="w-4 h-4" />
          <span>{{ table.capacity }}人</span>
        </div>

        <div class="text-sm font-medium mb-3">
          {{ getStatusLabel(table.status) }}
        </div>

        <div class="flex gap-1">
          <button
            @click="openEditModal(table)"
            class="p-1.5 bg-white/50 hover:bg-white rounded"
            title="编辑"
          >
            <Edit2 class="w-4 h-4" />
          </button>
          <button
            @click="openReservationModal(table)"
            class="p-1.5 bg-white/50 hover:bg-white rounded"
            title="预订"
          >
            <Calendar class="w-4 h-4" />
          </button>
          <button
            v-if="table.status !== 'AVAILABLE'"
            @click="clearTable(table)"
            class="p-1.5 bg-white/50 hover:bg-white rounded"
            title="清台"
          >
            <Table2 class="w-4 h-4" />
          </button>
          <button
            @click="deleteTable(table)"
            class="p-1.5 bg-white/50 hover:bg-white rounded text-red-600"
            title="删除"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Today's Reservations -->
    <div class="bg-white rounded-lg shadow-sm p-4">
      <h3 class="font-bold text-gray-800 mb-4">今日预订</h3>
      <div v-if="tableStore.todayReservations.length === 0" class="text-center text-gray-400 py-8">
        暂无预订
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="reservation in tableStore.todayReservations"
          :key="reservation.id"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div>
            <p class="font-medium">{{ reservation.customerName }}</p>
            <p class="text-sm text-gray-500">
              {{ tableStore.getTableName(reservation.tableId) }}号桌 · {{ reservation.guests }}人
            </p>
          </div>
          <div class="text-right">
            <p class="text-blue-600 font-medium">
              {{ new Date(reservation.reservationTime).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) }}
            </p>
            <p class="text-xs text-gray-400">{{ reservation.customerPhone }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Table Modal -->
    <Modal v-model="showModal" :title="editingTable ? '编辑桌台' : '新增桌台'">
      <div class="space-y-4">
        <Input v-model="form.name" label="桌台名称" placeholder="如: 1, 2, A1" />
        <Input v-model="form.capacity" type="number" label="容纳人数" placeholder="4" />
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">所属区域</label>
          <select
            v-model="form.area"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="大厅">大厅</option>
            <option value="包厢">包厢</option>
            <option value="露台">露台</option>
          </select>
        </div>
      </div>

      <template #footer>
        <div class="flex gap-3">
          <Button variant="outline" @click="showModal = false">取消</Button>
          <Button variant="primary" @click="saveTable">保存</Button>
        </div>
      </template>
    </Modal>

    <!-- Reservation Modal -->
    <Modal v-model="showReservationModal" title="新建预订">
      <div class="space-y-4">
        <Input v-model="reservationForm.customerName" label="客户姓名" placeholder="请输入客户姓名" />
        <Input v-model="reservationForm.customerPhone" label="联系电话" placeholder="请输入联系电话" />
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">预订时间</label>
          <input
            v-model="reservationForm.reservationTime"
            type="datetime-local"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Input v-model="reservationForm.guests" type="number" label="用餐人数" placeholder="2" />
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">备注</label>
          <textarea
            v-model="reservationForm.notes"
            rows="2"
            placeholder="如: 需要宝宝椅"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
      </div>

      <template #footer>
        <div class="flex gap-3">
          <Button variant="outline" @click="showReservationModal = false">取消</Button>
          <Button variant="primary" @click="createReservation">确认预订</Button>
        </div>
      </template>
    </Modal>
  </div>
</template>
