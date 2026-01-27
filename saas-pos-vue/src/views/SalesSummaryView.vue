<script setup lang="ts">
import { ref, computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { useOrderStore } from '@/stores/order'
import { TrendingUp, DollarSign, ShoppingBag, Users } from 'lucide-vue-next'

use([CanvasRenderer, LineChart, BarChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent])

const orderStore = useOrderStore()

const dateRange = ref('week')
const dateRangeOptions = [
  { value: 'today', label: '今日' },
  { value: 'week', label: '本周' },
  { value: 'month', label: '本月' },
]

// Mock data for charts
const salesData = computed(() => {
  const days = dateRange.value === 'today' ? 24 : dateRange.value === 'week' ? 7 : 30
  const data = []
  for (let i = 0; i < days; i++) {
    const label = dateRange.value === 'today' ? `${i}:00` : dateRange.value === 'week'
      ? ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][i]
      : `${i + 1}日`
    data.push({
      date: label,
      revenue: Math.random() * 1000 + 500,
      profit: Math.random() * 300 + 100,
      orders: Math.floor(Math.random() * 20 + 5),
    })
  }
  return data
})

const revenueChartOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['营业额', '利润'] },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', data: salesData.value.map(d => d.date) },
  yAxis: { type: 'value' },
  series: [
    {
      name: '营业额',
      type: 'line',
      data: salesData.value.map(d => d.revenue.toFixed(2)),
      smooth: true,
      itemStyle: { color: '#3b82f6' },
      areaStyle: { color: 'rgba(59, 130, 246, 0.1)' }
    },
    {
      name: '利润',
      type: 'line',
      data: salesData.value.map(d => d.profit.toFixed(2)),
      smooth: true,
      itemStyle: { color: '#10b981' },
      areaStyle: { color: 'rgba(16, 185, 129, 0.1)' }
    }
  ]
}))

const ordersChartOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', data: salesData.value.map(d => d.date) },
  yAxis: { type: 'value' },
  series: [{
    name: '订单数',
    type: 'bar',
    data: salesData.value.map(d => d.orders),
    itemStyle: { color: '#8b5cf6' }
  }]
}))

const totalRevenue = computed(() => salesData.value.reduce((sum, d) => sum + d.revenue, 0))
const totalProfit = computed(() => salesData.value.reduce((sum, d) => sum + d.profit, 0))
const totalOrders = computed(() => salesData.value.reduce((sum, d) => sum + d.orders, 0))
const avgOrderValue = computed(() => totalOrders.value > 0 ? totalRevenue.value / totalOrders.value : 0)
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold text-gray-800">销售汇总</h1>
      <div class="flex gap-2">
        <button
          v-for="option in dateRangeOptions"
          :key="option.value"
          @click="dateRange = option.value"
          :class="[
            'px-4 py-2 text-sm rounded-lg transition-colors',
            dateRange === option.value
              ? 'bg-emerald-500 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          ]"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-4 gap-4">
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-emerald-100 rounded-lg">
            <DollarSign class="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <div class="text-sm text-gray-500">营业额</div>
            <div class="text-2xl font-bold text-emerald-600">¥{{ totalRevenue.toFixed(2) }}</div>
          </div>
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-green-100 rounded-lg">
            <TrendingUp class="w-6 h-6 text-green-600" />
          </div>
          <div>
            <div class="text-sm text-gray-500">利润</div>
            <div class="text-2xl font-bold text-green-600">¥{{ totalProfit.toFixed(2) }}</div>
          </div>
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-purple-100 rounded-lg">
            <ShoppingBag class="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <div class="text-sm text-gray-500">订单数</div>
            <div class="text-2xl font-bold text-purple-600">{{ totalOrders }}</div>
          </div>
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-orange-100 rounded-lg">
            <Users class="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <div class="text-sm text-gray-500">客单价</div>
            <div class="text-2xl font-bold text-orange-600">¥{{ avgOrderValue.toFixed(2) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Revenue chart -->
    <div class="bg-white p-6 rounded-lg shadow-sm">
      <h3 class="font-bold text-gray-800 mb-4">营业额趋势</h3>
      <div class="h-80">
        <v-chart class="w-full h-full" :option="revenueChartOption" autoresize />
      </div>
    </div>

    <!-- Orders chart -->
    <div class="bg-white p-6 rounded-lg shadow-sm">
      <h3 class="font-bold text-gray-800 mb-4">订单数量</h3>
      <div class="h-64">
        <v-chart class="w-full h-full" :option="ordersChartOption" autoresize />
      </div>
    </div>
  </div>
</template>
