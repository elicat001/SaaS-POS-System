<script setup lang="ts">
import { ref } from 'vue'
import { Cog, Save, Shield, Database, Globe } from 'lucide-vue-next'
import { Button, Input } from '@/components/ui'
import { useNotificationStore } from '@/stores/notification'

const notification = useNotificationStore()

const settings = ref({
  siteName: 'SaaS POS System',
  language: 'zh-CN',
  timezone: 'Asia/Shanghai',
  currency: 'CNY',
  taxRate: 0,
  autoBackup: true,
  backupFrequency: 'daily',
  sessionTimeout: 30,
  maxLoginAttempts: 5,
})

function save() {
  notification.success('系统设置保存成功')
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold text-gray-800">系统设置</h1>
      <Button variant="primary" @click="save"><Save class="w-4 h-4" />保存</Button>
    </div>
    <div class="grid gap-4">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-3 bg-emerald-100 rounded-lg"><Globe class="w-6 h-6 text-emerald-600" /></div>
          <div><h2 class="font-bold text-gray-800">基本设置</h2><p class="text-sm text-gray-500">系统基本配置</p></div>
        </div>
        <div class="grid grid-cols-2 gap-4 max-w-2xl">
          <Input v-model="settings.siteName" label="系统名称" />
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">语言</label>
            <select v-model="settings.language" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="zh-CN">简体中文</option>
              <option value="en-US">English</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">时区</label>
            <select v-model="settings.timezone" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="Asia/Shanghai">中国标准时间</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">货币</label>
            <select v-model="settings.currency" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="CNY">人民币 (CNY)</option>
              <option value="USD">美元 (USD)</option>
            </select>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-3 bg-green-100 rounded-lg"><Database class="w-6 h-6 text-green-600" /></div>
          <div><h2 class="font-bold text-gray-800">数据备份</h2><p class="text-sm text-gray-500">自动备份设置</p></div>
        </div>
        <div class="space-y-4 max-w-xl">
          <label class="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
            <div><p class="font-medium">自动备份</p><p class="text-sm text-gray-500">定期自动备份数据</p></div>
            <input type="checkbox" v-model="settings.autoBackup" class="w-5 h-5 text-emerald-600 rounded" />
          </label>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">备份频率</label>
            <select v-model="settings.backupFrequency" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="daily">每天</option>
              <option value="weekly">每周</option>
              <option value="monthly">每月</option>
            </select>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-3 bg-red-100 rounded-lg"><Shield class="w-6 h-6 text-red-600" /></div>
          <div><h2 class="font-bold text-gray-800">安全设置</h2><p class="text-sm text-gray-500">账号安全配置</p></div>
        </div>
        <div class="grid grid-cols-2 gap-4 max-w-2xl">
          <Input v-model="settings.sessionTimeout" type="number" label="会话超时(分钟)" />
          <Input v-model="settings.maxLoginAttempts" type="number" label="最大登录尝试次数" />
        </div>
      </div>
    </div>
  </div>
</template>
