<template>
  <div class="flex h-[calc(100vh-6rem)] bg-slate-50 gap-4 -m-6 p-4">
    
    <!-- LEFT PANEL - Order Configuration & Cart -->
    <div class="w-[360px] bg-white flex flex-col shadow-sm rounded-lg overflow-hidden border border-slate-200">
      
      <div class="p-4 pb-2">
        <button class="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded font-medium text-sm transition-colors mb-4">
          选择用户
        </button>
        
        <div class="flex border rounded overflow-hidden border-emerald-500 text-xs font-medium mb-4">
          <button 
            :class="['flex-1 py-1.5', activeTab === 'DINE_IN' ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-slate-600']"
            @click="activeTab = 'DINE_IN'"
          >
            堂食
          </button>
          <button 
            :class="['flex-1 py-1.5 border-l border-emerald-200', activeTab === 'SELF_PICKUP' ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-slate-600']"
            @click="activeTab = 'SELF_PICKUP'"
          >
            自取
          </button>
          <button 
            :class="['flex-1 py-1.5 border-l border-emerald-200', activeTab === 'DELIVERY' ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-slate-600']"
            @click="activeTab = 'DELIVERY'"
          >
            配送
          </button>
        </div>

        <div class="flex gap-2 mb-2">
          <input 
            type="text" 
            placeholder="桌台号/取餐号" 
            class="flex-1 border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
            v-model="tableInput"
          />
          <button 
            @click="clearCart"
            class="px-4 text-sm text-slate-600 hover:text-red-500"
          >
            清空
          </button>
        </div>
      </div>

      <!-- Cart List -->
      <div class="flex-1 overflow-y-auto border-t border-slate-100 bg-[#f8fafc]">
        <div v-if="cart.length === 0" class="h-full flex flex-col items-center justify-center text-slate-400">
          <ShoppingCart :size="40" class="mb-2 text-slate-300" />
          <span class="text-xs">点餐列表为空</span>
        </div>
        <div v-else>
          <div v-for="item in cart" :key="item.id" class="flex items-center justify-between p-3 bg-white border-b border-slate-100">
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-slate-800 truncate">{{ item.name }}</div>
              <div class="text-xs text-slate-500">¥{{ item.price }}</div>
            </div>
            <div class="flex items-center gap-3">
              <button 
                @click="updateQuantity(item.id, -1)" 
                class="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 hover:bg-slate-100"
              >-</button>
              <span class="text-sm font-medium w-4 text-center">{{ item.quantity }}</span>
              <button 
                @click="updateQuantity(item.id, 1)"
                :disabled="item.quantity >= (products.find(p => p.id === item.id)?.stock || 0)"
                :class="[
                  'w-6 h-6 rounded-full flex items-center justify-center',
                  item.quantity >= (products.find(p => p.id === item.id)?.stock || 0)
                    ? 'bg-slate-300 cursor-not-allowed'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                ]"
              >+</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Actions -->
      <div class="border-t border-slate-200 bg-white p-3">
        <div class="flex justify-between items-center mb-3 text-xs text-slate-500">
          <div class="flex items-center gap-2">
            <input type="checkbox" id="print" />
            <label for="print">打印制作单</label>
          </div>
          <div class="font-bold text-lg text-slate-800">
            共{{ totalQuantity }}件 ¥{{ cartTotal.toFixed(2) }}
          </div>
        </div>
        
        <div class="grid grid-cols-3 gap-2">
          <button @click="handlePlaceOrder" class="bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded text-xs flex flex-col items-center justify-center gap-1 h-12">
            <Wallet :size="16" />
            微信/支付宝
          </button>
          <button @click="handlePlaceOrder" class="bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded text-xs flex flex-col items-center justify-center gap-1 h-12">
            <CreditCard :size="16" />
            现金
          </button>
          <button @click="handlePlaceOrder" class="border border-slate-200 hover:bg-slate-50 text-slate-600 py-2 rounded text-xs flex flex-col items-center justify-center gap-1 h-12">
            更多支付
          </button>
        </div>
      </div>
    </div>

    <!-- RIGHT PANEL - Product Selection -->
    <div class="flex-1 bg-white flex flex-col shadow-sm rounded-lg overflow-hidden border border-slate-200">
      <!-- Top Bar -->
      <div class="h-14 border-b border-slate-200 flex items-center px-4 justify-between">
        <h2 class="font-bold text-lg text-slate-800">代客下单</h2>
        <div class="flex items-center gap-3">
          <span class="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded">先付费</span>
          <button class="p-2 hover:bg-slate-100 rounded"><Maximize2 :size="16" class="text-slate-500" /></button>
        </div>
      </div>
      
      <!-- Search Bar -->
      <div class="p-3 border-b border-slate-200 flex gap-3">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="18" />
          <input 
            type="text" 
            placeholder="搜索全部商品"
            class="w-full pl-10 pr-4 py-2 border border-slate-200 rounded bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500 transition-colors"
            v-model="searchQuery"
          />
        </div>
      </div>

      <div class="flex-1 flex overflow-hidden">
        <!-- Categories Nav (Tabs Style) -->
        <div class="w-full h-full flex flex-col">
          <div class="flex border-b border-slate-200 overflow-x-auto scrollbar-hide bg-white">
            <button
              v-for="cat in categories"
              :key="cat.id"
              @click="selectedCategory = cat.id"
              :class="[
                'px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
                selectedCategory === cat.id
                  ? 'border-emerald-500 text-emerald-600 bg-emerald-50/30'
                  : 'border-transparent text-slate-600 hover:text-emerald-500 hover:bg-slate-50'
              ]"
            >
              {{ cat.name }}
            </button>
          </div>

          <!-- Products Grid -->
          <div class="flex-1 overflow-y-auto p-4 bg-slate-50/50">
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              <div 
                v-for="product in filteredProducts"
                :key="product.id"
                @click="addToCart(product)"
                :class="[
                  'group cursor-pointer bg-white rounded-lg overflow-hidden border hover:shadow-md transition-all relative',
                  product.stock <= 0 ? 'border-slate-200 opacity-70 grayscale' : 'border-slate-200 hover:border-emerald-400'
                ]"
              >
                <!-- Image -->
                <div class="aspect-square bg-slate-200 relative">
                  <img :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
                  <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <span :class="['text-xs font-bold', product.stock <= 0 ? 'text-red-300' : 'text-white']">
                      {{ product.stock <= 0 ? '已售罄' : `剩${product.stock}${product.unit}` }}
                    </span>
                  </div>
                </div>
                
                <!-- Info -->
                <div class="p-2">
                  <h3 class="text-xs font-medium text-slate-800 line-clamp-2 h-8 mb-1">{{ product.name }}</h3>
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-slate-900">¥{{ product.price.toFixed(2) }}</span>
                  </div>
                </div>

                <!-- Hover Add -->
                <div v-if="product.stock > 0" class="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div class="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                    <span class="text-xl font-bold">+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, Maximize2, ShoppingCart, Trash2, Wallet, CreditCard } from 'lucide-vue-next'
import type { Product, CartItem, Table } from '@/types'

interface Props {
  tables: Table[]
  products: Product[]
  onPlaceOrder: (tableId: string, items: CartItem[], total: number) => void
}

const props = defineProps<Props>()

// State
const activeTab = ref<'DINE_IN' | 'SELF_PICKUP' | 'DELIVERY'>('DINE_IN')
const selectedCategory = ref<string>('c1')
const searchQuery = ref('')
const cart = ref<CartItem[]>([])
const tableInput = ref('')

// Categories (hardcoded for now, should be moved to constants)
const categories = ref([
  { id: 'c1', name: '全部', icon: 'LayoutGrid' },
  { id: 'c2', name: '店铺线下活动', icon: 'Store' },
  { id: 'c3', name: '进店福利', icon: 'Gift' },
  { id: 'c4', name: '贝果&牛角', icon: 'Croissant' },
  { id: 'c5', name: '提拉米苏', icon: 'Dessert' },
  { id: 'c6', name: '瑞士卷 (减糖)', icon: 'Swiss' },
])

// Computed
const filteredProducts = computed(() => {
  let prods = props.products
  if (selectedCategory.value && selectedCategory.value !== 'c1') {
    prods = prods.filter(p => p.categoryId === selectedCategory.value)
  }
  if (searchQuery.value) {
    prods = prods.filter(p => p.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
  }
  return prods
})

const cartTotal = computed(() => {
  return cart.value.reduce((acc, item) => acc + item.price * item.quantity, 0)
})

const totalQuantity = computed(() => {
  return cart.value.reduce((acc, item) => acc + item.quantity, 0)
})

// Methods
const addToCart = (product: Product) => {
  if (product.stock <= 0) return // Prevent adding out of stock

  const existing = cart.value.find(p => p.id === product.id)
  if (existing) {
    if (existing.quantity >= product.stock) return // Check stock limit
    cart.value = cart.value.map(p => 
      p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
    )
  } else {
    cart.value = [...cart.value, { ...product, quantity: 1 }]
  }
}

const updateQuantity = (id: string, delta: number) => {
  cart.value = cart.value
    .map(item => {
      if (item.id === id) {
        const product = props.products.find(p => p.id === id)
        const maxStock = product ? product.stock : 9999
        const newQty = item.quantity + delta
        
        if (newQty > maxStock) return item // Cap at stock
        return { ...item, quantity: Math.max(0, newQty) }
      }
      return item
    })
    .filter(item => item.quantity > 0)
}

const clearCart = () => {
  cart.value = []
  tableInput.value = ''
}

const handlePlaceOrder = () => {
  if (cart.value.length === 0) return
  props.onPlaceOrder(tableInput.value || 'Quick', cart.value, cartTotal.value)
  clearCart()
}
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>