<script setup lang="ts">
import { ref } from 'vue'
import { Printer, Save, Plus, Trash2 } from 'lucide-vue-next'
import { Button, Input, Modal } from '@/components/ui'
import { useNotificationStore } from '@/stores/notification'

const notification = useNotificationStore()
const showModal = ref(false)

const printers = ref([
  { id: '1', name: '前台打印机', type: '小票打印机', ip: '192.168.1.100', status: 'online' },
  { id: '2', name: '后厨打印机', type: '小票打印机', ip: '192.168.1.101', status: 'offline' },
])

const form = ref({ name: '', type: '小票打印机', ip: '' })

function addPrinter() {
  if (!form.value.name || !form.value.ip) {
    notification.error('请填写完整信息')
    return
  }
  printers.value.push({
    id: Date.now().toString(),
    ...form.value,
    status: 'online'
  })
  showModal.value = false
  notification.success('打印机添加成功')
}

function deletePrinter(id: string) {
  printers.value = printers.value.filter(p => p.id !== id)
  notification.success('打印机已删除')
}

function testPrint(printer: any) {
  notification.info(`正在测试打印机: ${printer.name}`)
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold text-gray-800">打印设置</h1>
      <Button variant="primary" @click="showModal = true"><Plus class="w-4 h-4" />添加打印机</Button>
    </div>
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-gray-100 rounded-lg"><Printer class="w-6 h-6 text-gray-600" /></div>
        <div><h2 class="font-bold text-gray-800">打印机列表</h2><p class="text-sm text-gray-500">管理已连接的打印机</p></div>
      </div>
      <div class="space-y-3">
        <div v-for="printer in printers" :key="printer.id" class="flex items-center justify-between p-4 border rounded-lg">
          <div class="flex items-center gap-4">
            <Printer class="w-8 h-8 text-gray-400" />
            <div>
              <p class="font-medium">{{ printer.name }}</p>
              <p class="text-sm text-gray-500">{{ printer.type }} · {{ printer.ip }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span :class="['px-2 py-1 text-xs rounded-full', printer.status === 'online' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']">{{ printer.status === 'online' ? '在线' : '离线' }}</span>
            <Button variant="outline" size="sm" @click="testPrint(printer)">测试打印</Button>
            <button @click="deletePrinter(printer.id)" class="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 class="w-4 h-4" /></button>
          </div>
        </div>
        <div v-if="printers.length === 0" class="py-8 text-center text-gray-400">暂无打印机，点击添加</div>
      </div>
    </div>
    <Modal v-model="showModal" title="添加打印机">
      <div class="space-y-4">
        <Input v-model="form.name" label="打印机名称" placeholder="如: 前台打印机" />
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">打印机类型</label>
          <select v-model="form.type" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option>小票打印机</option>
            <option>标签打印机</option>
          </select>
        </div>
        <Input v-model="form.ip" label="IP地址" placeholder="192.168.1.100" />
      </div>
      <template #footer><div class="flex gap-3"><Button variant="outline" @click="showModal = false">取消</Button><Button variant="primary" @click="addPrinter">添加</Button></div></template>
    </Modal>
  </div>
</template>
