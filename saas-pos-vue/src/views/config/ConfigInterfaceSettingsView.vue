<script setup lang="ts">
import { ref } from 'vue'
import { Palette, Save, Eye, Plus, Trash2, GripVertical } from 'lucide-vue-next'
import { Button, Modal } from '@/components/ui'
import { useNotificationStore } from '@/stores/notification'

const notification = useNotificationStore()

const activeTab = ref('home')
const showWidgetModal = ref(false)

const pages = ref([
  { id: 'home', name: '首页', widgets: [
    { id: 'w1', type: 'BANNER', name: '轮播图' },
    { id: 'w2', type: 'GRID_NAV', name: '宫格导航' },
    { id: 'w3', type: 'PRODUCT_FEED', name: '商品列表' },
  ]},
  { id: 'user', name: '用户中心', widgets: [
    { id: 'w4', type: 'MEMBER_CARD', name: '会员卡' },
  ]},
])

const widgetTypes = [
  { type: 'BANNER', name: '轮播图' },
  { type: 'GRID_NAV', name: '宫格导航' },
  { type: 'PRODUCT_FEED', name: '商品列表' },
  { type: 'NOTICE', name: '公告' },
  { type: 'SEARCH', name: '搜索框' },
  { type: 'SPACER', name: '间距' },
]

const currentPage = ref(pages.value[0])

function selectPage(page: any) {
  currentPage.value = page
  activeTab.value = page.id
}

function addWidget(type: string) {
  const widget = widgetTypes.find(w => w.type === type)
  if (widget) {
    currentPage.value.widgets.push({
      id: `w${Date.now()}`,
      type: type,
      name: widget.name,
    })
    showWidgetModal.value = false
    notification.success('组件添加成功')
  }
}

function removeWidget(widgetId: string) {
  currentPage.value.widgets = currentPage.value.widgets.filter(w => w.id !== widgetId)
  notification.success('组件已删除')
}

function save() {
  notification.success('页面配置保存成功')
}

function preview() {
  notification.info('预览功能开发中')
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold text-gray-800">界面装修</h1>
      <div class="flex gap-2">
        <Button variant="outline" @click="preview"><Eye class="w-4 h-4" />预览</Button>
        <Button variant="primary" @click="save"><Save class="w-4 h-4" />保存</Button>
      </div>
    </div>
    <div class="flex gap-4">
      <!-- Page tabs -->
      <div class="w-48 bg-white rounded-lg shadow-sm p-4">
        <h3 class="font-medium text-gray-800 mb-3">页面列表</h3>
        <div class="space-y-2">
          <button v-for="page in pages" :key="page.id" @click="selectPage(page)" :class="['w-full text-left px-3 py-2 rounded-lg transition-colors', activeTab === page.id ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-gray-50']">{{ page.name }}</button>
        </div>
      </div>
      <!-- Widget editor -->
      <div class="flex-1 bg-white rounded-lg shadow-sm p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-medium text-gray-800">{{ currentPage.name }} - 组件配置</h3>
          <Button variant="outline" size="sm" @click="showWidgetModal = true"><Plus class="w-4 h-4" />添加组件</Button>
        </div>
        <div class="space-y-2">
          <div v-for="widget in currentPage.widgets" :key="widget.id" class="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
            <GripVertical class="w-4 h-4 text-gray-400 cursor-move" />
            <div class="flex-1">
              <p class="font-medium">{{ widget.name }}</p>
              <p class="text-xs text-gray-500">{{ widget.type }}</p>
            </div>
            <button @click="removeWidget(widget.id)" class="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 class="w-4 h-4" /></button>
          </div>
          <div v-if="currentPage.widgets.length === 0" class="py-8 text-center text-gray-400">暂无组件，点击添加</div>
        </div>
      </div>
      <!-- Preview -->
      <div class="w-80 bg-gray-800 rounded-lg p-4">
        <div class="bg-white rounded-lg h-[500px] overflow-hidden">
          <div class="h-6 bg-gray-100 flex items-center justify-center text-xs text-gray-400">小程序预览</div>
          <div class="p-2 space-y-2">
            <div v-for="widget in currentPage.widgets" :key="widget.id" class="bg-gray-100 rounded p-3 text-center text-sm text-gray-500">{{ widget.name }}</div>
          </div>
        </div>
      </div>
    </div>
    <Modal v-model="showWidgetModal" title="添加组件">
      <div class="grid grid-cols-3 gap-3">
        <button v-for="type in widgetTypes" :key="type.type" @click="addWidget(type.type)" class="p-4 border rounded-lg hover:border-emerald-500 hover:bg-emerald-50 text-center">
          <Palette class="w-6 h-6 mx-auto mb-2 text-gray-400" />
          <p class="text-sm font-medium">{{ type.name }}</p>
        </button>
      </div>
    </Modal>
  </div>
</template>
