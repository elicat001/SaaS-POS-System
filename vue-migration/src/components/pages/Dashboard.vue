<template>
  <div class="space-y-4 font-sans text-slate-600 animate-in fade-in duration-300">
    <!-- Header Section -->
    <div class="bg-white p-5 rounded-sm shadow-sm">
      <h2 class="text-xl font-bold text-slate-900 mb-6">数据统计</h2>
      
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="flex bg-white flex-wrap gap-2">
            <button 
              v-for="time in timeOptions"
              :key="time"
              @click="timeRange = time"
              :class="[
                'px-3 py-1 text-sm transition-all rounded-md',
                timeRange === time
                  ? 'text-emerald-600 font-bold bg-emerald-50 shadow-sm ring-1 ring-emerald-100'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              ]"
            >
              {{ time }}
            </button>
          </div>
        </div>
        
        <div class="text-xs text-slate-400 flex items-center gap-2">
          统计时间始于00:00:00 最后更新时间: {{ currentTime }}
          <button class="hover:text-emerald-500 transition-colors" @click="refresh">
            <RotateCcw :size="14" class="cursor-pointer" />
          </button>
        </div>
      </div>
    </div>

    <!-- Top Metrics Grid -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <div v-for="metric in metrics" :key="metric.title" 
        :class="[
          'bg-white p-5 h-full rounded-sm shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow border border-transparent hover:border-emerald-100',
          metric.highlight ? 'bg-emerald-50/30 border-emerald-100' : ''
        ]">
        <div class="flex items-center gap-1 text-slate-500 text-sm mb-3">
          {{ metric.title }}
          <HelpCircle :size="13" class="text-slate-300" />
        </div>
        <div :class="[
          'text-[26px] font-medium leading-none mb-3',
          metric.isCurrency ? 'text-[#3b82f6]' : (metric.highlight ? 'text-emerald-600' : 'text-slate-800')
        ]">
          {{ metric.value }}
        </div>
        <div v-if="metric.sub" class="text-xs text-slate-400">{{ metric.sub }}</div>
      </div>
    </div>

    <!-- Placeholder for Charts -->
    <div class="bg-white p-6 rounded-sm shadow-sm">
      <div class="flex items-center justify-between mb-5">
        <h3 class="font-bold text-slate-800 text-[15px] flex items-center gap-1">
          销售趋势
        </h3>
      </div>
      <div class="h-64 flex items-center justify-center text-slate-400">
        <div class="text-center">
          <TrendingUp :size="48" class="mx-auto mb-2 text-slate-300" />
          <p>销售趋势图表将在后续版本中实现</p>
          <p class="text-sm mt-1">使用 Recharts 库进行数据可视化</p>
        </div>
      </div>
    </div>

    <!-- Middle Section Placeholder -->
    <div class="bg-white p-6 rounded-sm shadow-sm">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
        <!-- Order Revenue Detail -->
        <div class="pr-4">
          <div class="flex items-center justify-between mb-5">
            <h3 class="font-bold text-slate-800 text-[15px] flex items-center gap-1">
              订单实收 <HelpCircle :size="13" class="text-slate-300 ml-1"/>
            </h3>
          </div>
          <div class="text-[32px] font-medium text-[#3b82f6] mb-3">
            {{ formatCurrency(stats.totalRevenue) }}
          </div>
          <p class="text-xs text-slate-400 leading-relaxed mb-8">
            订单实收金额不包含用户使用余额支付和挂账支付所产生的收入
          </p>
        </div>

        <!-- Order Amount Pie Placeholder -->
        <div class="lg:pl-8">
          <div class="flex items-center justify-between mb-5">
            <h3 class="font-bold text-slate-800 text-[15px]">
              订单金额
            </h3>
          </div>
          <div class="h-32 flex items-center justify-center text-slate-400">
            饼图将在后续版本中实现
          </div>
        </div>

        <!-- Order Count Pie Placeholder -->
        <div class="lg:pl-8">
          <div class="flex items-center justify-between mb-5">
            <h3 class="font-bold text-slate-800 text-[15px]">
              订单数量
            </h3>
          </div>
          <div class="h-32 flex items-center justify-center text-slate-400">
            饼图将在后续版本中实现
          </div>
        </div>

        <!-- Payment Share Pie Placeholder -->
        <div class="lg:pl-8">
          <div class="flex items-center justify-between mb-5">
            <h3 class="font-bold text-slate-800 text-[15px]">
              订单支付占比
            </h3>
          </div>
          <div class="h-32 flex items-center justify-center text-slate-400">
            饼图将在后续版本中实现
          </div>
        </div>
      </div>
    </div>

    <!-- Product Sales Ranking Placeholder -->
    <div class="bg-white p-6 rounded-sm shadow-sm">
      <div class="flex items-center justify-between mb-5">
        <h3 class="font-bold text-slate-800 text-[15px] flex items-center gap-1">
          商品销售排行
        </h3>
      </div>
      <div class="h-80 flex items-center justify-center text-slate-400">
        <div class="text-center">
          <p>商品销售排行图表将在后续版本中实现</p>
          <p class="text-sm mt-1">使用 Recharts 库进行数据可视化</p>
        </div>
      </div>
    </div>

    <!-- Bottom Section Placeholder -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <div class="lg:col-span-3 bg-white p-6 rounded-sm shadow-sm">
        <div class="mb-8">
          <div class="flex items-center justify-between mb-5">
            <h3 class="font-bold text-slate-800 text-[15px] flex items-center gap-1">
              收款实收合计 <HelpCircle :size="13" class="text-slate-300 ml-1"/>
            </h3>
          </div>
          <div class="text-[32px] font-medium text-[#3b82f6]">0</div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-sm shadow-sm flex flex-col">
        <div class="flex items-center justify-between mb-5">
          <h3 class="font-bold text-slate-800 text-[15px]">
            营业收款明细
          </h3>
        </div>
        <div class="flex-1 flex items-center justify-center text-slate-400">
          饼图将在后续版本中实现
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RotateCcw, HelpCircle, TrendingUp } from 'lucide-vue-next'
import type { Order } from '@/types'

interface Props {
  orders?: Order[]
}

const props = withDefaults(defineProps<Props>(), {
  orders: () => []
})

// State
const timeRange = ref('今天')
const currentTime = ref('')

const timeOptions = ['今天', '昨天', '本周', '本月', '上个月', '自定义']

// Computed stats
const stats = computed(() => {
  const orders = props.orders
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0)
  const totalCost = orders.reduce((acc, o) => acc + (o.totalCost || 0), 0)
  const grossProfit = totalRevenue - totalCost
  const count = orders.length
  const avg = count > 0 ? totalRevenue / count : 0
  return { totalRevenue, totalCost, grossProfit, count, avg }
})

// Metrics for display
const metrics = computed(() => [
  {
    title: '营业实收',
    value: formatCurrency(stats.value.totalRevenue),
    sub: '营业实收=订单实收+收款实收',
    isCurrency: true,
    highlight: false
  },
  {
    title: '营业毛利',
    value: formatCurrency(stats.value.grossProfit),
    sub: '营业毛利=营业实收-商品成本',
    isCurrency: false,
    highlight: true
  },
  {
    title: '访问量',
    value: '3',
    sub: undefined,
    isCurrency: false,
    highlight: false
  },
  {
    title: '支付顾客数',
    value: stats.value.count.toString(),
    sub: undefined,
    isCurrency: false,
    highlight: false
  },
  {
    title: '人均',
    value: formatCurrency(stats.value.avg),
    sub: undefined,
    isCurrency: false,
    highlight: false
  },
  {
    title: '翻台率',
    value: '0%',
    sub: undefined,
    isCurrency: false,
    highlight: false
  }
])

// Methods
const formatCurrency = (value: number) => {
  return value.toFixed(2)
}

const refresh = () => {
  window.location.reload()
}

// Update current time
const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString()
}

// Lifecycle
onMounted(() => {
  updateTime()
  const timer = setInterval(updateTime, 1000)
  onUnmounted(() => clearInterval(timer))
})
</script>

<style scoped>
.animate-in {
  animation: animate-in 0.3s ease-out;
}

.fade-in {
  animation: fade-in 0.3s ease-out;
}

@keyframes animate-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>