<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProductStore } from '@/stores/product'
import { useInventoryStore } from '@/stores/inventory'
import { useNotificationStore } from '@/stores/notification'
import { useAuthStore } from '@/stores/auth'
import { StockTransactionType } from '@/types'
import { Package, TrendingUp, TrendingDown, AlertTriangle, Plus, Search } from 'lucide-vue-next'
import { Modal, Button, Input } from '@/components/ui'

const productStore = useProductStore()
const inventoryStore = useInventoryStore()
const notification = useNotificationStore()
const authStore = useAuthStore()

// State
const searchQuery = ref('')
const activeTab = ref<'stock' | 'logs'>('stock')
const showAdjustModal = ref(false)
const selectedProduct = ref<any>(null)
const adjustType = ref<'in' | 'out' | 'adjust'>('in')
const adjustQuantity = ref(0)
const adjustNote = ref('')

// Computed
const filteredProducts = computed(() => {
  if (!searchQuery.value) return productStore.products
  const query = searchQuery.value.toLowerCase()
  return productStore.products.filter(p => p.name.toLowerCase().includes(query))
})

const lowStockProducts = computed(() => productStore.lowStockProducts)

// Methods
function openAdjustModal(product: any, type: 'in' | 'out' | 'adjust') {
  selectedProduct.value = product
  adjustType.value = type
  adjustQuantity.value = type === 'adjust' ? product.stock : 0
  adjustNote.value = ''
  showAdjustModal.value = true
}

async function submitAdjustment() {
  if (!selectedProduct.value) return
  if (adjustQuantity.value <= 0 && adjustType.value !== 'adjust') {
    notification.error('请输入有效数量')
    return
  }

  const operator = authStore.user?.name || '系统'

  if (adjustType.value === 'in') {
    await inventoryStore.recordPurchase(
      selectedProduct.value.id,
      adjustQuantity.value,
      operator,
      adjustNote.value
    )
  } else if (adjustType.value === 'out') {
    await inventoryStore.recordLoss(
      selectedProduct.value.id,
      adjustQuantity.value,
      operator,
      adjustNote.value
    )
  } else {
    await inventoryStore.adjustStock(
      selectedProduct.value.id,
      adjustQuantity.value,
      operator,
      adjustNote.value
    )
  }

  showAdjustModal.value = false
}

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleString('zh-CN')
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold text-gray-800">库存管理</h1>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-4 gap-4">
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-emerald-100 rounded-lg">
            <Package class="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <div class="text-sm text-gray-500">商品种类</div>
            <div class="text-2xl font-bold text-gray-800">{{ productStore.products.length }}</div>
          </div>
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-green-100 rounded-lg">
            <TrendingUp class="w-6 h-6 text-green-600" />
          </div>
          <div>
            <div class="text-sm text-gray-500">库存总值</div>
            <div class="text-2xl font-bold text-green-600">¥{{ inventoryStore.totalStockValue.toFixed(2) }}</div>
          </div>
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-purple-100 rounded-lg">
            <TrendingDown class="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <div class="text-sm text-gray-500">库存成本</div>
            <div class="text-2xl font-bold text-purple-600">¥{{ inventoryStore.totalStockCost.toFixed(2) }}</div>
          </div>
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-red-100 rounded-lg">
            <AlertTriangle class="w-6 h-6 text-red-600" />
          </div>
          <div>
            <div class="text-sm text-gray-500">库存预警</div>
            <div class="text-2xl font-bold text-red-600">{{ lowStockProducts.length }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Low stock warning -->
    <div v-if="lowStockProducts.length > 0" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <h3 class="font-medium text-red-800 mb-2 flex items-center gap-2">
        <AlertTriangle class="w-4 h-4" />
        库存预警商品
      </h3>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="product in lowStockProducts"
          :key="product.id"
          class="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full"
        >
          {{ product.name }} ({{ product.stock }}/{{ product.minStock }})
        </span>
      </div>
    </div>

    <!-- Tabs -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="flex border-b">
        <button
          @click="activeTab = 'stock'"
          :class="[
            'px-6 py-3 text-sm font-medium border-b-2 transition-colors',
            activeTab === 'stock'
              ? 'border-emerald-500 text-emerald-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          ]"
        >
          库存列表
        </button>
        <button
          @click="activeTab = 'logs'"
          :class="[
            'px-6 py-3 text-sm font-medium border-b-2 transition-colors',
            activeTab === 'logs'
              ? 'border-emerald-500 text-emerald-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          ]"
        >
          出入库记录
        </button>
      </div>

      <!-- Search -->
      <div class="p-4 border-b">
        <div class="relative max-w-md">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索商品..."
            class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <!-- Stock list -->
      <div v-if="activeTab === 'stock'">
        <table class="w-full">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">商品</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">分类</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">当前库存</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">预警线</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">单位</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="product in filteredProducts" :key="product.id" class="hover:bg-gray-50">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <img
                    :src="product.image || 'https://via.placeholder.com/40'"
                    class="w-10 h-10 rounded object-cover"
                  />
                  <span class="font-medium text-gray-800">{{ product.name }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-gray-600">
                {{ productStore.getCategoryName(product.categoryId) }}
              </td>
              <td class="px-4 py-3">
                <span
                  :class="[
                    'font-medium',
                    product.minStock && product.stock <= product.minStock
                      ? 'text-red-600'
                      : 'text-gray-800'
                  ]"
                >
                  {{ product.stock }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ product.minStock || '-' }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ product.unit }}</td>
              <td class="px-4 py-3">
                <div class="flex gap-2">
                  <button
                    @click="openAdjustModal(product, 'in')"
                    class="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                  >
                    入库
                  </button>
                  <button
                    @click="openAdjustModal(product, 'out')"
                    class="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    出库
                  </button>
                  <button
                    @click="openAdjustModal(product, 'adjust')"
                    class="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200"
                  >
                    盘点
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Logs list -->
      <div v-if="activeTab === 'logs'">
        <table class="w-full">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">时间</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">商品</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">变动</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">结余</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作员</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">备注</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="log in inventoryStore.recentLogs" :key="log.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-sm text-gray-500">{{ formatTime(log.timestamp) }}</td>
              <td class="px-4 py-3 text-sm font-medium text-gray-800">{{ log.productName }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ log.type }}</td>
              <td class="px-4 py-3">
                <span :class="log.delta > 0 ? 'text-green-600' : 'text-red-600'">
                  {{ log.delta > 0 ? '+' : '' }}{{ log.delta }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ log.currentStock }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ log.operator }}</td>
              <td class="px-4 py-3 text-sm text-gray-400">{{ log.note || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Adjust Modal -->
    <Modal
      v-model="showAdjustModal"
      :title="adjustType === 'in' ? '入库' : adjustType === 'out' ? '出库' : '库存盘点'"
    >
      <div v-if="selectedProduct" class="space-y-4">
        <div class="p-4 bg-gray-50 rounded-lg">
          <p class="font-medium">{{ selectedProduct.name }}</p>
          <p class="text-sm text-gray-500">当前库存: {{ selectedProduct.stock }} {{ selectedProduct.unit }}</p>
        </div>

        <Input
          v-model="adjustQuantity"
          type="number"
          :label="adjustType === 'adjust' ? '实际库存' : '数量'"
          placeholder="0"
        />

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">备注</label>
          <textarea
            v-model="adjustNote"
            rows="2"
            placeholder="可选备注信息"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          ></textarea>
        </div>
      </div>

      <template #footer>
        <div class="flex gap-3">
          <Button variant="outline" @click="showAdjustModal = false">取消</Button>
          <Button variant="primary" @click="submitAdjustment">确认</Button>
        </div>
      </template>
    </Modal>
  </div>
</template>
