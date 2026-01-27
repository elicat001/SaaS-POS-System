<script setup lang="ts">
import { ref, computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, BarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { useOrderStore } from '@/stores/order'
import { useProductStore } from '@/stores/product'
import { FileText, Download, Calendar } from 'lucide-vue-next'
import { Button } from '@/components/ui'

use([CanvasRenderer, PieChart, BarChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent])

const orderStore = useOrderStore()
const productStore = useProductStore()

const reportType = ref('sales')
const reportTypes = [
  { value: 'sales', label: '销售报表' },
  { value: 'products', label: '商品报表' },
  { value: 'categories', label: '分类报表' },
]

// Category sales pie chart
const categorySalesOption = computed(() => {
  const categoryData = productStore.categories
    .filter(c => c.id !== 'c1')
    .map(category => {
      const products = productStore.productsByCategory(category.id)
      const revenue = products.reduce((sum, p) => sum + p.price * (100 - p.stock), 0)
      return { name: category.name, value: Math.max(0, revenue) }
    })

  return {
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [{
      type: 'pie',
      radius: '60%',
      data: categoryData,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  }
})

// Top products bar chart
const topProductsOption = computed(() => {
  const topProducts = [...productStore.products]
    .sort((a, b) => (1000 - b.stock) - (1000 - a.stock))
    .slice(0, 10)

  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value' },
    yAxis: {
      type: 'category',
      data: topProducts.map(p => p.name),
      axisLabel: { width: 100, overflow: 'truncate' }
    },
    series: [{
      name: '销量',
      type: 'bar',
      data: topProducts.map(p => 1000 - p.stock),
      itemStyle: { color: '#3b82f6' }
    }]
  }
})

function exportReport() {
  alert('导出报表功能开发中...')
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold text-gray-800">报表中心</h1>
      <Button variant="outline" @click="exportReport">
        <Download class="w-4 h-4" />
        导出报表
      </Button>
    </div>

    <!-- Report type tabs -->
    <div class="bg-white rounded-lg shadow-sm p-4">
      <div class="flex gap-2">
        <button
          v-for="type in reportTypes"
          :key="type.value"
          @click="reportType = type.value"
          :class="[
            'px-4 py-2 text-sm rounded-lg transition-colors',
            reportType === type.value
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          {{ type.label }}
        </button>
      </div>
    </div>

    <!-- Sales report -->
    <div v-if="reportType === 'sales'" class="grid grid-cols-2 gap-4">
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h3 class="font-bold text-gray-800 mb-4">订单统计</h3>
        <div class="space-y-4">
          <div class="flex justify-between p-3 bg-gray-50 rounded">
            <span class="text-gray-600">总订单数</span>
            <span class="font-bold">{{ orderStore.orders.length }}</span>
          </div>
          <div class="flex justify-between p-3 bg-gray-50 rounded">
            <span class="text-gray-600">已完成订单</span>
            <span class="font-bold text-green-600">{{ orderStore.completedOrders.length }}</span>
          </div>
          <div class="flex justify-between p-3 bg-gray-50 rounded">
            <span class="text-gray-600">待处理订单</span>
            <span class="font-bold text-yellow-600">{{ orderStore.pendingOrders.length }}</span>
          </div>
          <div class="flex justify-between p-3 bg-blue-50 rounded">
            <span class="text-gray-600">今日营业额</span>
            <span class="font-bold text-blue-600">¥{{ orderStore.todayRevenue.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between p-3 bg-green-50 rounded">
            <span class="text-gray-600">今日利润</span>
            <span class="font-bold text-green-600">¥{{ orderStore.todayProfit.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h3 class="font-bold text-gray-800 mb-4">分类销售占比</h3>
        <div class="h-72">
          <v-chart class="w-full h-full" :option="categorySalesOption" autoresize />
        </div>
      </div>
    </div>

    <!-- Products report -->
    <div v-if="reportType === 'products'" class="bg-white p-6 rounded-lg shadow-sm">
      <h3 class="font-bold text-gray-800 mb-4">商品销售排行</h3>
      <div class="h-96">
        <v-chart class="w-full h-full" :option="topProductsOption" autoresize />
      </div>
    </div>

    <!-- Categories report -->
    <div v-if="reportType === 'categories'" class="bg-white p-6 rounded-lg shadow-sm">
      <h3 class="font-bold text-gray-800 mb-4">分类统计</h3>
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">分类</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">商品数</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">在售商品</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">库存总量</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr
            v-for="category in productStore.categories.filter(c => c.id !== 'c1')"
            :key="category.id"
            class="hover:bg-gray-50"
          >
            <td class="px-4 py-3 font-medium">{{ category.name }}</td>
            <td class="px-4 py-3">{{ productStore.productsByCategory(category.id).length }}</td>
            <td class="px-4 py-3 text-green-600">
              {{ productStore.productsByCategory(category.id).filter(p => p.isOnShelf).length }}
            </td>
            <td class="px-4 py-3">
              {{ productStore.productsByCategory(category.id).reduce((sum, p) => sum + p.stock, 0) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
