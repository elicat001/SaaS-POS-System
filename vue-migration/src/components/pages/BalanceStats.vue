<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">余额统计</h2>
        <p class="text-slate-500 text-sm">Member Balance & Transaction Analysis</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          <button
            v-for="filter in filterTypes"
            :key="filter.id"
            @click="activeFilter = filter.id"
            :class="['px-4 py-1.5 rounded-md text-sm font-medium transition-all', activeFilter === filter.id ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50']"
          >
            {{ filter.label }}
          </button>
        </div>
        <button class="flex items-center gap-1 px-4 py-2 bg-emerald-500 text-white rounded text-sm font-medium hover:bg-emerald-600">
          <Download :size="16" /> 导出报表
        </button>
      </div>
    </div>

    <!-- Balance Overview -->
    <div class="grid grid-cols-4 gap-4">
      <div class="bg-white p-5 rounded shadow-sm border-l-4 border-emerald-500">
        <div class="flex justify-between items-center mb-2">
          <div class="text-slate-500 text-sm">会员总余额</div>
          <div class="p-2 bg-emerald-50 rounded-full text-emerald-600">
            <Wallet :size="18" />
          </div>
        </div>
        <div class="text-2xl font-bold text-slate-800">¥125,800.50</div>
        <div class="flex items-center gap-1 text-sm mt-1">
          <TrendingUp class="text-emerald-500" :size="14" />
          <span class="text-emerald-500">+8,450.00</span>
          <span class="text-slate-400 ml-1">本周新增</span>
        </div>
      </div>
      
      <div class="bg-white p-5 rounded shadow-sm border-l-4 border-blue-500">
        <div class="flex justify-between items-center mb-2">
          <div class="text-slate-500 text-sm">活跃会员数</div>
          <div class="p-2 bg-blue-50 rounded-full text-blue-600">
            <Users :size="18" />
          </div>
        </div>
        <div class="text-2xl font-bold text-slate-800">1,248</div>
        <div class="flex items-center gap-1 text-sm mt-1">
          <TrendingUp class="text-emerald-500" :size="14" />
          <span class="text-emerald-500">+42</span>
          <span class="text-slate-400 ml-1">本周新增</span>
        </div>
      </div>
      
      <div class="bg-white p-5 rounded shadow-sm border-l-4 border-orange-500">
        <div class="flex justify-between items-center mb-2">
          <div class="text-slate-500 text-sm">本周充值总额</div>
          <div class="p-2 bg-orange-50 rounded-full text-orange-600">
            <ArrowUpRight :size="18" />
          </div>
        </div>
        <div class="text-2xl font-bold text-slate-800">¥24,500.00</div>
        <div class="flex items-center gap-1 text-sm mt-1">
          <TrendingUp class="text-emerald-500" :size="14" />
          <span class="text-emerald-500">+15.2%</span>
          <span class="text-slate-400 ml-1">较上周</span>
        </div>
      </div>
      
      <div class="bg-white p-5 rounded shadow-sm border-l-4 border-purple-500">
        <div class="flex justify-between items-center mb-2">
          <div class="text-slate-500 text-sm">本周消费总额</div>
          <div class="p-2 bg-purple-50 rounded-full text-purple-600">
            <ArrowDownLeft :size="18" />
          </div>
        </div>
        <div class="text-2xl font-bold text-slate-800">¥18,750.50</div>
        <div class="flex items-center gap-1 text-sm mt-1">
          <TrendingUp class="text-emerald-500" :size="14" />
          <span class="text-emerald-500">+12.8%</span>
          <span class="text-slate-400 ml-1">较上周</span>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-2 gap-6">
      <!-- Balance Trend Chart -->
      <div class="bg-white p-6 rounded shadow-sm">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-bold text-slate-800">余额变动趋势</h3>
          <div class="text-sm text-slate-500">2025-11-13 ~ 2025-11-19</div>
        </div>
        <div class="h-64 flex items-center justify-center text-slate-400 bg-slate-50 rounded border border-dashed border-slate-200">
          余额趋势图表 (Recharts 集成待实现)
        </div>
      </div>
      
      <!-- Transaction Type Distribution -->
      <div class="bg-white p-6 rounded shadow-sm">
        <h3 class="font-bold text-slate-800 mb-4">交易类型分布</h3>
        <div class="h-64 flex items-center justify-center text-slate-400 bg-slate-50 rounded border border-dashed border-slate-200">
          交易类型饼图 (Recharts 集成待实现)
        </div>
      </div>
    </div>

    <!-- Transaction List -->
    <div class="bg-white rounded shadow-sm">
      <div class="p-4 border-b border-slate-100 flex justify-between items-center">
        <h3 class="font-bold text-slate-800">交易明细</h3>
        <div class="flex items-center gap-3">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="16" />
            <input
              type="text"
              placeholder="搜索会员/交易号..."
              class="pl-9 pr-4 py-2 border border-slate-200 rounded text-sm w-64 focus:outline-none focus:border-emerald-500"
              v-model="searchTerm"
            />
          </div>
          <select class="border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" v-model="selectedType">
            <option value="ALL">所有类型</option>
            <option value="RECHARGE">充值</option>
            <option value="CONSUME">消费</option>
            <option value="REFUND">退款</option>
            <option value="BONUS">赠送</option>
          </select>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 text-slate-600">
            <tr>
              <th class="p-4">交易时间</th>
              <th class="p-4">会员信息</th>
              <th class="p-4">交易类型</th>
              <th class="p-4 text-right">交易金额</th>
              <th class="p-4 text-right">交易后余额</th>
              <th class="p-4">操作员</th>
              <th class="p-4">备注</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="transaction in filteredTransactions" :key="transaction.id" class="hover:bg-slate-50">
              <td class="p-4 text-slate-500">{{ transaction.time }}</td>
              <td class="p-4">
                <div class="font-medium text-slate-800">{{ transaction.user }}</div>
                <div class="text-xs text-slate-500">{{ transaction.phone }}</div>
              </td>
              <td class="p-4">
                <span :class="['px-2 py-1 rounded text-xs font-medium', getTypeClass(transaction.type)]">
                  {{ getTypeLabel(transaction.type) }}
                </span>
              </td>
              <td :class="['p-4 text-right font-mono font-bold', transaction.amount > 0 ? 'text-emerald-600' : 'text-red-500']">
                {{ transaction.amount > 0 ? '+' : '' }}¥{{ Math.abs(transaction.amount).toLocaleString('zh-CN', {minimumFractionDigits: 2}) }}
              </td>
              <td class="p-4 text-right font-mono text-slate-600">¥{{ transaction.balance.toLocaleString('zh-CN', {minimumFractionDigits: 2}) }}</td>
              <td class="p-4 text-slate-600">{{ transaction.operator }}</td>
              <td class="p-4 text-slate-400 text-xs">{{ transaction.note || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500">
        <div>共 {{ filteredTransactions.length }} 条记录</div>
        <div class="flex gap-2">
          <button class="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">上一页</button>
          <button class="px-3 py-1 border border-slate-200 rounded bg-emerald-500 text-white">1</button>
          <button class="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">2</button>
          <button class="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">3</button>
          <button class="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">下一页</button>
        </div>
      </div>
    </div>

    <!-- Top Members -->
    <div class="grid grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded shadow-sm">
        <h3 class="font-bold text-slate-800 mb-4">余额TOP5会员</h3>
        <div class="space-y-3">
          <div
            v-for="member in topMembers"
            :key="member.id"
            class="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100"
          >
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">
                {{ member.rank }}
              </div>
              <div>
                <div class="text-sm font-medium text-slate-800">{{ member.name }}</div>
                <div class="text-xs text-slate-500">{{ member.phone }} · Lv.{{ member.level }}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm font-bold text-emerald-600">¥{{ member.balance.toLocaleString('zh-CN', {minimumFractionDigits: 2}) }}</div>
              <div class="text-xs text-slate-400">余额</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded shadow-sm">
        <h3 class="font-bold text-slate-800 mb-4">本周充值TOP5</h3>
        <div class="space-y-3">
          <div
            v-for="member in topRechargers"
            :key="member.id"
            class="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100"
          >
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                {{ member.rank }}
              </div>
              <div>
                <div class="text-sm font-medium text-slate-800">{{ member.name }}</div>
                <div class="text-xs text-slate-500">{{ member.phone }}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm font-bold text-blue-600">¥{{ member.rechargeAmount.toLocaleString('zh-CN', {minimumFractionDigits: 2}) }}</div>
              <div class="text-xs text-slate-400">本周充值</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Wallet,
  Users,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  Download,
  Search,
  CreditCard,
  Filter
} from 'lucide-vue-next'

type FilterType = 'ALL' | 'RECHARGE' | 'CONSUME'
type TransactionType = 'RECHARGE' | 'CONSUME' | 'REFUND' | 'BONUS'

const activeFilter = ref<FilterType>('ALL')
const selectedType = ref<string>('ALL')
const searchTerm = ref('')

const filterTypes = [
  { id: 'ALL' as FilterType, label: '全部' },
  { id: 'RECHARGE' as FilterType, label: '充值' },
  { id: 'CONSUME' as FilterType, label: '消费' }
]

const transactions = [
  { id: 'T001', user: '张三', phone: '138****0000', type: 'RECHARGE' as TransactionType, amount: 500, balance: 1250, time: '2025-11-19 14:30', operator: '系统充值', note: '微信支付' },
  { id: 'T002', user: '李四', phone: '139****1234', type: 'CONSUME' as TransactionType, amount: -45.50, balance: 204.50, time: '2025-11-19 14:15', operator: '订单支付', note: '订单#202511191415' },
  { id: 'T003', user: '王五', phone: '136****5678', type: 'RECHARGE' as TransactionType, amount: 1000, balance: 3200, time: '2025-11-19 13:45', operator: '前台充值', note: '现金充值' },
  { id: 'T004', user: '赵六', phone: '137****9012', type: 'CONSUME' as TransactionType, amount: -128.00, balance: 872, time: '2025-11-19 13:20', operator: '订单支付', note: '订单#202511191320' },
  { id: 'T005', user: '钱七', phone: '135****3456', type: 'BONUS' as TransactionType, amount: 50, balance: 550, time: '2025-11-19 12:55', operator: '系统赠送', note: '生日礼金' },
  { id: 'T006', user: '孙八', phone: '134****7890', type: 'REFUND' as TransactionType, amount: 25.50, balance: 525.50, time: '2025-11-19 12:30', operator: '系统退款', note: '订单取消退款' },
  { id: 'T007', user: '周九', phone: '133****2345', type: 'RECHARGE' as TransactionType, amount: 300, balance: 800, time: '2025-11-19 11:45', operator: '微信充值', note: '小程序充值' },
  { id: 'T008', user: '吴十', phone: '132****6789', type: 'CONSUME' as TransactionType, amount: -68.00, balance: 432, time: '2025-11-19 11:20', operator: '订单支付', note: '订单#202511191120' }
]

const filteredTransactions = computed(() => {
  let result = transactions
  
  if (activeFilter.value !== 'ALL') {
    result = result.filter(t => t.type === activeFilter.value)
  }
  
  if (selectedType.value !== 'ALL') {
    result = result.filter(t => t.type === selectedType.value)
  }
  
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    result = result.filter(t => 
      t.user.toLowerCase().includes(term) || 
      t.phone.includes(term) ||
      t.id.toLowerCase().includes(term)
    )
  }
  
  return result
})

const topMembers = [
  { id: 'm1', rank: 1, name: '张三', phone: '138****0000', level: 3, balance: 12500 },
  { id: 'm2', rank: 2, name: '李四', phone: '139****1234', level: 2, balance: 8900 },
  { id: 'm3', rank: 3, name: '王五', phone: '136****5678', level: 4, balance: 7600 },
  { id: 'm4', rank: 4, name: '赵六', phone: '137****9012', level: 2, balance: 5400 },
  { id: 'm5', rank: 5, name: '钱七', phone: '135****3456', level: 1, balance: 3200 }
]

const topRechargers = [
  { id: 'r1', rank: 1, name: '孙八', phone: '134****7890', rechargeAmount: 5000 },
  { id: 'r2', rank: 2, name: '周九', phone: '133****2345', rechargeAmount: 3000 },
  { id: 'r3', rank: 3, name: '吴十', phone: '132****6789', rechargeAmount: 2500 },
  { id: 'r4', rank: 4, name: '郑十一', phone: '131****0123', rechargeAmount: 2000 },
  { id: 'r5', rank: 5, name: '王十二', phone: '130****4567', rechargeAmount: 1500 }
]

const getTypeClass = (type: TransactionType): string => {
  const classes: Record<TransactionType, string> = {
    'RECHARGE': 'bg-emerald-100 text-emerald-600',
    'CONSUME': 'bg-orange-100 text-orange-600',
    'REFUND': 'bg-blue-100 text-blue-600',
    'BONUS': 'bg-purple-100 text-purple-600'
  }
  return classes[type]
}

const getTypeLabel = (type: TransactionType): string => {
  const labels: Record<TransactionType, string> = {
    'RECHARGE': '充值',
    'CONSUME': '消费',
    'REFUND': '退款',
    'BONUS': '赠送'
  }
  return labels[type]
}
</script>