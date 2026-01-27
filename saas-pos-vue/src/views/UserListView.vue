<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useNotificationStore } from '@/stores/notification'
import type { User } from '@/types'
import { Plus, Search, Edit2, Trash2, Users, Wallet, Gift } from 'lucide-vue-next'
import { Modal, Button, Input } from '@/components/ui'

const userStore = useUserStore()
const notification = useNotificationStore()

// State
const searchQuery = ref('')
const typeFilter = ref('all')
const showModal = ref(false)
const showRechargeModal = ref(false)
const editingUser = ref<User | null>(null)
const selectedUser = ref<User | null>(null)
const rechargeAmount = ref(0)

// Form state
const form = ref({
  name: '',
  phone: '',
  type: 'NORMAL' as 'MEMBER' | 'NORMAL',
  balance: 0,
  points: 0,
  level: 0,
  joinDate: new Date().toISOString().split('T')[0],
})

// Computed
const filteredUsers = computed(() => {
  let users = userStore.users

  if (typeFilter.value !== 'all') {
    users = users.filter(u => u.type === typeFilter.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    users = users.filter(u =>
      u.name.toLowerCase().includes(query) ||
      u.phone.includes(query)
    )
  }

  return users
})

// Methods
function openCreateModal() {
  editingUser.value = null
  form.value = {
    name: '',
    phone: '',
    type: 'NORMAL',
    balance: 0,
    points: 0,
    level: 0,
    joinDate: new Date().toISOString().split('T')[0],
  }
  showModal.value = true
}

function openEditModal(user: User) {
  editingUser.value = user
  form.value = { ...user }
  showModal.value = true
}

async function saveUser() {
  if (!form.value.name || !form.value.phone) {
    notification.error('请填写完整的用户信息')
    return
  }

  if (editingUser.value) {
    await userStore.updateUser({
      ...editingUser.value,
      ...form.value,
    })
  } else {
    await userStore.createUser(form.value)
  }

  showModal.value = false
}

async function deleteUser(user: User) {
  if (confirm(`确定要删除用户 "${user.name}" 吗？`)) {
    await userStore.deleteUser(user.id)
  }
}

function openRechargeModal(user: User) {
  selectedUser.value = user
  rechargeAmount.value = 0
  showRechargeModal.value = true
}

async function recharge() {
  if (selectedUser.value && rechargeAmount.value > 0) {
    await userStore.addBalance(selectedUser.value.id, rechargeAmount.value)
    showRechargeModal.value = false
  }
}

function getLevelLabel(level: number) {
  const labels = ['普通', '银卡', '金卡', '钻石']
  return labels[level] || '普通'
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold text-gray-800">用户管理</h1>
      <Button variant="primary" @click="openCreateModal">
        <Plus class="w-4 h-4" />
        新增用户
      </Button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-4 gap-4">
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="text-sm text-gray-500 mb-1">总用户数</div>
        <div class="text-2xl font-bold text-gray-800">{{ userStore.users.length }}</div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="text-sm text-gray-500 mb-1">会员数</div>
        <div class="text-2xl font-bold text-emerald-600">{{ userStore.members.length }}</div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="text-sm text-gray-500 mb-1">总余额</div>
        <div class="text-2xl font-bold text-green-600">¥{{ userStore.totalBalance.toFixed(2) }}</div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="text-sm text-gray-500 mb-1">总积分</div>
        <div class="text-2xl font-bold text-orange-600">{{ userStore.totalPoints }}</div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg shadow-sm">
      <div class="flex flex-wrap gap-4">
        <!-- Search -->
        <div class="relative flex-1 min-w-[200px]">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索用户名或手机号..."
            class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <!-- Type filter -->
        <div class="flex gap-2">
          <button
            v-for="option in [
              { value: 'all', label: '全部' },
              { value: 'MEMBER', label: '会员' },
              { value: 'NORMAL', label: '普通' },
            ]"
            :key="option.value"
            @click="typeFilter = option.value"
            :class="[
              'px-3 py-2 text-sm rounded-lg transition-colors',
              typeFilter === option.value
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Users table -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">用户</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">手机号</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">等级</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">余额</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">积分</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">加入日期</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span class="text-emerald-600 font-medium">{{ user.name[0] }}</span>
                </div>
                <span class="font-medium text-gray-800">{{ user.name }}</span>
              </div>
            </td>
            <td class="px-4 py-3 text-sm text-gray-600">{{ user.phone }}</td>
            <td class="px-4 py-3">
              <span
                :class="[
                  'px-2 py-1 text-xs rounded-full',
                  user.type === 'MEMBER'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-gray-100 text-gray-600'
                ]"
              >
                {{ user.type === 'MEMBER' ? '会员' : '普通' }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-600">{{ getLevelLabel(user.level) }}</td>
            <td class="px-4 py-3 text-sm font-medium text-green-600">
              ¥{{ user.balance.toFixed(2) }}
            </td>
            <td class="px-4 py-3 text-sm text-orange-600">{{ user.points }}</td>
            <td class="px-4 py-3 text-sm text-gray-500">{{ user.joinDate }}</td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-1">
                <button
                  @click="openRechargeModal(user)"
                  class="p-1 text-green-600 hover:bg-green-50 rounded"
                  title="充值"
                >
                  <Wallet class="w-4 h-4" />
                </button>
                <button
                  @click="openEditModal(user)"
                  class="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                  title="编辑"
                >
                  <Edit2 class="w-4 h-4" />
                </button>
                <button
                  @click="deleteUser(user)"
                  class="p-1 text-red-600 hover:bg-red-50 rounded"
                  title="删除"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredUsers.length === 0" class="py-12 text-center text-gray-400">
        <Users class="w-12 h-12 mx-auto mb-4" />
        <p>没有找到用户</p>
      </div>
    </div>

    <!-- User Modal -->
    <Modal v-model="showModal" :title="editingUser ? '编辑用户' : '新增用户'">
      <div class="space-y-4">
        <Input v-model="form.name" label="用户名" placeholder="请输入用户名" />
        <Input v-model="form.phone" label="手机号" placeholder="请输入手机号" />
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">用户类型</label>
          <select
            v-model="form.type"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="NORMAL">普通用户</option>
            <option value="MEMBER">会员</option>
          </select>
        </div>
        <div v-if="form.type === 'MEMBER'" class="grid grid-cols-2 gap-4">
          <Input v-model="form.balance" type="number" label="余额" placeholder="0.00" />
          <Input v-model="form.points" type="number" label="积分" placeholder="0" />
        </div>
      </div>

      <template #footer>
        <div class="flex gap-3">
          <Button variant="outline" @click="showModal = false">取消</Button>
          <Button variant="primary" @click="saveUser">保存</Button>
        </div>
      </template>
    </Modal>

    <!-- Recharge Modal -->
    <Modal v-model="showRechargeModal" title="余额充值">
      <div v-if="selectedUser" class="space-y-4">
        <div class="p-4 bg-gray-50 rounded-lg">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <span class="text-emerald-600 font-medium">{{ selectedUser.name[0] }}</span>
            </div>
            <div>
              <p class="font-medium">{{ selectedUser.name }}</p>
              <p class="text-sm text-gray-500">{{ selectedUser.phone }}</p>
            </div>
          </div>
          <div class="text-sm text-gray-600">
            当前余额：<span class="font-medium text-green-600">¥{{ selectedUser.balance.toFixed(2) }}</span>
          </div>
        </div>
        <Input
          v-model="rechargeAmount"
          type="number"
          label="充值金额"
          placeholder="请输入充值金额"
        />
      </div>

      <template #footer>
        <div class="flex gap-3">
          <Button variant="outline" @click="showRechargeModal = false">取消</Button>
          <Button variant="primary" @click="recharge">确认充值</Button>
        </div>
      </template>
    </Modal>
  </div>
</template>
