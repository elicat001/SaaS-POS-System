<template>
  <div class="space-y-6">
    <!-- Module Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">进销存管理系统</h2>
        <p class="text-slate-500 text-sm">Inventory & Supply Chain Management</p>
      </div>
      <div class="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="['flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all', activeTab === tab.id ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50']"
        >
          <component :is="tab.icon" :size="16" /> {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Content Area -->
    <div class="min-h-[600px]">
      <!-- Overview Tab -->
      <div v-if="activeTab === 'OVERVIEW'" class="space-y-6 animate-in fade-in duration-300">
        <div class="grid grid-cols-4 gap-4">
          <div class="bg-white p-5 rounded shadow-sm border-l-4 border-emerald-500">
            <div class="flex justify-between items-center mb-2">
              <div class="text-slate-500 text-sm">库存总额 (成本)</div>
              <div class="p-2 bg-emerald-50 rounded-full text-emerald-600">
                <BarChart3 :size="18" />
              </div>
            </div>
            <div class="text-2xl font-bold text-slate-800">¥0.00</div>
          </div>
          <div class="bg-white p-5 rounded shadow-sm border-l-4 border-blue-500">
            <div class="flex justify-between items-center mb-2">
              <div class="text-slate-500 text-sm">商品种类</div>
              <div class="p-2 bg-blue-50 rounded-full text-blue-600">
                <Package :size="18" />
              </div>
            </div>
            <div class="text-2xl font-bold text-slate-800">0</div>
          </div>
          <div class="bg-white p-5 rounded shadow-sm border-l-4 border-orange-500">
            <div class="flex justify-between items-center mb-2">
              <div class="text-slate-500 text-sm">库存总量</div>
              <div class="p-2 bg-orange-50 rounded-full text-orange-600">
                <Package :size="18" />
              </div>
            </div>
            <div class="text-2xl font-bold text-slate-800">0</div>
          </div>
          <div class="bg-white p-5 rounded shadow-sm border-l-4 border-red-500">
            <div class="flex justify-between items-center mb-2">
              <div class="text-slate-500 text-sm">库存预警</div>
              <div class="p-2 bg-red-50 rounded-full text-red-600">
                <AlertTriangle :size="18" />
              </div>
            </div>
            <div class="text-2xl font-bold text-red-600">0 <span class="text-xs font-normal text-slate-400">件商品不足</span></div>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-6">
          <div class="col-span-2 bg-white p-6 rounded shadow-sm">
            <h3 class="font-bold text-slate-800 mb-4">近期出入库趋势</h3>
            <div class="h-64 flex items-center justify-center text-slate-400 bg-slate-50 rounded border border-dashed border-slate-200">
              图表组件占位符 (Charts Placeholder)
            </div>
          </div>
          <div class="bg-white p-6 rounded shadow-sm">
            <h3 class="font-bold text-slate-800 mb-4">需补货商品</h3>
            <div class="space-y-3">
              <div class="text-slate-500 text-sm text-center py-4">暂无库存预警商品</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Other Tabs Placeholder -->
      <div v-else class="bg-white rounded shadow-sm p-12">
        <div class="text-center">
          <div class="text-slate-400 mb-2">{{ getTabTitle(activeTab) }}页面</div>
          <div class="text-slate-300 text-sm">此功能正在开发中</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  BarChart3,
  Package,
  Truck,
  History,
  AlertTriangle
} from 'lucide-vue-next'

type TabType = 'OVERVIEW' | 'STOCK_LIST' | 'STOCK_IN' | 'LOGS' | 'SUPPLIERS'

const activeTab = ref<TabType>('OVERVIEW')

const tabs = [
  { id: 'OVERVIEW' as TabType, label: '概览', icon: BarChart3 },
  { id: 'STOCK_LIST' as TabType, label: '库存列表', icon: Package },
  { id: 'STOCK_IN' as TabType, label: '入库管理', icon: Truck },
  { id: 'LOGS' as TabType, label: '库存流水', icon: History },
  { id: 'SUPPLIERS' as TabType, label: '供应商', icon: Truck },
]

const getTabTitle = (tab: TabType): string => {
  const tabMap: Record<TabType, string> = {
    'OVERVIEW': '概览',
    'STOCK_LIST': '库存列表',
    'STOCK_IN': '入库管理',
    'LOGS': '库存流水',
    'SUPPLIERS': '供应商管理'
  }
  return tabMap[tab]
}
</script>