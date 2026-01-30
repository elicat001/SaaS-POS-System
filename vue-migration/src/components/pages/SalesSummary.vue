<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">销售汇总</h2>
        <p class="text-slate-500 text-sm">Sales Summary & Analytics</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          <button
            v-for="range in timeRanges"
            :key="range.id"
            @click="timeRange = range.id"
            :class="['px-4 py-1.5 rounded-md text-sm font-medium transition-all', timeRange === range.id ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50']"
          >
            {{ range.label }}
          </button>
        </div>
        <button class="flex items-center gap-1 px-4 py-2 border border-slate-200 rounded text-sm hover:bg-slate-50 text-slate-600">
          <Download :size="16" /> 导出报表
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-4 gap-4">
      <div class="bg-white p-5 rounded shadow-sm border-l-4 border-emerald-500">
        <div class="flex justify-between items-center mb-2">
          <div class="text-slate-500 text-sm">总销售额</div>
          <div class="p-2 bg-emerald-50 rounded-full text-emerald-600">
            <DollarSign :size="18" />
          </div>
        </div>
        <div class="text-2xl font-bold text-slate-800">¥42,500.00</div>
        <div class="flex items-center gap-1 text-sm mt-1">
          <TrendingUp class="text-emerald-500" :size="14" />
          <span class="text-emerald-500">+12.5%</span>
          <span class="text-slate-400 ml-1">较上周</span>
        </div>
      </div>
      
      <div class="bg-white p-5 rounded shadow-sm border-l-4 border-blue-500">
        <div class="flex justify-between items-center mb-2">
          <div class="text-slate-500 text-sm">订单总数</div>
          <div class="p-2 bg-blue-50 rounded-full text-blue-600">
            <ShoppingCart :size="18" />
          </div>
        </div>
        <div class="text-2xl font-bold text-slate-800">1,248</div>
        <div class="flex items-center gap-1 text-sm mt-1">
          <TrendingUp class="text-emerald-500" :size="14" />
          <span class="text-emerald-500">+8.3%</span>
          <span class="text-slate-400 ml-1">较上周</span>
        </div>
      </div>
      
      <div class="bg-white p-5 rounded shadow-sm border-l-4 border-orange-500">
        <div class="flex justify-between items-center mb-2">
          <div class="text-slate-500 text-sm">客单价</div>
          <div class="p-2 bg-orange-50 rounded-full text-orange-600">
            <CreditCard :size="18" />
          </div>
        </div>
        <div class="text-2xl font-bold text-slate-800">¥34.05</div>
        <div class="flex items-center gap-1 text-sm mt-1">
          <TrendingUp class="text-emerald-500" :size="14" />
          <span class="text-emerald-500">+3.9%</span>
          <span class="text-slate-400 ml-1">较上周</span>
        </div>
      </div>
      
      <div class="bg-white p-5 rounded shadow-sm border-l-4 border-purple-500">
        <div class="flex justify-between items-center mb-2">
          <div class="text-slate-500 text-sm">毛利率</div>
          <div class="p-2 bg-purple-50 rounded-full text-purple-600">
            <BarChart3 :size="18" />
          </div>
        </div>
        <div class="text-2xl font-bold text-slate-800">62.8%</div>
        <div class="flex items-center gap-1 text-sm mt-1">
          <TrendingUp class="text-emerald-500" :size="14" />
          <span class="text-emerald-500">+2.1%</span>
          <span class="text-slate-400 ml-1">较上周</span>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-2 gap-6">
      <!-- Sales Trend Chart -->
      <div class="bg-white p-6 rounded shadow-sm">
        <h3 class="font-bold text-slate-800 mb-4">销售趋势</h3>
        <div class="h-64 flex items-center justify-center text-slate-400 bg-slate-50 rounded border border-dashed border-slate-200">
          销售趋势图表 (Recharts 集成待实现)
        </div>
      </div>
      
      <!-- Payment Method Distribution -->
      <div class="bg-white p-6 rounded shadow-sm">
        <h3 class="font-bold text-slate-800 mb-4">支付方式分布</h3>
        <div class="h-64 flex items-center justify-center text-slate-400 bg-slate-50 rounded border border-dashed border-slate-200">
          支付方式饼图 (Recharts 集成待实现)
        </div>
      </div>
    </div>

    <!-- Top Products Table -->
    <div class="bg-white rounded shadow-sm">
      <div class="p-4 border-b border-slate-100 flex justify-between items-center">
        <h3 class="font-bold text-slate-800">热销商品TOP5</h3>
        <button class="flex items-center gap-1 px-4 py-2 border border-slate-200 rounded text-sm hover:bg-slate-50 text-slate-600">
          <RefreshCw :size="16" /> 刷新
        </button>
      </div>
      <table class="w-full text-left text-sm">
        <thead class="bg-slate-50 text-slate-600">
          <tr>
            <th class="p-4">排名</th>
            <th class="p-4">商品名称</th>
            <th class="p-4 text-right">销量</th>
            <th class="p-4 text-right">销售额</th>
            <th class="p-4">趋势</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="item in topItems" :key="item.rank" class="hover:bg-slate-50">
            <td class="p-4">
              <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold">
                {{ item.rank }}
              </span>
            </td>
            <td class="p-4 font-medium text-slate-800">{{ item.name }}</td>
            <td class="p-4 text-right font-mono text-slate-600">{{ item.sales.toLocaleString() }}</td>
            <td class="p-4 text-right font-mono text-slate-600">¥{{ item.revenue.toLocaleString('zh-CN', {minimumFractionDigits: 2}) }}</td>
            <td class="p-4">
              <div class="flex items-center gap-1">
                <TrendingUp v-if="item.trend === 'up'" class="text-emerald-500" :size="14" />
                <TrendingDown v-else class="text-red-500" :size="14" />
                <span :class="['text-sm', item.trend === 'up' ? 'text-emerald-500' : 'text-red-500']">
                  {{ item.trend === 'up' ? '上升' : '下降' }}
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  CreditCard,
  Download,
  RefreshCw
} from 'lucide-vue-next'

type TimeRange = '7DAYS' | '30DAYS' | '90DAYS' | 'CUSTOM'

const timeRange = ref<TimeRange>('7DAYS')

const timeRanges = [
  { id: '7DAYS' as TimeRange, label: '近7天' },
  { id: '30DAYS' as TimeRange, label: '近30天' },
  { id: '90DAYS' as TimeRange, label: '近90天' },
  { id: 'CUSTOM' as TimeRange, label: '自定义' }
]

const topItems = [
  { rank: 1, name: '巴斯克切件蛋糕', sales: 1245, revenue: 24775.5, trend: 'up' as const },
  { rank: 2, name: '冰美式(大)', sales: 980, revenue: 14700.0, trend: 'up' as const },
  { rank: 3, name: '巧克力贝果', sales: 856, revenue: 9244.8, trend: 'down' as const },
  { rank: 4, name: '抹茶瑞士卷', sales: 654, revenue: 5755.2, trend: 'up' as const },
  { rank: 5, name: '红丝绒蛋糕', sales: 432, revenue: 8596.8, trend: 'down' as const }
]
</script>