<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-slate-900">商品管理</h2>
      <div class="flex gap-3">
        <button class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-sm font-medium flex items-center gap-2">
          <Plus :size="16" />
          新增商品
        </button>
        <button class="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-sm font-medium flex items-center gap-2">
          <Download :size="16" />
          导出
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
      <div class="flex flex-col md:flex-row gap-4">
        <!-- Search -->
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="18" />
          <input 
            type="text" 
            placeholder="搜索商品名称"
            class="w-full pl-10 pr-4 py-2 border border-slate-200 rounded bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500 transition-colors"
            v-model="searchTerm"
          />
        </div>
        
        <!-- Tabs -->
        <div class="flex border rounded overflow-hidden border-slate-300 text-sm font-medium">
          <button 
            v-for="tab in tabs"
            :key="tab"
            @click="activeTab = tab"
            :class="[
              'px-4 py-2',
              activeTab === tab 
                ? 'bg-emerald-100 text-emerald-600 border-r border-emerald-200' 
                : 'bg-white text-slate-600 hover:bg-slate-50'
            ]"
          >
            {{ tab }}
          </button>
        </div>
      </div>
    </div>

    <!-- Products Table -->
    <div class="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="text-left py-3 px-4 text-sm font-medium text-slate-600">商品信息</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-slate-600">分类</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-slate-600">售价</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-slate-600">成本</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-slate-600">库存</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-slate-600">状态</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-slate-600">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in filteredProducts" :key="product.id" class="border-b border-slate-100 hover:bg-slate-50">
              <td class="py-3 px-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-slate-200 rounded overflow-hidden">
                    <img :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div class="font-medium text-slate-800">{{ product.name }}</div>
                    <div class="text-xs text-slate-500">{{ product.id }}</div>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4">
                <span class="text-sm text-slate-600">{{ getCategoryName(product.categoryId) }}</span>
              </td>
              <td class="py-3 px-4">
                <div class="font-medium text-slate-800">¥{{ product.price.toFixed(2) }}</div>
              </td>
              <td class="py-3 px-4">
                <div class="text-sm text-slate-600">
                  {{ product.costPrice ? `¥${product.costPrice.toFixed(2)}` : '未设置' }}
                </div>
              </td>
              <td class="py-3 px-4">
                <div class="flex items-center gap-2">
                  <span :class="[
                    'text-sm font-medium',
                    product.stock <= (product.minStock || 0) ? 'text-red-600' : 'text-slate-800'
                  ]">
                    {{ product.stock }}{{ product.unit }}
                  </span>
                  <span v-if="product.minStock" class="text-xs text-slate-500">
                    (最低: {{ product.minStock }})
                  </span>
                </div>
              </td>
              <td class="py-3 px-4">
                <span :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  product.isOnShelf 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-slate-100 text-slate-700'
                ]">
                  {{ product.isOnShelf ? '在售' : '下架' }}
                </span>
              </td>
              <td class="py-3 px-4">
                <div class="flex items-center gap-2">
                  <button class="p-1 hover:bg-slate-100 rounded text-slate-600" title="编辑">
                    <Edit :size="16" />
                  </button>
                  <button class="p-1 hover:bg-slate-100 rounded text-slate-600" title="删除">
                    <Trash2 :size="16" />
                  </button>
                  <button class="p-1 hover:bg-slate-100 rounded text-slate-600" title="更多">
                    <MoreHorizontal :size="16" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="filteredProducts.length === 0" class="py-12 text-center text-slate-400">
        <Search :size="48" class="mx-auto mb-3 text-slate-300" />
        <p>没有找到匹配的商品</p>
        <p class="text-sm mt-1">尝试调整搜索条件或添加新商品</p>
      </div>

      <!-- Pagination -->
      <div class="px-4 py-3 border-t border-slate-200 flex items-center justify-between">
        <div class="text-sm text-slate-600">
          共 {{ filteredProducts.length }} 个商品
        </div>
        <div class="flex items-center gap-2">
          <button class="px-3 py-1 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50">
            上一页
          </button>
          <span class="px-3 py-1 bg-emerald-500 text-white rounded text-sm">1</span>
          <button class="px-3 py-1 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50">
            下一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, Plus, Download, Edit, Trash2, MoreHorizontal } from 'lucide-vue-next'
import type { Product } from '@/types'

interface Props {
  products: Product[]
  onUpdateProduct?: (product: Product) => void
}

const props = withDefaults(defineProps<Props>(), {
  products: () => [],
  onUpdateProduct: () => {}
})

// State
const activeTab = ref('在售商品')
const searchTerm = ref('')

const tabs = ['在售商品', '已售罄商品', '全部商品']

// Categories (hardcoded for now)
const categories = [
  { id: 'c1', name: '全部' },
  { id: 'c2', name: '店铺线下活动' },
  { id: 'c3', name: '进店福利' },
  { id: 'c4', name: '贝果&牛角' },
  { id: 'c5', name: '提拉米苏' },
  { id: 'c6', name: '瑞士卷 (减糖)' },
]

// Computed
const filteredProducts = computed(() => {
  let result = props.products
  
  // Search filter
  if (searchTerm.value) {
    result = result.filter(p => 
      p.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  }
  
  // Tab filter
  switch (activeTab.value) {
    case '在售商品':
      result = result.filter(p => p.isOnShelf && p.stock > 0)
      break
    case '已售罄商品':
      result = result.filter(p => p.stock <= 0)
      break
    // '全部商品' shows all
  }
  
  return result
})

// Methods
const getCategoryName = (categoryId: string) => {
  const category = categories.find(c => c.id === categoryId)
  return category ? category.name : '未分类'
}
</script>