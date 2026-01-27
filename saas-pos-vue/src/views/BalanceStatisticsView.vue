<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { Wallet, Users, TrendingUp, CreditCard } from 'lucide-vue-next'

const userStore = useUserStore()

const stats = computed(() => {
  const members = userStore.members
  const totalBalance = userStore.totalBalance
  return {
    memberCount: members.length,
    totalBalance,
    avgBalance: members.length > 0 ? totalBalance / members.length : 0,
    maxBalance: Math.max(...members.map(m => m.balance), 0),
  }
})
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-xl font-bold text-gray-800">余额统计</h1>
    <div class="grid grid-cols-4 gap-4">
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-blue-100 rounded-lg"><Users class="w-6 h-6 text-blue-600" /></div>
          <div><div class="text-sm text-gray-500">会员数量</div><div class="text-2xl font-bold">{{ stats.memberCount }}</div></div>
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-green-100 rounded-lg"><Wallet class="w-6 h-6 text-green-600" /></div>
          <div><div class="text-sm text-gray-500">总余额</div><div class="text-2xl font-bold text-green-600">¥{{ stats.totalBalance.toFixed(2) }}</div></div>
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-purple-100 rounded-lg"><TrendingUp class="w-6 h-6 text-purple-600" /></div>
          <div><div class="text-sm text-gray-500">平均余额</div><div class="text-2xl font-bold text-purple-600">¥{{ stats.avgBalance.toFixed(2) }}</div></div>
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-orange-100 rounded-lg"><CreditCard class="w-6 h-6 text-orange-600" /></div>
          <div><div class="text-sm text-gray-500">最高余额</div><div class="text-2xl font-bold text-orange-600">¥{{ stats.maxBalance.toFixed(2) }}</div></div>
        </div>
      </div>
    </div>
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="p-4 border-b"><h3 class="font-bold text-gray-800">会员余额明细</h3></div>
      <table class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">会员</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">手机号</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">等级</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">余额</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">积分</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="user in userStore.members" :key="user.id" class="hover:bg-gray-50">
            <td class="px-4 py-3"><div class="flex items-center gap-2"><div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"><span class="text-blue-600 font-medium text-sm">{{ user.name[0] }}</span></div><span class="font-medium">{{ user.name }}</span></div></td>
            <td class="px-4 py-3 text-gray-600">{{ user.phone }}</td>
            <td class="px-4 py-3"><span class="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">Lv.{{ user.level }}</span></td>
            <td class="px-4 py-3 font-medium text-green-600">¥{{ user.balance.toFixed(2) }}</td>
            <td class="px-4 py-3 text-orange-600">{{ user.points }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="userStore.members.length === 0" class="py-12 text-center text-gray-400">暂无会员数据</div>
    </div>
  </div>
</template>
