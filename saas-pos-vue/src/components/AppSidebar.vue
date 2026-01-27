<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  LayoutDashboard, ShoppingCart, Package, ClipboardList,
  Users, Table2, Warehouse, BarChart3, FileText, Calculator,
  Wallet, Percent, Megaphone, FolderTree, Settings,
  Store, Bell, Smartphone, Palette, Layout, Cog,
  Truck, Printer, QrCode, Code
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

interface MenuItem {
  name: string
  path: string
  icon: any
  children?: MenuItem[]
}

const menuItems: MenuItem[] = [
  { name: '仪表盘', path: '/', icon: LayoutDashboard },
  { name: 'POS 收银', path: '/pos', icon: ShoppingCart },
  { name: '商品管理', path: '/products', icon: Package },
  { name: '订单列表', path: '/orders', icon: ClipboardList },
  { name: '用户管理', path: '/users', icon: Users },
  { name: '桌台管理', path: '/table-mgmt', icon: Table2 },
  { name: '库存管理', path: '/inventory', icon: Warehouse },
  { name: '销售汇总', path: '/sales-summary', icon: BarChart3 },
  { name: '报表中心', path: '/reports', icon: FileText },
  { name: '收银管理', path: '/cashier', icon: Calculator },
  { name: '桌台统计', path: '/table-stats', icon: Table2 },
  { name: '余额统计', path: '/balance-stats', icon: Wallet },
  { name: '佣金统计', path: '/commission-stats', icon: Percent },
  { name: '营销中心', path: '/marketing', icon: Megaphone },
  { name: '分类设置', path: '/categories', icon: FolderTree },
]

const configItems: MenuItem[] = [
  { name: '小程序设置', path: '/config/miniprogram', icon: Smartphone },
  { name: '店铺设置', path: '/config/store', icon: Store },
  { name: '订单通知', path: '/config/notify', icon: Bell },
  { name: '小程序助手', path: '/config/helper', icon: Settings },
  { name: '界面装修', path: '/config/interface', icon: Palette },
  { name: '模板库', path: '/config/templates', icon: Layout },
  { name: '系统设置', path: '/config/system', icon: Cog },
  { name: '第三方配送', path: '/config/delivery', icon: Truck },
  { name: '打印设置', path: '/config/printer', icon: Printer },
  { name: '桌码设置', path: '/config/tablecode', icon: QrCode },
  { name: '开发配置', path: '/config/dev', icon: Code },
]

const isActive = (path: string) => {
  return route.path === path
}

function navigateTo(path: string) {
  router.push(path)
}
</script>

<template>
  <aside class="fixed left-0 top-14 bottom-0 w-56 bg-white border-r border-gray-200 overflow-y-auto z-40">
    <nav class="py-4">
      <!-- Main menu -->
      <div class="px-3 mb-4">
        <h3 class="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          主菜单
        </h3>
        <ul class="space-y-1">
          <li v-for="item in menuItems" :key="item.path">
            <button
              @click="navigateTo(item.path)"
              :class="[
                'w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors',
                isActive(item.path)
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
            >
              <component :is="item.icon" class="w-5 h-5" />
              <span>{{ item.name }}</span>
            </button>
          </li>
        </ul>
      </div>

      <!-- Config menu -->
      <div class="px-3 border-t border-gray-100 pt-4">
        <h3 class="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          系统配置
        </h3>
        <ul class="space-y-1">
          <li v-for="item in configItems" :key="item.path">
            <button
              @click="navigateTo(item.path)"
              :class="[
                'w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors',
                isActive(item.path)
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
            >
              <component :is="item.icon" class="w-5 h-5" />
              <span>{{ item.name }}</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  </aside>
</template>
