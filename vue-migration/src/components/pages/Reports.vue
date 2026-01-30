<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">营业报表</h2>
        <p class="text-slate-500 text-sm">Business Reports & Analysis</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="16" />
          <input
            type="text"
            placeholder="搜索报表..."
            class="pl-9 pr-4 py-2 border border-slate-200 rounded text-sm w-64 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <button class="flex items-center gap-1 px-4 py-2 bg-emerald-500 text-white rounded text-sm font-medium hover:bg-emerald-600">
          <Download :size="16" /> 导出报表
        </button>
      </div>
    </div>

    <!-- Report Type Selection -->
    <div class="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm w-fit">
      <button
        v-for="report in reportTypes"
        :key="report.id"
        @click="activeReport = report.id"
        :class="['flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all', activeReport === report.id ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50']"
      >
        <component :is="report.icon" :size="16" /> {{ report.label }}
      </button>
    </div>

    <!-- Report Content -->
    <div class="bg-white rounded shadow-sm">
      <div class="p-4 border-b border-slate-100 flex justify-between items-center">
        <div class="flex items-center gap-4">
          <h3 class="font-bold text-slate-800">{{ getReportTitle(activeReport) }}</h3>
          <div class="text-sm text-slate-500">数据日期: 2025-11-13 ~ 2025-11-19</div>
        </div>
        <div class="flex gap-2">
          <button class="flex items-center gap-1 px-4 py-2 border border-slate-200 rounded text-sm hover:bg-slate-50 text-slate-600">
            <Printer :size="16" /> 打印
          </button>
          <button class="flex items-center gap-1 px-4 py-2 border border-slate-200 rounded text-sm hover:bg-slate-50 text-slate-600">
            <Share2 :size="16" /> 分享
          </button>
        </div>
      </div>

      <!-- Daily Sales Report -->
      <div v-if="activeReport === 'DAILY_SALES'" class="p-6">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-slate-50 text-slate-600">
              <tr>
                <th class="p-3">日期</th>
                <th class="p-3 text-right">销售额</th>
                <th class="p-3 text-right">订单数</th>
                <th class="p-3 text-right">客单价</th>
                <th class="p-3 text-right">堂食</th>
                <th class="p-3 text-right">外卖</th>
                <th class="p-3 text-right">自取</th>
                <th class="p-3 text-right">毛利率</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="day in dailySales" :key="day.date" class="hover:bg-slate-50">
                <td class="p-3 font-medium text-slate-800">{{ day.date }}</td>
                <td class="p-3 text-right font-mono text-slate-600">¥{{ day.sales.toLocaleString('zh-CN', {minimumFractionDigits: 2}) }}</td>
                <td class="p-3 text-right font-mono text-slate-600">{{ day.orders }}</td>
                <td class="p-3 text-right font-mono text-slate-600">¥{{ day.avgOrderValue.toFixed(2) }}</td>
                <td class="p-3 text-right font-mono text-slate-600">{{ day.dineIn }}%</td>
                <td class="p-3 text-right font-mono text-slate-600">{{ day.delivery }}%</td>
                <td class="p-3 text-right font-mono text-slate-600">{{ day.pickup }}%</td>
                <td class="p-3 text-right">
                  <span :class="['font-mono', day.grossMargin >= 60 ? 'text-emerald-600' : 'text-orange-500']">
                    {{ day.grossMargin }}%
                  </span>
                </td>
              </tr>
              <!-- Summary Row -->
              <tr class="bg-slate-50 font-bold">
                <td class="p-3">总计</td>
                <td class="p-3 text-right font-mono text-emerald-600">¥{{ totalSales.toLocaleString('zh-CN', {minimumFractionDigits: 2}) }}</td>
                <td class="p-3 text-right font-mono text-slate-800">{{ totalOrders }}</td>
                <td class="p-3 text-right font-mono text-slate-800">¥{{ (totalSales / totalOrders).toFixed(2) }}</td>
                <td class="p-3 text-right font-mono text-slate-800">{{ avgDineIn }}%</td>
                <td class="p-3 text-right font-mono text-slate-800">{{ avgDelivery }}%</td>
                <td class="p-3 text-right font-mono text-slate-800">{{ avgPickup }}%</td>
                <td class="p-3 text-right font-mono text-emerald-600">{{ avgGrossMargin }}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Other Reports Placeholder -->
      <div v-else class="p-12">
        <div class="text-center">
          <div class="text-slate-400 mb-2">{{ getReportTitle(activeReport) }}报表</div>
          <div class="text-slate-300 text-sm">此报表类型正在开发中</div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded shadow-sm">
        <h3 class="font-bold text-slate-800 mb-4">销售渠道分布</h3>
        <div class="h-64 flex items-center justify-center text-slate-400 bg-slate-50 rounded border border-dashed border-slate-200">
          销售渠道图表 (Recharts 集成待实现)
        </div>
      </div>
      <div class="bg-white p-6 rounded shadow-sm">
        <h3 class="font-bold text-slate-800 mb-4">时段销售分析</h3>
        <div class="h-64 flex items-center justify-center text-slate-400 bg-slate-50 rounded border border-dashed border-slate-200">
          时段分析图表 (Recharts 集成待实现)
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  BarChart3,
  DollarSign,
  Users,
  Package,
  TrendingUp,
  Download,
  Search,
  Printer,
  Share2
} from 'lucide-vue-next'

type ReportType = 'DAILY_SALES' | 'PRODUCT_ANALYSIS' | 'CUSTOMER_ANALYSIS' | 'STAFF_PERFORMANCE'

const activeReport = ref<ReportType>('DAILY_SALES')

const reportTypes = [
  { id: 'DAILY_SALES' as ReportType, label: '日报表', icon: BarChart3 },
  { id: 'PRODUCT_ANALYSIS' as ReportType, label: '商品分析', icon: Package },
  { id: 'CUSTOMER_ANALYSIS' as ReportType, label: '客户分析', icon: Users },
  { id: 'STAFF_PERFORMANCE' as ReportType, label: '员工业绩', icon: TrendingUp }
]

const dailySales = [
  { date: '2025-11-13', sales: 4200, orders: 120, avgOrderValue: 35.00, dineIn: 65, delivery: 20, pickup: 15, grossMargin: 62 },
  { date: '2025-11-14', sales: 3800, orders: 98, avgOrderValue: 38.78, dineIn: 60, delivery: 25, pickup: 15, grossMargin: 61 },
  { date: '2025-11-15', sales: 5100, orders: 145, avgOrderValue: 35.17, dineIn: 70, delivery: 18, pickup: 12, grossMargin: 63 },
  { date: '2025-11-16', sales: 6500, orders: 180, avgOrderValue: 36.11, dineIn: 75, delivery: 15, pickup: 10, grossMargin: 64 },
  { date: '2025-11-17', sales: 6100, orders: 170, avgOrderValue: 35.88, dineIn: 68, delivery: 22, pickup: 10, grossMargin: 63 },
  { date: '2025-11-18', sales: 4800, orders: 130, avgOrderValue: 36.92, dineIn: 62, delivery: 25, pickup: 13, grossMargin: 62 },
  { date: '2025-11-19', sales: 5300, orders: 155, avgOrderValue: 34.19, dineIn: 67, delivery: 20, pickup: 13, grossMargin: 63 }
]

const totalSales = computed(() => dailySales.reduce((sum, day) => sum + day.sales, 0))
const totalOrders = computed(() => dailySales.reduce((sum, day) => sum + day.orders, 0))
const avgDineIn = computed(() => Math.round(dailySales.reduce((sum, day) => sum + day.dineIn, 0) / dailySales.length))
const avgDelivery = computed(() => Math.round(dailySales.reduce((sum, day) => sum + day.delivery, 0) / dailySales.length))
const avgPickup = computed(() => Math.round(dailySales.reduce((sum, day) => sum + day.pickup, 0) / dailySales.length))
const avgGrossMargin = computed(() => Math.round(dailySales.reduce((sum, day) => sum + day.grossMargin, 0) / dailySales.length))

const getReportTitle = (report: ReportType): string => {
  const titles: Record<ReportType, string> = {
    'DAILY_SALES': '日报表',
    'PRODUCT_ANALYSIS': '商品分析',
    'CUSTOMER_ANALYSIS': '客户分析',
    'STAFF_PERFORMANCE': '员工业绩'
  }
  return titles[report]
}
</script>