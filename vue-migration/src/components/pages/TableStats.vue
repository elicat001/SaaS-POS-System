<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">桌台统计</h2>
        <p class="text-slate-500 text-sm">Table Utilization & Performance</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          <button
            v-for="period in timePeriods"
            :key="period.id"
            @click="activePeriod = period.id"
            :class="['px-4 py-1.5 rounded-md text-sm font-medium transition-all', activePeriod === period.id ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50']"
          >
            {{ period.label }}
          </button>
        </div>
        <button class="flex items-center gap-1 px-4 py-2 border border-slate-200 rounded text-sm hover:bg-slate-50 text-slate-600">
          <Download :size="16" /> 导出数据
        </button>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-4 gap-4">
      <div class="bg-white p-5 rounded shadow-sm border-l-4 border-emerald-500">
        <div class="flex justify-between items-center mb-2">
          <div class="text-slate-500 text-sm">总桌台数</div>
          <div class="p-2 bg-emerald-50 rounded-full text-emerald-600">
            <Table :size="18" />
          </div>
        </div>
        <div class="text-2xl font-bold text-slate-800">24</div>
        <div class="text-sm text-slate-400 mt-1">大厅: 12 | 包厢: 8 | 露台: 4</div>
      </div>
      
      <div class="bg-white p-5 rounded shadow-sm border-l-4 border-blue-500">
        <div class="flex justify-between items-center mb-2">
          <div class="text-slate-500 text-sm">平均翻台率</div>
          <div class="p-2 bg-blue-50 rounded-full text-blue-600">
            <RefreshCw :size="18" />
          </div>
        </div>
        <div class="text-2xl font-bold text-slate-800">2.8</div>
        <div class="flex items-center gap-1 text-sm mt-1">
          <TrendingUp class="text-emerald-500" :size="14" />
          <span class="text-emerald-500">+0.3</span>
          <span class="text-slate-400 ml-1">较上周</span>
        </div>
      </div>
      
      <div class="bg-white p-5 rounded shadow-sm border-l-4 border-orange-500">
        <div class="flex justify-between items-center mb-2">
          <div class="text-slate-500 text-sm">平均占用时长</div>
          <div class="p-2 bg-orange-50 rounded-full text-orange-600">
            <Clock :size="18" />
          </div>
        </div>
        <div class="text-2xl font-bold text-slate-800">45min</div>
        <div class="flex items-center gap-1 text-sm mt-1">
          <TrendingDown class="text-red-500" :size="14" />
          <span class="text-red-500">-5min</span>
          <span class="text-slate-400 ml-1">较上周</span>
        </div>
      </div>
      
      <div class="bg-white p-5 rounded shadow-sm border-l-4 border-purple-500">
        <div class="flex justify-between items-center mb-2">
          <div class="text-slate-500 text-sm">桌台利用率</div>
          <div class="p-2 bg-purple-50 rounded-full text-purple-600">
            <BarChart3 :size="18" />
          </div>
        </div>
        <div class="text-2xl font-bold text-slate-800">78.5%</div>
        <div class="flex items-center gap-1 text-sm mt-1">
          <TrendingUp class="text-emerald-500" :size="14" />
          <span class="text-emerald-500">+4.2%</span>
          <span class="text-slate-400 ml-1">较上周</span>
        </div>
      </div>
    </div>

    <!-- Table Performance -->
    <div class="grid grid-cols-3 gap-6">
      <!-- Table Utilization Chart -->
      <div class="col-span-2 bg-white p-6 rounded shadow-sm">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-bold text-slate-800">桌台利用率趋势</h3>
          <div class="flex gap-2">
            <button
              v-for="area in areas"
              :key="area"
              @click="selectedArea = area"
              :class="['px-3 py-1 rounded text-xs', selectedArea === area ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
            >
              {{ area }}
            </button>
          </div>
        </div>
        <div class="h-64 flex items-center justify-center text-slate-400 bg-slate-50 rounded border border-dashed border-slate-200">
          桌台利用率图表 (Recharts 集成待实现)
        </div>
      </div>
      
      <!-- Top Performing Tables -->
      <div class="bg-white p-6 rounded shadow-sm">
        <h3 class="font-bold text-slate-800 mb-4">高效桌台TOP5</h3>
        <div class="space-y-3">
          <div
            v-for="table in topTables"
            :key="table.id"
            class="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100"
          >
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">
                {{ table.rank }}
              </div>
              <div>
                <div class="text-sm font-medium text-slate-800">{{ table.name }}</div>
                <div class="text-xs text-slate-500">{{ table.area }} · {{ table.capacity }}人</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm font-bold text-emerald-600">{{ table.turnoverRate.toFixed(1) }}</div>
              <div class="text-xs text-slate-400">翻台率</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Table List -->
    <div class="bg-white rounded shadow-sm">
      <div class="p-4 border-b border-slate-100 flex justify-between items-center">
        <h3 class="font-bold text-slate-800">桌台明细</h3>
        <div class="flex items-center gap-3">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="16" />
            <input
              type="text"
              placeholder="搜索桌台..."
              class="pl-9 pr-4 py-2 border border-slate-200 rounded text-sm w-64 focus:outline-none focus:border-emerald-500"
              v-model="searchTerm"
            />
          </div>
          <select class="border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-500">
            <option value="">所有区域</option>
            <option value="大厅">大厅</option>
            <option value="包厢">包厢</option>
            <option value="露台">露台</option>
          </select>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 text-slate-600">
            <tr>
              <th class="p-4">桌台号</th>
              <th class="p-4">区域</th>
              <th class="p-4">容量</th>
              <th class="p-4 text-right">今日订单</th>
              <th class="p-4 text-right">今日销售额</th>
              <th class="p-4 text-right">翻台率</th>
              <th class="p-4 text-right">平均时长</th>
              <th class="p-4">状态</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="table in filteredTables" :key="table.id" class="hover:bg-slate-50">
              <td class="p-4 font-medium text-slate-800">{{ table.name }}</td>
              <td class="p-4">
                <span :class="['px-2 py-1 rounded text-xs', getAreaColor(table.area)]">
                  {{ table.area }}
                </span>
              </td>
              <td class="p-4 text-slate-600">{{ table.capacity }}人</td>
              <td class="p-4 text-right font-mono text-slate-600">{{ table.todayOrders }}</td>
              <td class="p-4 text-right font-mono text-slate-600">¥{{ table.todaySales.toLocaleString('zh-CN', {minimumFractionDigits: 2}) }}</td>
              <td class="p-4 text-right">
                <span :class="['font-mono font-bold', table.turnoverRate >= 2.5 ? 'text-emerald-600' : 'text-orange-500']">
                  {{ table.turnoverRate.toFixed(1) }}
                </span>
              </td>
              <td class="p-4 text-right font-mono text-slate-600">{{ table.avgDuration }}min</td>
              <td class="p-4">
                <span :class="['px-2 py-1 rounded text-xs font-medium', getStatusClass(table.status)]">
                  {{ table.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Table,
  RefreshCw,
  Clock,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Search
} from 'lucide-vue-next'

type TimePeriod = 'TODAY' | 'WEEK' | 'MONTH' | 'CUSTOM'
type TableStatus = '空闲' | '使用中' | '已预订' | '维护中'

const activePeriod = ref<TimePeriod>('WEEK')
const selectedArea = ref<string>('全部')
const searchTerm = ref('')

const timePeriods = [
  { id: 'TODAY' as TimePeriod, label: '今日' },
  { id: 'WEEK' as TimePeriod, label: '本周' },
  { id: 'MONTH' as TimePeriod, label: '本月' },
  { id: 'CUSTOM' as TimePeriod, label: '自定义' }
]

const areas = ['全部', '大厅', '包厢', '露台']

const topTables = [
  { id: 't8', rank: 1, name: '8号桌', area: '大厅', capacity: 4, turnoverRate: 3.2 },
  { id: 't12', rank: 2, name: '12号桌', area: '包厢', capacity: 6, turnoverRate: 3.0 },
  { id: 't3', rank: 3, name: '3号桌', area: '大厅', capacity: 2, turnoverRate: 2.9 },
  { id: 't15', rank: 4, name: '15号桌', area: '露台', capacity: 4, turnoverRate: 2.8 },
  { id: 't6', rank: 5, name: '6号桌', area: '大厅', capacity: 4, turnoverRate: 2.7 }
]

const tables = [
  { id: 't1', name: '1号桌', area: '大厅', capacity: 2, todayOrders: 8, todaySales: 320, turnoverRate: 2.5, avgDuration: 42, status: '空闲' as TableStatus },
  { id: 't2', name: '2号桌', area: '大厅', capacity: 2, todayOrders: 10, todaySales: 450, turnoverRate: 3.1, avgDuration: 38, status: '使用中' as TableStatus },
  { id: 't3', name: '3号桌', area: '大厅', capacity: 2, todayOrders: 12, todaySales: 520, turnoverRate: 2.9, avgDuration: 40, status: '空闲' as TableStatus },
  { id: 't4', name: '4号桌', area: '大厅', capacity: 4, todayOrders: 9, todaySales: 680, turnoverRate: 2.3, avgDuration: 55, status: '已预订' as TableStatus },
  { id: 't5', name: '5号桌', area: '包厢', capacity: 6, todayOrders: 7, todaySales: 890, turnoverRate: 2.1, avgDuration: 65, status: '使用中' as TableStatus },
  { id: 't6', name: '6号桌', area: '大厅', capacity: 4, todayOrders: 11, todaySales: 720, turnoverRate: 2.7, avgDuration: 48, status: '空闲' as TableStatus },
  { id: 't7', name: '7号桌', area: '包厢', capacity: 8, todayOrders: 6, todaySales: 950, turnoverRate: 1.8, avgDuration: 75, status: '维护中' as TableStatus },
  { id: 't8', name: '8号桌', area: '大厅', capacity: 4, todayOrders: 13, todaySales: 810, turnoverRate: 3.2, avgDuration: 36, status: '使用中' as TableStatus }
]

const filteredTables = computed(() => {
  let result = tables
  
  if (selectedArea.value !== '全部') {
    result = result.filter(table => table.area === selectedArea.value)
  }
  
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    result = result.filter(table => 
      table.name.toLowerCase().includes(term) || 
      table.area.toLowerCase().includes(term)
    )
  }
  
  return result
})

const getAreaColor = (area: string): string => {
  const colors: Record<string, string> = {
    '大厅': 'bg-blue-100 text-blue-600',
    '包厢': 'bg-purple-100 text-purple-600',
    '露台': 'bg-orange-100 text-orange-600'
  }
  return colors[area] || 'bg-slate-100 text-slate-600'
}

const getStatusClass = (status: TableStatus): string => {
  const classes: Record<TableStatus, string> = {
    '空闲': 'bg-emerald-100 text-emerald-600',
    '使用中': 'bg-blue-100 text-blue-600',
    '已预订': 'bg-orange-100 text-orange-600',
    '维护中': 'bg-red-100 text-red-600'
  }
  return classes[status]
}
</script>