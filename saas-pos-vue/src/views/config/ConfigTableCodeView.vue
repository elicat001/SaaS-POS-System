<script setup lang="ts">
import { ref, computed } from 'vue'
import { QrCode, Download, Printer } from 'lucide-vue-next'
import { useTableStore } from '@/stores/table'
import { Button } from '@/components/ui'
import { useNotificationStore } from '@/stores/notification'

const tableStore = useTableStore()
const notification = useNotificationStore()

const selectedTables = ref<string[]>([])

const selectAll = computed({
  get: () => selectedTables.value.length === tableStore.tables.length,
  set: (val) => {
    selectedTables.value = val ? tableStore.tables.map(t => t.id) : []
  }
})

function toggleTable(id: string) {
  const index = selectedTables.value.indexOf(id)
  if (index > -1) {
    selectedTables.value.splice(index, 1)
  } else {
    selectedTables.value.push(id)
  }
}

function downloadQR() {
  if (selectedTables.value.length === 0) {
    notification.error('请选择要下载的桌码')
    return
  }
  notification.success(`正在下载 ${selectedTables.value.length} 个桌码...`)
}

function printQR() {
  if (selectedTables.value.length === 0) {
    notification.error('请选择要打印的桌码')
    return
  }
  notification.info(`正在打印 ${selectedTables.value.length} 个桌码...`)
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold text-gray-800">桌码设置</h1>
      <div class="flex gap-2">
        <Button variant="outline" @click="downloadQR"><Download class="w-4 h-4" />下载桌码</Button>
        <Button variant="primary" @click="printQR"><Printer class="w-4 h-4" />打印桌码</Button>
      </div>
    </div>
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-purple-100 rounded-lg"><QrCode class="w-6 h-6 text-purple-600" /></div>
        <div><h2 class="font-bold text-gray-800">桌台二维码</h2><p class="text-sm text-gray-500">选择桌台生成或下载二维码</p></div>
      </div>
      <div class="mb-4">
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" v-model="selectAll" class="w-4 h-4 text-blue-600 rounded" />
          <span class="text-sm">全选</span>
        </label>
      </div>
      <div class="grid grid-cols-5 gap-4">
        <div v-for="table in tableStore.tables" :key="table.id" @click="toggleTable(table.id)" :class="['cursor-pointer border-2 rounded-lg p-4 text-center transition-all', selectedTables.includes(table.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300']">
          <div class="w-20 h-20 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-2">
            <QrCode class="w-12 h-12 text-gray-400" />
          </div>
          <p class="font-medium">{{ table.name }}号桌</p>
          <p class="text-xs text-gray-500">{{ table.area }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
