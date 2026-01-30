<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">提成统计</h2>
        <p class="text-slate-500 text-sm">Commission & Performance Analysis</p>
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
        <button class="flex items-center gap-1 px-4 py-2 bg-emerald-500 text-white rounded text-sm font-medium hover:bg-emerald-600">
          <Download :size="16" /> 导出报表
        </button>
      </div>
    </div>

    <!-- Commission Overview -->
    <div class="grid grid-cols-4 gap-4">
      <div class="bg-white p-5 rounded shadow-sm border-l-4 border-emerald-500">
        <div class="flex justify-between items-center mb-2">
          <div class="text-slate-500 text-sm">总提成金额</div>
          <div class="p-2 bg-emerald-50 rounded-full text-emerald-600">
            <DollarSign :size="18" />
          </div>
        </div>
        <div class="text-2xl font-bold text-slate-800">¥8,450.50</div>
        <div class="flex items-center gap-1 text-sm mt-1">
          <TrendingUp class="text-emerald-500" :size="14" />
          <span class="text-emerald-500">+12.5%</span>
          <span class="text-slate-400 ml-1">较上周</span>
        </div>
      </div>
      
      <div class="bg-white p-5 rounded shadow-sm border-l-4 border-blue-500">
        <div class="flex justify-between items-center mb-2">
          <div class="text-slate-500 text-sm">参与员工数</div>
          <div class="p-2 bg-blue-50 rounded-full text-blue-600">
            <Users :size="18" />
          </div>
        </div>
        <div class="text-2xl font-bold text-slate-800">15</div>
        <div class="text-sm text-slate-400 mt-1">本月活跃: 12人</div>
      </div>
      
      <div class="bg-white p-5 rounded shadow-sm border-l-4 border-orange-500">
        <div class="flex justify-between items-center mb-2">
          <div class="text-slate-500 text-sm">平均提成率</div>
          <div class="p-2 bg-orange-50 rounded-full text-orange-600">
            <Percent :size="18" />
          </div>
        </div>
        <div class="text-2xl font-bold text-slate-800">3.8%</div>
        <div class="flex items-center gap-1 text-sm mt-1">
          <TrendingUp class="text-emerald-500" :size="14" />
          <span class="text-emerald-500">+0.2%</span>
          <span class="text-slate-400 ml-1">较上周</span>
        </div>
      </div>
      
      <div class="bg-white p-5 rounded shadow-sm border-l-4 border-purple-500">
        <div class="flex justify-between items-center mb-2">
          <div class="text-slate-500 text-sm">最高个人提成</div>
          <div class="p-2 bg-purple-50 rounded-full text-purple-600">
            <Award :size="18" />
          </div>
        </div>
        <div class="text-2xl font-bold text-slate-800">¥1,250.00</div>
        <div class="text-sm text-slate-400 mt-1">张三 (收银员)</div>
      </div>
    </div>

    <!-- Top Performers -->
    <div class="grid grid-cols-3 gap-6">
      <!-- Commission Trend Chart -->
      <div class="col-span-2 bg-white p-6 rounded shadow-sm">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-bold text-slate-800">提成趋势分析</h3>
          <div class="text-sm text-slate-500">2025年11月</div>
        </div>
        <div class="h-64 flex items-center justify-center text-slate-400 bg-slate-50 rounded border border-dashed border-slate-200">
          提成趋势图表 (Recharts 集成待实现)
        </div>
      </div>
      
      <!-- Top 3 Performers -->
      <div class="bg-white p-6 rounded shadow-sm">
        <h3 class="font-bold text-slate-800 mb-4">本月TOP3</h3>
        <div class="space-y-4">
          <div
            v-for="performer in topPerformers"
            :key="performer.rank"
            class="flex items-center justify-between p-4 rounded-lg"
            :class="getPerformerCardClass(performer.rank)"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                   :class="getRankBadgeClass(performer.rank)">
                {{ performer.rank }}
              </div>
              <div>
                <div class="font-medium text-slate-800">{{ performer.name }}</div>
                <div class="text-xs text-slate-500">{{ performer.role }} · {{ performer.sales }}单</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-lg font-bold text-slate-800">¥{{ performer.commission.toLocaleString('zh-CN', {minimumFractionDigits: 2}) }}</div>
              <div class="text-xs text-slate-400">提成金额</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Staff Commission Details -->
    <div class="bg-white rounded shadow-sm">
      <div class="p-4 border-b border-slate-100 flex justify-between items-center">
        <h3 class="font-bold text-slate-800">员工提成明细</h3>
        <div class="flex items-center gap-3">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="16" />
            <input
              type="text"
              placeholder="搜索员工..."
              class="pl-9 pr-4 py-2 border border-slate-200 rounded text-sm w-64 focus:outline-none focus:border-emerald-500"
              v-model="searchTerm"
            />
          </div>
          <select class="border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" v-model="selectedRole">
            <option value="">所有岗位</option>
            <option value="收银员">收银员</option>
            <option value="服务员">服务员</option>
            <option value="店长">店长</option>
            <option value="后厨">后厨</option>
          </select>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 text-slate-600">
            <tr>
              <th class="p-4">员工</th>
              <th class="p-4">岗位</th>
              <th class="p-4 text-right">销售额</th>
              <th class="p-4 text-right">订单数</th>
              <th class="p-4 text-right">客单价</th>
              <th class="p-4 text-right">提成率</th>
              <th class="p-4 text-right">提成金额</th>
              <th class="p-4 text-right">完成率</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="staff in filteredStaff" :key="staff.id" class="hover:bg-slate-50">
              <td class="p-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-medium text-sm">
                    {{ staff.name.charAt(0) }}
                  </div>
                  <div>
                    <div class="font-medium text-slate-800">{{ staff.name }}</div>
                    <div class="text-xs text-slate-500">工号: {{ staff.id }}</div>
                  </div>
                </div>
              </td>
              <td class="p-4">
                <span :class="['px-2 py-1 rounded text-xs font-medium', getRoleClass(staff.role)]">
                  {{ staff.role }}
                </span>
              </td>
              <td class="p-4 text-right font-mono text-slate-600">¥{{ staff.salesAmount.toLocaleString('zh-CN', {minimumFractionDigits: 2}) }}</td>
              <td class="p-4 text-right font-mono text-slate-600">{{ staff.orderCount }}</td>
              <td class="p-4 text-right font-mono text-slate-600">¥{{ staff.avgOrderValue.toFixed(2) }}</td>
              <td class="p-4 text-right">
                <span :class="['font-mono font-bold', staff.commissionRate >= 4 ? 'text-emerald-600' : 'text-orange-500']">
                  {{ staff.commissionRate }}%
                </span>
              </td>
              <td class="p-4 text-right font-mono font-bold text-emerald-600">¥{{ staff.commissionAmount.toLocaleString('zh-CN', {minimumFractionDigits: 2}) }}</td>
              <td class="p-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <div class="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      class="h-full rounded-full transition-all"
                      :class="getCompletionClass(staff.completionRate)"
                      :style="{ width: `${Math.min(staff.completionRate, 100)}%` }"
                    ></div>
                  </div>
                  <span :class="['text-sm font-medium', getCompletionTextClass(staff.completionRate)]">
                    {{ staff.completionRate }}%
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500">
        <div>共 {{ filteredStaff.length }} 位员工</div>
        <div>总提成金额: <span class="font-bold text-emerald-600">¥{{ totalCommission.toLocaleString('zh-CN', {minimumFractionDigits: 2}) }}</span></div>
      </div>
    </div>

    <!-- Commission Rules & Summary -->
    <div class="grid grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded shadow-sm">
        <h3 class="font-bold text-slate-800 mb-4">提成规则说明</h3>
        <div class="space-y-3 text-sm text-slate-600">
          <div class="flex items-start gap-2">
            <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs mt-0.5">1</div>
            <div>基础提成率: 销售额的2%，适用于所有岗位</div>
          </div>
          <div class="flex items-start gap-2">
            <div class="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mt-0.5">2</div>
            <div>岗位加成: 收银员+1%，店长+0.5%，服务员+0.3%</div>
          </div>
          <div class="flex items-start gap-2">
            <div class="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs mt-0.5">3</div>
            <div>业绩奖励: 完成月度目标额外奖励销售额的1%</div>
          </div>
          <div class="flex items-start gap-2">
            <div class="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs mt-0.5">4</div>
            <div>团队奖励: 门店超额完成目标，全体员工额外奖励0.5%</div>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded shadow-sm">
        <h3 class="font-bold text-slate-800 mb-4">月度目标完成情况</h3>
        <div class="space-y-4">
          <div>
            <div class="flex justify-between text-sm text-slate-600 mb-1">
              <span>销售额目标</span>
              <span>¥{{ monthlyTarget.salesTarget.toLocaleString('zh-CN', {minimumFractionDigits: 2}) }}</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div 
                class="h-full rounded-full bg-emerald-500 transition-all"
                :style="{ width: `${Math.min((monthlyTarget.currentSales / monthlyTarget.salesTarget) * 100, 100)}%` }"
              ></div>
            </div>
            <div class="flex justify-between text-xs text-slate-500 mt-1">
              <span>当前: ¥{{ monthlyTarget.currentSales.toLocaleString('zh-CN', {minimumFractionDigits: 2}) }}</span>
              <span>{{ ((monthlyTarget.currentSales / monthlyTarget.salesTarget) * 100).toFixed(1) }}%</span>
            </div>
          </div>
          <div>
            <div class="flex justify-between text-sm text-slate-600 mb-1">
              <span>订单数目标</span>
              <span>{{ monthlyTarget.orderTarget }} 单</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div 
                class="h-full rounded-full bg-blue-500 transition-all"
                :style="{ width: `${Math.min((monthlyTarget.currentOrders / monthlyTarget.orderTarget) * 100, 100)}%` }"
              ></div>
            </div>
            <div class="flex justify-between text-xs text-slate-500 mt-1">
              <span>当前: {{ monthlyTarget.currentOrders }} 单</span>
              <span>{{ ((monthlyTarget.currentOrders / monthlyTarget.orderTarget) * 100).toFixed(1) }}%</span>
            </div>
          </div>
          <div class="pt-2 border-t border-slate-100">
            <div class="flex justify-between items-center">
              <div class="text-sm text-slate-600">预计总提成</div>
              <div class="text-lg font-bold text-emerald-600">¥{{ estimatedTotalCommission.toLocaleString('zh-CN', {minimumFractionDigits: 2}) }}</div>
            </div>
            <div class="text-xs text-slate-500 mt-1">基于当前完成率估算</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  DollarSign,
  Users,
  Percent,
  Award,
  TrendingUp,
  Download,
  Search
} from 'lucide-vue-next'

type TimePeriod = 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR'
type StaffRole = '收银员' | '服务员' | '店长' | '后厨'

const activePeriod = ref<TimePeriod>('MONTH')
const selectedRole = ref<string>('')
const searchTerm = ref('')

const timePeriods = [
  { id: 'WEEK' as TimePeriod, label: '本周' },
  { id: 'MONTH' as TimePeriod, label: '本月' },
  { id: 'QUARTER' as TimePeriod, label: '本季' },
  { id: 'YEAR' as TimePeriod, label: '本年' }
]

const topPerformers = [
  { rank: 1, name: '张三', role: '收银员', sales: 245, commission: 1250.00 },
  { rank: 2, name: '李四', role: '店长', sales: 198, commission: 980.50 },
  { rank: 3, name: '王五', role: '服务员', sales: 176, commission: 720.00 }
]

const staffList = [
  { id: 'EMP001', name: '张三', role: '收银员' as StaffRole, salesAmount: 62500, orderCount: 245, avgOrderValue: 255.10, commissionRate: 4.0, commissionAmount: 1250.00, completionRate: 125 },
  { id: 'EMP002', name: '李四', role: '店长' as StaffRole, salesAmount: 49025, orderCount: 198, avgOrderValue: 247.60, commissionRate: 3.5, commissionAmount: 980.50, completionRate: 98 },
  { id: 'EMP003', name: '王五', role: '服务员' as StaffRole, salesAmount: 36000, orderCount: 176, avgOrderValue: 204.55, commissionRate: 3.0, commissionAmount: 720.00, completionRate: 90 },
  { id: 'EMP004', name: '赵六', role: '收银员' as StaffRole, salesAmount: 42000, orderCount: 165, avgOrderValue: 254.55, commissionRate: 4.0, commissionAmount: 840.00, completionRate: 105 },
  { id: 'EMP005', name: '钱七', role: '服务员' as StaffRole, salesAmount: 28500, orderCount: 142, avgOrderValue: 200.70, commissionRate: 3.0, commissionAmount: 570.00, completionRate: 71 },
  { id: 'EMP006', name: '孙八', role: '后厨' as StaffRole, salesAmount: 0, orderCount: 0, avgOrderValue: 0, commissionRate: 2.0, commissionAmount: 0, completionRate: 0 },
  { id: 'EMP007', name: '周九', role: '收银员' as StaffRole, salesAmount: 38000, orderCount: 152, avgOrderValue: 250.00, commissionRate: 4.0, commissionAmount: 760.00, completionRate: 95 },
  { id: 'EMP008', name: '吴十', role: '服务员' as StaffRole, salesAmount: 32000, orderCount: 148, avgOrderValue: 216.22, commissionRate: 3.0, commissionAmount: 640.00, completionRate: 80 }
]

const filteredStaff = computed(() => {
  let result = staffList
  
  if (selectedRole.value) {
    result = result.filter(staff => staff.role === selectedRole.value)
  }
  
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    result = result.filter(staff => 
      staff.name.toLowerCase().includes(term) || 
      staff.id.toLowerCase().includes(term)
    )
  }
  
  return result.sort((a, b) => b.commissionAmount - a.commissionAmount)
})

const totalCommission = computed(() => {
  return filteredStaff.value.reduce((sum, staff) => sum + staff.commissionAmount, 0)
})

const monthlyTarget = {
  salesTarget: 200000,
  currentSales: 248025,
  orderTarget: 800,
  currentOrders: 1026
}

const estimatedTotalCommission = computed(() => {
  const completionRate = monthlyTarget.currentSales / monthlyTarget.salesTarget
  const baseCommission = totalCommission.value
  return Math.round(baseCommission * completionRate * 100) / 100
})

const getPerformerCardClass = (rank: number): string => {
  const classes: Record<number, string> = {
    1: 'bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200',
    2: 'bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200',
    3: 'bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200'
  }
  return classes[rank] || 'bg-slate-50 border border-slate-100'
}

const getRankBadgeClass = (rank: number): string => {
  const classes: Record<number, string> = {
    1: 'bg-amber-500',
    2: 'bg-slate-500',
    3: 'bg-orange-500'
  }
  return classes[rank] || 'bg-slate-400'
}

const getRoleClass = (role: StaffRole): string => {
  const classes: Record<StaffRole, string> = {
    '收银员': 'bg-emerald-100 text-emerald-600',
    '服务员': 'bg-blue-100 text-blue-600',
    '店长': 'bg-purple-100 text-purple-600',
    '后厨': 'bg-orange-100 text-orange-600'
  }
  return classes[role]
}

const getCompletionClass = (rate: number): string => {
  if (rate >= 100) return 'bg-emerald-500'
  if (rate >= 80) return 'bg-blue-500'
  if (rate >= 60) return 'bg-orange-500'
  return 'bg-red-500'
}

const getCompletionTextClass = (rate: number): string => {
  if (rate >= 100) return 'text-emerald-600'
  if (rate >= 80) return 'text-blue-600'
  if (rate >= 60) return 'text-orange-600'
  return 'text-red-600'
}
</script>