<script setup lang="ts">
import { ref } from 'vue'
import { useProductStore } from '@/stores/product'
import { useNotificationStore } from '@/stores/notification'
import { Plus, Edit2, Trash2, FolderTree } from 'lucide-vue-next'
import { Button, Modal, Input } from '@/components/ui'

const productStore = useProductStore()
const notification = useNotificationStore()

const showModal = ref(false)
const editingCategory = ref<any>(null)
const form = ref({ name: '', icon: '' })

function openCreateModal() {
  editingCategory.value = null
  form.value = { name: '', icon: '' }
  showModal.value = true
}

function openEditModal(category: any) {
  editingCategory.value = category
  form.value = { name: category.name, icon: category.icon || '' }
  showModal.value = true
}

function saveCategory() {
  if (!form.value.name) {
    notification.error('请输入分类名称')
    return
  }
  notification.success(editingCategory.value ? '分类更新成功' : '分类创建成功')
  showModal.value = false
}

function deleteCategory(category: any) {
  if (category.id === 'c1') {
    notification.error('不能删除默认分类')
    return
  }
  if (confirm(`确定要删除分类 "${category.name}" 吗？`)) {
    notification.success('分类删除成功')
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold text-gray-800">分类设置</h1>
      <Button variant="primary" @click="openCreateModal"><Plus class="w-4 h-4" />新增分类</Button>
    </div>
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">分类名称</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">图标</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">商品数</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="category in productStore.categories" :key="category.id" class="hover:bg-gray-50">
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <div class="p-2 bg-blue-100 rounded-lg"><FolderTree class="w-4 h-4 text-blue-600" /></div>
                <span class="font-medium">{{ category.name }}</span>
              </div>
            </td>
            <td class="px-4 py-3 text-gray-600">{{ category.icon || '-' }}</td>
            <td class="px-4 py-3">{{ category.id === 'c1' ? productStore.products.length : productStore.productsByCategory(category.id).length }}</td>
            <td class="px-4 py-3">
              <div class="flex gap-2">
                <button @click="openEditModal(category)" class="p-1 text-blue-600 hover:bg-blue-50 rounded" :disabled="category.id === 'c1'"><Edit2 class="w-4 h-4" /></button>
                <button @click="deleteCategory(category)" class="p-1 text-red-600 hover:bg-red-50 rounded" :disabled="category.id === 'c1'"><Trash2 class="w-4 h-4" /></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Modal v-model="showModal" :title="editingCategory ? '编辑分类' : '新增分类'">
      <div class="space-y-4">
        <Input v-model="form.name" label="分类名称" placeholder="请输入分类名称" />
        <Input v-model="form.icon" label="图标名称" placeholder="如: Gift, Store, Package" />
      </div>
      <template #footer><div class="flex gap-3"><Button variant="outline" @click="showModal = false">取消</Button><Button variant="primary" @click="saveCategory">保存</Button></div></template>
    </Modal>
  </div>
</template>
