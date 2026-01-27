<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProductStore } from '@/stores/product'
import { useNotificationStore } from '@/stores/notification'
import type { Product } from '@/types'
import { Plus, Search, Edit2, Trash2, Package } from 'lucide-vue-next'
import { Modal, Button, Input } from '@/components/ui'

const productStore = useProductStore()
const notification = useNotificationStore()

// State
const searchQuery = ref('')
const selectedCategory = ref('c1')
const showModal = ref(false)
const editingProduct = ref<Product | null>(null)

// Form state
const form = ref({
  name: '',
  price: 0,
  costPrice: 0,
  categoryId: 'c2',
  stock: 0,
  minStock: 10,
  unit: '份',
  isOnShelf: true,
  image: '',
  supplierId: '',
})

// Computed
const filteredProducts = computed(() => {
  let products = selectedCategory.value === 'c1'
    ? productStore.products
    : productStore.productsByCategory(selectedCategory.value)

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    products = products.filter(p => p.name.toLowerCase().includes(query))
  }

  return products
})

// Methods
function openCreateModal() {
  editingProduct.value = null
  form.value = {
    name: '',
    price: 0,
    costPrice: 0,
    categoryId: 'c2',
    stock: 0,
    minStock: 10,
    unit: '份',
    isOnShelf: true,
    image: '',
    supplierId: '',
  }
  showModal.value = true
}

function openEditModal(product: Product) {
  editingProduct.value = product
  form.value = {
    name: product.name,
    price: product.price,
    costPrice: product.costPrice ?? 0,
    categoryId: product.categoryId,
    stock: product.stock,
    minStock: product.minStock ?? 10,
    unit: product.unit,
    isOnShelf: product.isOnShelf,
    image: product.image ?? '',
    supplierId: product.supplierId ?? '',
  }
  showModal.value = true
}

async function saveProduct() {
  if (!form.value.name || form.value.price <= 0) {
    notification.error('请填写完整的商品信息')
    return
  }

  if (editingProduct.value) {
    await productStore.updateProduct({
      ...editingProduct.value,
      ...form.value,
    })
  } else {
    await productStore.createProduct(form.value)
  }

  showModal.value = false
}

async function deleteProduct(product: Product) {
  if (confirm(`确定要删除商品 "${product.name}" 吗？`)) {
    await productStore.deleteProduct(product.id)
  }
}

function toggleShelf(product: Product) {
  productStore.updateProduct({
    ...product,
    isOnShelf: !product.isOnShelf,
  })
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold text-gray-800">商品管理</h1>
      <Button variant="primary" @click="openCreateModal">
        <Plus class="w-4 h-4" />
        新增商品
      </Button>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg shadow-sm">
      <div class="flex flex-wrap gap-4">
        <!-- Search -->
        <div class="relative flex-1 min-w-[200px]">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索商品名称..."
            class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <!-- Category filter -->
        <select
          v-model="selectedCategory"
          class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option
            v-for="category in productStore.categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Product table -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">商品</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">分类</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">售价</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">成本</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">库存</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="product in filteredProducts" :key="product.id" class="hover:bg-gray-50">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <img
                  :src="product.image || 'https://via.placeholder.com/50'"
                  :alt="product.name"
                  class="w-10 h-10 rounded object-cover"
                />
                <div>
                  <p class="font-medium text-gray-800">{{ product.name }}</p>
                  <p class="text-xs text-gray-400">{{ product.unit }}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 text-sm text-gray-600">
              {{ productStore.getCategoryName(product.categoryId) }}
            </td>
            <td class="px-4 py-3 text-sm font-medium text-emerald-600">
              ¥{{ product.price.toFixed(2) }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-600">
              ¥{{ (product.costPrice || 0).toFixed(2) }}
            </td>
            <td class="px-4 py-3">
              <span
                :class="[
                  'text-sm',
                  product.minStock && product.stock <= product.minStock
                    ? 'text-red-600 font-medium'
                    : 'text-gray-600'
                ]"
              >
                {{ product.stock }}
              </span>
            </td>
            <td class="px-4 py-3">
              <button
                @click="toggleShelf(product)"
                :class="[
                  'px-2 py-1 text-xs rounded-full transition-colors',
                  product.isOnShelf
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                ]"
              >
                {{ product.isOnShelf ? '已上架' : '已下架' }}
              </button>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <button
                  @click="openEditModal(product)"
                  class="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                >
                  <Edit2 class="w-4 h-4" />
                </button>
                <button
                  @click="deleteProduct(product)"
                  class="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredProducts.length === 0" class="py-12 text-center text-gray-400">
        <Package class="w-12 h-12 mx-auto mb-4" />
        <p>没有找到商品</p>
      </div>
    </div>

    <!-- Product Modal -->
    <Modal v-model="showModal" :title="editingProduct ? '编辑商品' : '新增商品'" size="lg">
      <div class="grid grid-cols-2 gap-4">
        <div class="col-span-2">
          <Input v-model="form.name" label="商品名称" placeholder="请输入商品名称" />
        </div>
        <Input v-model="form.price" type="number" label="售价" placeholder="0.00" />
        <Input v-model="form.costPrice" type="number" label="成本价" placeholder="0.00" />
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">分类</label>
          <select
            v-model="form.categoryId"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option
              v-for="category in productStore.categories.filter(c => c.id !== 'c1')"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>
        <Input v-model="form.unit" label="单位" placeholder="份/个/杯" />
        <Input v-model="form.stock" type="number" label="库存" placeholder="0" />
        <Input v-model="form.minStock" type="number" label="最低库存预警" placeholder="10" />
        <div class="col-span-2">
          <Input v-model="form.image" label="图片URL" placeholder="https://..." />
        </div>
        <div class="col-span-2">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="form.isOnShelf"
              type="checkbox"
              class="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
            />
            <span class="text-sm text-gray-700">上架销售</span>
          </label>
        </div>
      </div>

      <template #footer>
        <div class="flex gap-3">
          <Button variant="outline" @click="showModal = false">取消</Button>
          <Button variant="primary" @click="saveProduct">保存</Button>
        </div>
      </template>
    </Modal>
  </div>
</template>
