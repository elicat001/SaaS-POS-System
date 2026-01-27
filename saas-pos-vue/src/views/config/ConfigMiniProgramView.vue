<script setup lang="ts">
import { ref } from 'vue'
import { Smartphone, Save } from 'lucide-vue-next'
import { Button, Input } from '@/components/ui'
import { useNotificationStore } from '@/stores/notification'

const notification = useNotificationStore()

const config = ref({
  appId: 'wx123456789',
  appSecret: '******',
  name: '我的小程序',
  logo: '',
  description: '一个优秀的餐饮小程序',
})

function save() {
  notification.success('配置保存成功')
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold text-gray-800">小程序设置</h1>
      <Button variant="primary" @click="save"><Save class="w-4 h-4" />保存</Button>
    </div>
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-green-100 rounded-lg"><Smartphone class="w-6 h-6 text-green-600" /></div>
        <div><h2 class="font-bold text-gray-800">微信小程序配置</h2><p class="text-sm text-gray-500">配置您的微信小程序基本信息</p></div>
      </div>
      <div class="grid gap-4 max-w-xl">
        <Input v-model="config.appId" label="AppID" placeholder="微信小程序AppID" />
        <Input v-model="config.appSecret" label="AppSecret" type="password" placeholder="微信小程序AppSecret" />
        <Input v-model="config.name" label="小程序名称" placeholder="请输入小程序名称" />
        <Input v-model="config.logo" label="Logo URL" placeholder="https://..." />
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">小程序简介</label>
          <textarea v-model="config.description" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="请输入小程序简介"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>
