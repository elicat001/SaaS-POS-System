<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProductStore } from '@/stores/product'
import { useOrderStore } from '@/stores/order'
import { useTableStore } from '@/stores/table'
import { useNotificationStore } from '@/stores/notification'
import type { CartItem, Product } from '@/types'
import { ShoppingCart, Plus, Minus, Trash2, CreditCard, Search } from 'lucide-vue-next'
import { Modal, Button } from '@/components/ui'

const productStore = useProductStore()
const orderStore = useOrderStore()
const tableStore = useTableStore()
const notification = useNotificationStore()

// State
const selectedCategory = ref('c1')
const cart = ref<CartItem[]>([])
const searchQuery = ref('')
const selectedTable = ref('')
const orderType = ref<'DINE_IN' | 'DELIVERY' | 'PICKUP'>('DINE_IN')
const showPaymentModal = ref(false)
const paymentMethod = ref('微信支付')

// Computed
const filteredProducts = computed(() => {
  let products = productStore.productsByCategory(selectedCategory.value)
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    products = products.filter(p =>
      p.name.toLowerCase().includes(query) && p.isOnShelf
    )
  }
  return products.filter(p => p.isOnShelf)
})

const cartTotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const cartItemCount = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.quantity, 0)
})

// Methods
function addToCart(product: Product) {
  if (product.stock <= 0) {
    notification.error('商品库存不足')
    return
  }

  const existingItem = cart.value.find(item => item.id === product.id)
  if (existingItem) {
    if (existingItem.quantity >= product.stock) {
      notification.error('库存不足')
      return
    }
    existingItem.quantity++
  } else {
    cart.value.push({ ...product, quantity: 1 })
  }
}

function updateQuantity(item: CartItem, delta: number) {
  const product = productStore.products.find(p => p.id === item.id)
  if (!product) return

  const newQuantity = item.quantity + delta
  if (newQuantity <= 0) {
    removeFromCart(item.id)
  } else if (newQuantity > product.stock) {
    notification.error('库存不足')
  } else {
    item.quantity = newQuantity
  }
}

function removeFromCart(productId: string) {
  cart.value = cart.value.filter(item => item.id !== productId)
}

function clearCart() {
  cart.value = []
}

function openPaymentModal() {
  if (cart.value.length === 0) {
    notification.error('购物车为空')
    return
  }
  if (orderType.value === 'DINE_IN' && !selectedTable.value) {
    notification.error('请选择桌台')
    return
  }
  showPaymentModal.value = true
}

async function submitOrder() {
  try {
    await orderStore.createOrder(
      selectedTable.value,
      cart.value,
      cartTotal.value,
      orderType.value
    )
    clearCart()
    showPaymentModal.value = false
    selectedTable.value = ''
  } catch (err) {
    notification.error('下单失败')
  }
}
</script>

<template>
  <div class="flex h-[calc(100vh-8rem)] gap-4">
    <!-- Left: Product selection -->
    <div class="flex-1 flex flex-col bg-white rounded-lg shadow-sm overflow-hidden">
      <!-- Category tabs -->
      <div class="flex border-b overflow-x-auto">
        <button
          v-for="category in productStore.categories"
          :key="category.id"
          @click="selectedCategory = category.id"
          :class="[
            'px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
            selectedCategory === category.id
              ? 'border-emerald-500 text-emerald-600 bg-emerald-50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          ]"
        >
          {{ category.name }}
        </button>
      </div>

      <!-- Search -->
      <div class="p-4 border-b">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索商品..."
            class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <!-- Product grid -->
      <div class="flex-1 overflow-y-auto p-4">
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            @click="addToCart(product)"
            :class="[
              'cursor-pointer rounded-lg border p-3 transition-all hover:shadow-md',
              product.stock <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:border-emerald-300'
            ]"
          >
            <img
              :src="product.image || 'https://via.placeholder.com/200'"
              :alt="product.name"
              class="w-full h-24 object-cover rounded-md mb-2"
            />
            <h3 class="text-sm font-medium text-gray-800 truncate">{{ product.name }}</h3>
            <div class="flex justify-between items-center mt-2">
              <span class="text-emerald-600 font-bold">¥{{ product.price.toFixed(2) }}</span>
              <span class="text-xs text-gray-400">库存: {{ product.stock }}</span>
            </div>
          </div>
        </div>

        <div v-if="filteredProducts.length === 0" class="flex flex-col items-center justify-center py-16 text-gray-400">
          <ShoppingCart class="w-12 h-12 mb-4" />
          <p>没有找到商品</p>
        </div>
      </div>
    </div>

    <!-- Right: Cart -->
    <div class="w-80 flex flex-col bg-white rounded-lg shadow-sm overflow-hidden">
      <!-- Cart header -->
      <div class="p-4 border-b">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-bold text-gray-800">购物车</h2>
          <button
            v-if="cart.length > 0"
            @click="clearCart"
            class="text-sm text-red-500 hover:text-red-600"
          >
            清空
          </button>
        </div>

        <!-- Order type selection -->
        <div class="flex gap-2 mb-4">
          <button
            v-for="type in [
              { value: 'DINE_IN', label: '堂食' },
              { value: 'DELIVERY', label: '外卖' },
              { value: 'PICKUP', label: '自取' },
            ]"
            :key="type.value"
            @click="orderType = type.value as any"
            :class="[
              'flex-1 py-2 text-sm rounded-lg transition-colors',
              orderType === type.value
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            {{ type.label }}
          </button>
        </div>

        <!-- Table selection (for dine-in) -->
        <div v-if="orderType === 'DINE_IN'">
          <select
            v-model="selectedTable"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">选择桌台</option>
            <option
              v-for="table in tableStore.availableTables"
              :key="table.id"
              :value="table.id"
            >
              {{ table.name }}号桌 ({{ table.area }})
            </option>
          </select>
        </div>
      </div>

      <!-- Cart items -->
      <div class="flex-1 overflow-y-auto p-4">
        <div v-if="cart.length === 0" class="flex flex-col items-center justify-center h-full text-gray-400">
          <ShoppingCart class="w-12 h-12 mb-2" />
          <p class="text-sm">购物车是空的</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="item in cart"
            :key="item.id"
            class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
          >
            <img
              :src="item.image || 'https://via.placeholder.com/50'"
              :alt="item.name"
              class="w-12 h-12 object-cover rounded"
            />
            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-medium truncate">{{ item.name }}</h4>
              <p class="text-emerald-600 text-sm">¥{{ item.price.toFixed(2) }}</p>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="updateQuantity(item, -1)"
                class="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
              >
                <Minus class="w-4 h-4" />
              </button>
              <span class="w-8 text-center">{{ item.quantity }}</span>
              <button
                @click="updateQuantity(item, 1)"
                class="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
              >
                <Plus class="w-4 h-4" />
              </button>
              <button
                @click="removeFromCart(item.id)"
                class="p-1 rounded-full text-red-500 hover:bg-red-50"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Cart footer -->
      <div class="border-t p-4">
        <div class="flex justify-between items-center mb-4">
          <span class="text-gray-600">合计 ({{ cartItemCount }} 件)</span>
          <span class="text-xl font-bold text-emerald-600">¥{{ cartTotal.toFixed(2) }}</span>
        </div>
        <Button
          variant="primary"
          block
          @click="openPaymentModal"
          :disabled="cart.length === 0"
        >
          <CreditCard class="w-4 h-4" />
          结算
        </Button>
      </div>
    </div>

    <!-- Payment Modal -->
    <Modal v-model="showPaymentModal" title="确认订单">
      <div class="space-y-4">
        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="flex justify-between mb-2">
            <span class="text-gray-600">订单类型</span>
            <span class="font-medium">
              {{ orderType === 'DINE_IN' ? '堂食' : orderType === 'DELIVERY' ? '外卖' : '自取' }}
            </span>
          </div>
          <div v-if="orderType === 'DINE_IN'" class="flex justify-between mb-2">
            <span class="text-gray-600">桌台</span>
            <span class="font-medium">{{ tableStore.getTableName(selectedTable) }}号桌</span>
          </div>
          <div class="flex justify-between mb-2">
            <span class="text-gray-600">商品数量</span>
            <span class="font-medium">{{ cartItemCount }} 件</span>
          </div>
          <div class="flex justify-between text-lg">
            <span class="text-gray-800 font-medium">应付金额</span>
            <span class="text-emerald-600 font-bold">¥{{ cartTotal.toFixed(2) }}</span>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">支付方式</label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="method in ['微信支付', '支付宝', '现金', '会员余额']"
              :key="method"
              @click="paymentMethod = method"
              :class="[
                'p-3 text-sm rounded-lg border transition-colors',
                paymentMethod === method
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 hover:border-gray-300'
              ]"
            >
              {{ method }}
            </button>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex gap-3">
          <Button variant="outline" @click="showPaymentModal = false">取消</Button>
          <Button variant="primary" @click="submitOrder">确认支付</Button>
        </div>
      </template>
    </Modal>
  </div>
</template>
