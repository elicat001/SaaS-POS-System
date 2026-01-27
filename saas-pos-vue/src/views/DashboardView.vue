<script setup lang="ts">
import { ref, computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, PieChart, BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'
import { RotateCcw, HelpCircle } from 'lucide-vue-next'
import { useOrderStore } from '@/stores/order'

// Register ECharts components
use([
  CanvasRenderer,
  LineChart,
  PieChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
])

const orderStore = useOrderStore()

const timeRange = ref('今天')
const timeRanges = ['今天', '昨天', '本周', '本月', '上个月', '自定义']

// Calculate stats
const stats = computed(() => {
  const orders = orderStore.orders
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0)
  const totalCost = orders.reduce((acc, o) => acc + (o.totalCost || 0), 0)
  const grossProfit = totalRevenue - totalCost
  const count = orders.length
  const avg = count > 0 ? totalRevenue / count : 0
  return { totalRevenue, totalCost, grossProfit, count, avg }
})

// Sales trend data
const salesTrendData = computed(() => {
  const now = Date.now()
  const data = []
  for (let i = 23; i >= 0; i--) {
    const hour = new Date(now - i * 3600000).getHours()
    const sales = Math.random() * 50
    data.push({
      time: `${hour}:00`,
      sales: parseFloat(sales.toFixed(2))
    })
  }
  return data
})

// Product sales data
const productSalesData = computed(() => {
  const productMap = new Map<string, { name: string; sales: number; quantity: number }>()

  orderStore.orders.forEach(order => {
    order.items.forEach(item => {
      if (productMap.has(item.id)) {
        const existing = productMap.get(item.id)!
        existing.sales += item.price * item.quantity
        existing.quantity += item.quantity
      } else {
        productMap.set(item.id, {
          name: item.name,
          sales: item.price * item.quantity,
          quantity: item.quantity
        })
      }
    })
  })

  return Array.from(productMap.values())
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 10)
})

// Chart options
const salesTrendOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: salesTrendData.value.map(d => d.time),
    axisLine: { lineStyle: { color: '#94a3b8' } },
  },
  yAxis: {
    type: 'value',
    axisLine: { lineStyle: { color: '#94a3b8' } },
  },
  series: [{
    data: salesTrendData.value.map(d => d.sales),
    type: 'line',
    smooth: true,
    lineStyle: { color: '#3b82f6', width: 2 },
    itemStyle: { color: '#3b82f6' },
    areaStyle: {
      color: {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
          { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
        ]
      }
    }
  }]
}))

const orderTypePieOption = computed(() => ({
  tooltip: { trigger: 'item' },
  series: [{
    type: 'pie',
    radius: ['50%', '70%'],
    center: ['50%', '50%'],
    data: [
      { value: stats.value.count || 10, name: '堂食', itemStyle: { color: '#fbbf24' } },
      { value: 0, name: '配送', itemStyle: { color: '#34d399' } },
      { value: 0, name: '自取', itemStyle: { color: '#60a5fa' } },
      { value: 0, name: '快递', itemStyle: { color: '#a78bfa' } },
    ],
    label: { show: false },
  }]
}))

const paymentPieOption = computed(() => ({
  tooltip: { trigger: 'item' },
  series: [{
    type: 'pie',
    radius: ['50%', '70%'],
    center: ['50%', '50%'],
    data: [
      { value: 15, name: '美团团购', itemStyle: { color: '#f87171' } },
      { value: 20, name: '抖音团购', itemStyle: { color: '#fb923c' } },
      { value: 10, name: '挂账支付', itemStyle: { color: '#fbbf24' } },
      { value: 25, name: '线下支付', itemStyle: { color: '#facc15' } },
      { value: 30, name: '支付宝支付', itemStyle: { color: '#60a5fa' } },
    ],
    label: { show: false },
  }]
}))

const productBarOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' }
  },
  legend: { data: ['销售额', '销量'] },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: { type: 'value' },
  yAxis: {
    type: 'category',
    data: productSalesData.value.map(d => d.name),
    axisLabel: {
      width: 100,
      overflow: 'truncate'
    }
  },
  series: [
    {
      name: '销售额',
      type: 'bar',
      data: productSalesData.value.map(d => d.sales.toFixed(2)),
      itemStyle: { color: '#3b82f6' }
    },
    {
      name: '销量',
      type: 'bar',
      data: productSalesData.value.map(d => d.quantity),
      itemStyle: { color: '#34d399' }
    }
  ]
}))

const collectionPieOption = computed(() => ({
  tooltip: { trigger: 'item' },
  series: [{
    type: 'pie',
    radius: ['45%', '70%'],
    center: ['50%', '50%'],
    data: [
      { value: 45, name: '微信支付', itemStyle: { color: '#34d399' } },
      { value: 35, name: '支付宝支付', itemStyle: { color: '#60a5fa' } },
      { value: 10, name: '余额支付', itemStyle: { color: '#a78bfa' } },
      { value: 5, name: '线下支付', itemStyle: { color: '#fbbf24' } },
      { value: 5, name: '后台充值', itemStyle: { color: '#f87171' } },
    ],
    label: { show: false },
  }]
}))

function refresh() {
  window.location.reload()
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header Section -->
    <div class="bg-white p-5 rounded shadow-sm">
      <h2 class="text-xl font-bold text-gray-900 mb-6">数据统计</h2>

      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="t in timeRanges"
            :key="t"
            @click="timeRange = t"
            :class="[
              'px-3 py-1 text-sm transition-all rounded-md',
              timeRange === t
                ? 'text-emerald-600 font-bold bg-emerald-50 shadow-sm ring-1 ring-emerald-100'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
            ]"
          >
            {{ t }}
          </button>
        </div>

        <div class="text-xs text-gray-400 flex items-center gap-2">
          统计时间始于00:00:00 最后更新时间: {{ new Date().toLocaleTimeString() }}
          <button @click="refresh" class="hover:text-emerald-500 transition-colors">
            <RotateCcw class="w-4 h-4 cursor-pointer" />
          </button>
        </div>
      </div>
    </div>

    <!-- Top Metrics Grid -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <div class="bg-white p-5 rounded shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center gap-1 text-gray-500 text-sm mb-3">
          营业实收 <HelpCircle class="w-3 h-3 text-gray-300" />
        </div>
        <div class="text-2xl font-medium text-emerald-500 mb-3">
          {{ stats.totalRevenue.toFixed(2) }}
        </div>
        <div class="text-xs text-gray-400">营业实收=订单实收+收款实收</div>
      </div>

      <div class="bg-emerald-50/30 p-5 rounded shadow-sm hover:shadow-md transition-shadow border border-emerald-100">
        <div class="flex items-center gap-1 text-gray-500 text-sm mb-3">
          营业毛利 <HelpCircle class="w-3 h-3 text-gray-300" />
        </div>
        <div class="text-2xl font-medium text-emerald-600 mb-3">
          {{ stats.grossProfit.toFixed(2) }}
        </div>
        <div class="text-xs text-gray-400">营业毛利=营业实收-商品成本</div>
      </div>

      <div class="bg-white p-5 rounded shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center gap-1 text-gray-500 text-sm mb-3">访问量</div>
        <div class="text-2xl font-medium text-gray-800 mb-3">3</div>
      </div>

      <div class="bg-white p-5 rounded shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center gap-1 text-gray-500 text-sm mb-3">支付顾客数</div>
        <div class="text-2xl font-medium text-gray-800 mb-3">{{ stats.count }}</div>
      </div>

      <div class="bg-white p-5 rounded shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center gap-1 text-gray-500 text-sm mb-3">人均</div>
        <div class="text-2xl font-medium text-gray-800 mb-3">{{ stats.avg.toFixed(2) }}</div>
      </div>

      <div class="bg-white p-5 rounded shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center gap-1 text-gray-500 text-sm mb-3">翻台率</div>
        <div class="text-2xl font-medium text-gray-800 mb-3">0%</div>
      </div>
    </div>

    <!-- Sales Trend Chart -->
    <div class="bg-white p-6 rounded shadow-sm">
      <h3 class="font-bold text-gray-800 text-sm mb-5">销售趋势</h3>
      <div class="h-64">
        <v-chart class="w-full h-full" :option="salesTrendOption" autoresize />
      </div>
    </div>

    <!-- Middle Section: Orders -->
    <div class="bg-white p-6 rounded shadow-sm">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
        <!-- Col 1: Order Revenue Detail -->
        <div class="lg:pr-4">
          <h3 class="font-bold text-gray-800 text-sm mb-5 flex items-center gap-1">
            订单实收 <HelpCircle class="w-3 h-3 text-gray-300" />
          </h3>
          <div class="text-3xl font-medium text-emerald-500 mb-3">
            {{ stats.totalRevenue.toFixed(2) }}
          </div>
          <p class="text-xs text-gray-400 leading-relaxed mb-8">
            订单实收金额不包含用户使用余额支付和挂账支付所产生的收入
          </p>

          <div class="flex justify-between items-end border-t border-gray-50 pt-4">
            <div>
              <div class="text-xs text-gray-500 mb-1">商品总成本</div>
              <div class="font-bold text-gray-800 text-lg">{{ stats.totalCost.toFixed(2) }}</div>
            </div>
            <div class="text-right">
              <div class="text-xs text-gray-500 mb-1">退款</div>
              <div class="font-bold text-gray-800 text-lg">0.00</div>
            </div>
          </div>
        </div>

        <!-- Col 2: Order Amount Pie -->
        <div class="lg:pl-8 pt-8 lg:pt-0">
          <h3 class="font-bold text-gray-800 text-sm mb-5">订单金额</h3>
          <div class="flex justify-between text-xs text-gray-500 mb-4">
            <div class="flex gap-4">
              <div class="flex flex-col"><span>堂食</span><span class="font-bold text-gray-700">0.00</span></div>
              <div class="flex flex-col"><span>配送</span><span class="font-bold text-gray-700">0.00</span></div>
            </div>
            <div class="flex gap-4 text-right">
              <div class="flex flex-col"><span>自取</span><span class="font-bold text-gray-700">0.00</span></div>
              <div class="flex flex-col"><span>快递</span><span class="font-bold text-gray-700">0.00</span></div>
            </div>
          </div>
          <div class="h-32">
            <v-chart class="w-full h-full" :option="orderTypePieOption" autoresize />
          </div>
        </div>

        <!-- Col 3: Order Count Pie -->
        <div class="lg:pl-8 pt-8 lg:pt-0">
          <h3 class="font-bold text-gray-800 text-sm mb-5">订单数量</h3>
          <div class="flex justify-between text-xs text-gray-500 mb-4">
            <div class="flex gap-4">
              <div class="flex flex-col"><span>堂食</span><span class="font-bold text-gray-700">{{ stats.count }}</span></div>
              <div class="flex flex-col"><span>配送</span><span class="font-bold text-gray-700">0</span></div>
            </div>
            <div class="flex gap-4 text-right">
              <div class="flex flex-col"><span>自取</span><span class="font-bold text-gray-700">0</span></div>
              <div class="flex flex-col"><span>快递</span><span class="font-bold text-gray-700">0</span></div>
            </div>
          </div>
          <div class="h-32">
            <v-chart class="w-full h-full" :option="orderTypePieOption" autoresize />
          </div>
        </div>

        <!-- Col 4: Payment Share Pie -->
        <div class="lg:pl-8 pt-8 lg:pt-0">
          <h3 class="font-bold text-gray-800 text-sm mb-5">订单支付占比</h3>
          <div class="h-32 mt-10">
            <v-chart class="w-full h-full" :option="paymentPieOption" autoresize />
          </div>
        </div>
      </div>
    </div>

    <!-- Product Sales Ranking -->
    <div class="bg-white p-6 rounded shadow-sm">
      <h3 class="font-bold text-gray-800 text-sm mb-5">商品销售排行</h3>
      <div class="h-80">
        <v-chart class="w-full h-full" :option="productBarOption" autoresize />
      </div>
    </div>

    <!-- Bottom Section: Collection -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <!-- Left: Collection Grid -->
      <div class="lg:col-span-3 bg-white p-6 rounded shadow-sm">
        <div class="mb-8">
          <h3 class="font-bold text-gray-800 text-sm mb-5 flex items-center gap-1">
            收款实收合计 <HelpCircle class="w-3 h-3 text-gray-300" />
          </h3>
          <div class="text-3xl font-medium text-emerald-500">0</div>
        </div>

        <div class="grid grid-cols-3 gap-x-12 gap-y-8">
          <div
            v-for="item in [
              { label: '收银', val: '0', unit: '笔' },
              { label: '挂账还款', val: '0', unit: '笔' },
              { label: '拼团', val: '0', unit: '笔' },
              { label: '余额充值', val: '0', unit: '笔', amount: '0' },
              { label: '礼品卡', val: '0', unit: '笔', amount: '0' },
              { label: '会员开通', val: '0', unit: '笔', amount: '0' },
            ]"
            :key="item.label"
            class="flex justify-between items-start p-4 bg-gray-50/50 rounded border border-gray-100"
          >
            <div class="flex flex-col gap-1">
              <span class="text-sm text-gray-500">{{ item.label }}</span>
              <span class="text-lg font-bold text-gray-800">{{ item.amount || item.val }}</span>
            </div>
            <span class="text-sm font-medium text-gray-600">{{ item.amount ? '0 笔' : '' }}</span>
          </div>
        </div>
      </div>

      <!-- Right: Collection Pie -->
      <div class="bg-white p-6 rounded shadow-sm flex flex-col">
        <h3 class="font-bold text-gray-800 text-sm mb-5">营业收款明细</h3>
        <div class="flex-1 flex flex-col justify-center">
          <div class="h-40">
            <v-chart class="w-full h-full" :option="collectionPieOption" autoresize />
          </div>
          <div class="space-y-2 mt-6 px-2">
            <div
              v-for="item in [
                { name: '微信支付', color: '#34d399' },
                { name: '支付宝支付', color: '#60a5fa' },
                { name: '余额支付', color: '#a78bfa' },
                { name: '线下支付', color: '#fbbf24' },
              ]"
              :key="item.name"
              class="flex items-center justify-between text-xs text-gray-500"
            >
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: item.color }"></span>
                {{ item.name }}
              </div>
            </div>
            <div class="text-right text-xs text-gray-400 mt-2">... 后台充值</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
