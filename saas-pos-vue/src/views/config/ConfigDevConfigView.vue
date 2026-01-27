<script setup lang="ts">
import { ref } from 'vue'
import { Code, Save, Key, Database, Globe } from 'lucide-vue-next'
import { Button, Input } from '@/components/ui'
import { useNotificationStore } from '@/stores/notification'

const notification = useNotificationStore()

const config = ref({
  apiBaseUrl: 'http://localhost:8000/api',
  debugMode: false,
  logLevel: 'info',
  webhookUrl: '',
  apiKey: '******',
})

function save() {
  notification.success('开发配置保存成功')
}

function regenerateApiKey() {
  config.value.apiKey = 'sk_' + Math.random().toString(36).substring(2, 15)
  notification.success('API Key 已重新生成')
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold text-gray-800">开发配置</h1>
      <Button variant="primary" @click="save"><Save class="w-4 h-4" />保存</Button>
    </div>
    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <p class="text-sm text-yellow-700"><strong>注意：</strong>此页面包含敏感配置，请谨慎修改。</p>
    </div>
    <div class="grid gap-4">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-3 bg-blue-100 rounded-lg"><Globe class="w-6 h-6 text-blue-600" /></div>
          <div><h2 class="font-bold text-gray-800">API 配置</h2><p class="text-sm text-gray-500">后端接口配置</p></div>
        </div>
        <div class="space-y-4 max-w-xl">
          <Input v-model="config.apiBaseUrl" label="API Base URL" placeholder="http://localhost:8000/api" />
          <Input v-model="config.webhookUrl" label="Webhook URL" placeholder="https://..." />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-3 bg-orange-100 rounded-lg"><Key class="w-6 h-6 text-orange-600" /></div>
          <div><h2 class="font-bold text-gray-800">API 密钥</h2><p class="text-sm text-gray-500">用于第三方集成的 API 密钥</p></div>
        </div>
        <div class="flex gap-4 max-w-xl">
          <Input v-model="config.apiKey" label="API Key" type="password" class="flex-1" />
          <div class="pt-6"><Button variant="outline" @click="regenerateApiKey">重新生成</Button></div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-3 bg-purple-100 rounded-lg"><Database class="w-6 h-6 text-purple-600" /></div>
          <div><h2 class="font-bold text-gray-800">调试设置</h2><p class="text-sm text-gray-500">开发调试配置</p></div>
        </div>
        <div class="space-y-4 max-w-xl">
          <label class="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
            <div><p class="font-medium">调试模式</p><p class="text-sm text-gray-500">启用详细的控制台日志</p></div>
            <input type="checkbox" v-model="config.debugMode" class="w-5 h-5 text-blue-600 rounded" />
          </label>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">日志级别</label>
            <select v-model="config.logLevel" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="error">Error</option>
              <option value="warn">Warn</option>
              <option value="info">Info</option>
              <option value="debug">Debug</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
