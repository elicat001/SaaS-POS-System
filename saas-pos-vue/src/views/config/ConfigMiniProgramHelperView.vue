<script setup lang="ts">
import { Settings, Download, RefreshCw, ExternalLink } from 'lucide-vue-next'
import { Button } from '@/components/ui'
import { useNotificationStore } from '@/stores/notification'

const notification = useNotificationStore()

function downloadCode() {
  notification.info('小程序代码包下载中...')
}

function syncData() {
  notification.success('数据同步成功')
}
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-xl font-bold text-gray-800">小程序助手</h1>
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-3 bg-emerald-100 rounded-lg"><Download class="w-6 h-6 text-emerald-600" /></div>
          <div><h3 class="font-bold text-gray-800">代码包下载</h3><p class="text-sm text-gray-500">下载最新的小程序代码包</p></div>
        </div>
        <Button variant="outline" @click="downloadCode"><Download class="w-4 h-4" />下载代码包</Button>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-3 bg-green-100 rounded-lg"><RefreshCw class="w-6 h-6 text-green-600" /></div>
          <div><h3 class="font-bold text-gray-800">数据同步</h3><p class="text-sm text-gray-500">同步商品和订单数据到小程序</p></div>
        </div>
        <Button variant="outline" @click="syncData"><RefreshCw class="w-4 h-4" />立即同步</Button>
      </div>
    </div>
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex items-center gap-3 mb-4">
        <div class="p-3 bg-purple-100 rounded-lg"><ExternalLink class="w-6 h-6 text-purple-600" /></div>
        <div><h3 class="font-bold text-gray-800">快捷链接</h3><p class="text-sm text-gray-500">常用管理入口</p></div>
      </div>
      <div class="grid grid-cols-3 gap-4">
        <a href="#" class="p-4 border rounded-lg hover:bg-gray-50 text-center"><p class="font-medium">微信公众平台</p><p class="text-sm text-gray-500">管理小程序</p></a>
        <a href="#" class="p-4 border rounded-lg hover:bg-gray-50 text-center"><p class="font-medium">开发文档</p><p class="text-sm text-gray-500">查看API文档</p></a>
        <a href="#" class="p-4 border rounded-lg hover:bg-gray-50 text-center"><p class="font-medium">技术支持</p><p class="text-sm text-gray-500">联系客服</p></a>
      </div>
    </div>
  </div>
</template>
