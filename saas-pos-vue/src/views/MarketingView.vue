<script setup lang="ts">
import { ref } from 'vue'
import { Megaphone, Gift, Ticket, Users, Plus, Edit2, Trash2 } from 'lucide-vue-next'
import { Button, Modal, Input } from '@/components/ui'

const activeTab = ref('coupons')
const showModal = ref(false)

const coupons = ref([
  { id: '1', name: '新用户满减', type: '满减券', value: 10, minSpend: 50, stock: 100, used: 23, status: 'active' },
  { id: '2', name: '周末特惠', type: '折扣券', value: 8, minSpend: 0, stock: 50, used: 12, status: 'active' },
  { id: '3', name: '生日礼券', type: '满减券', value: 20, minSpend: 100, stock: 30, used: 5, status: 'inactive' },
])

const activities = ref([
  { id: '1', name: '双十一大促', startTime: '2024-11-01', endTime: '2024-11-11', status: 'upcoming' },
  { id: '2', name: '会员日', startTime: '2024-10-15', endTime: '2024-10-15', status: 'completed' },
])
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold text-gray-800">营销中心</h1>
      <Button variant="primary" @click="showModal = true"><Plus class="w-4 h-4" />新建活动</Button>
    </div>
    <div class="grid grid-cols-4 gap-4">
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-emerald-100 rounded-lg"><Ticket class="w-6 h-6 text-emerald-600" /></div>
          <div><div class="text-sm text-gray-500">优惠券总数</div><div class="text-2xl font-bold">{{ coupons.length }}</div></div>
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-green-100 rounded-lg"><Gift class="w-6 h-6 text-green-600" /></div>
          <div><div class="text-sm text-gray-500">已发放</div><div class="text-2xl font-bold text-green-600">{{ coupons.reduce((sum, c) => sum + c.used, 0) }}</div></div>
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-purple-100 rounded-lg"><Megaphone class="w-6 h-6 text-purple-600" /></div>
          <div><div class="text-sm text-gray-500">活动数</div><div class="text-2xl font-bold text-purple-600">{{ activities.length }}</div></div>
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-orange-100 rounded-lg"><Users class="w-6 h-6 text-orange-600" /></div>
          <div><div class="text-sm text-gray-500">参与用户</div><div class="text-2xl font-bold text-orange-600">156</div></div>
        </div>
      </div>
    </div>
    <div class="bg-white rounded-lg shadow-sm">
      <div class="flex border-b">
        <button @click="activeTab = 'coupons'" :class="['px-6 py-3 text-sm font-medium border-b-2 transition-colors', activeTab === 'coupons' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500']">优惠券管理</button>
        <button @click="activeTab = 'activities'" :class="['px-6 py-3 text-sm font-medium border-b-2 transition-colors', activeTab === 'activities' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500']">营销活动</button>
      </div>
      <div v-if="activeTab === 'coupons'" class="p-4">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">名称</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">类型</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">面值</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">库存/已用</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">状态</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="coupon in coupons" :key="coupon.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 font-medium">{{ coupon.name }}</td>
              <td class="px-4 py-3 text-gray-600">{{ coupon.type }}</td>
              <td class="px-4 py-3 text-emerald-600">{{ coupon.type === '折扣券' ? coupon.value + '折' : '¥' + coupon.value }}</td>
              <td class="px-4 py-3">{{ coupon.stock }} / {{ coupon.used }}</td>
              <td class="px-4 py-3"><span :class="['px-2 py-1 text-xs rounded-full', coupon.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500']">{{ coupon.status === 'active' ? '启用' : '停用' }}</span></td>
              <td class="px-4 py-3"><div class="flex gap-2"><button class="p-1 text-emerald-600 hover:bg-emerald-50 rounded"><Edit2 class="w-4 h-4" /></button><button class="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 class="w-4 h-4" /></button></div></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="activeTab === 'activities'" class="p-4">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">活动名称</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">开始时间</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">结束时间</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">状态</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="activity in activities" :key="activity.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 font-medium">{{ activity.name }}</td>
              <td class="px-4 py-3 text-gray-600">{{ activity.startTime }}</td>
              <td class="px-4 py-3 text-gray-600">{{ activity.endTime }}</td>
              <td class="px-4 py-3"><span :class="['px-2 py-1 text-xs rounded-full', activity.status === 'upcoming' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500']">{{ activity.status === 'upcoming' ? '即将开始' : '已结束' }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <Modal v-model="showModal" title="新建营销活动">
      <div class="space-y-4">
        <Input label="活动名称" placeholder="请输入活动名称" />
        <div class="grid grid-cols-2 gap-4">
          <div><label class="block text-sm font-medium text-gray-700 mb-1">开始时间</label><input type="date" class="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label class="block text-sm font-medium text-gray-700 mb-1">结束时间</label><input type="date" class="w-full px-3 py-2 border rounded-lg" /></div>
        </div>
      </div>
      <template #footer><div class="flex gap-3"><Button variant="outline" @click="showModal = false">取消</Button><Button variant="primary">创建</Button></div></template>
    </Modal>
  </div>
</template>
