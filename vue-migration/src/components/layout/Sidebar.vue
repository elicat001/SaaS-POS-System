<template>
  <div class="w-56 bg-white h-[calc(100vh-3.5rem)] fixed left-0 top-14 shadow-[2px_0_8px_rgba(0,0,0,0.04)] flex flex-col overflow-y-auto z-40 pb-10">
    <div class="py-2">
      <div v-for="item in menuItems" :key="item.title">
        <!-- 直接链接的菜单项 -->
        <router-link
          v-if="!item.subItems || item.subItems.length === 0"
          :to="item.path!"
          :class="[
            'w-full flex items-center justify-between px-5 py-3.5 text-[14px] font-medium transition-all',
            isActiveDirect(item) 
              ? 'text-emerald-500 bg-emerald-50/50 border-r-[3px] border-emerald-500' 
              : 'text-slate-600 hover:text-emerald-500 hover:bg-slate-50'
          ]"
        >
          <div class="flex items-center gap-3">
            <component :is="item.icon" :size="18" :stroke-width="2" />
            <span>{{ item.title }}</span>
          </div>
        </router-link>

        <!-- 有子菜单的菜单项 -->
        <button
          v-else
          @click="toggleMenu(item.title)"
          :class="[
            'w-full flex items-center justify-between px-5 py-3.5 text-[14px] font-medium transition-all',
            (expandedMenu === item.title || isChildActive(item)) 
              ? 'text-emerald-500' 
              : 'text-slate-600 hover:text-emerald-500 hover:bg-slate-50'
          ]"
        >
          <div class="flex items-center gap-3">
            <component :is="item.icon" :size="18" :stroke-width="2" />
            <span>{{ item.title }}</span>
          </div>
          <ChevronDown v-if="expandedMenu === item.title" :size="14" />
          <ChevronRight v-else :size="14" />
        </button>

        <!-- 子菜单 -->
        <div v-if="item.subItems && expandedMenu === item.title" class="bg-white py-1">
          <router-link
            v-for="(sub, idx) in item.subItems"
            :key="idx"
            :to="sub.path"
            :class="[
              'block pl-[3.25rem] pr-4 py-2.5 text-[13px] transition-colors',
              isSubActive(sub.path)
                ? 'text-white bg-emerald-500' 
                : 'text-slate-500 hover:text-emerald-500 hover:bg-slate-50'
            ]"
          >
            {{ sub.label }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { 
  BarChart3, 
  Briefcase, 
  ShoppingBag, 
  FileText, 
  Users, 
  Settings, 
  Megaphone,
  ChevronDown,
  ChevronRight
} from 'lucide-vue-next'

const route = useRoute()
const expandedMenu = ref<string>('配置管理')

interface MenuItem {
  title: string
  icon: any
  path?: string
  subItems?: Array<{
    label: string
    path: string
  }>
}

const menuItems: MenuItem[] = [
  {
    title: '运营数据',
    icon: BarChart3,
    subItems: [
      { label: '数据分析', path: '/' },
      { label: '销售汇总', path: '/sales-summary' },
      { label: '营业报表', path: '/reports' },
      { label: '桌台统计', path: '/table-stats' },
      { label: '余额统计', path: '/balance-stats' },
      { label: '提成统计', path: '/commission-stats' },
    ]
  },
  {
    title: '经营工具',
    icon: Briefcase,
    subItems: [
      { label: '收银管理', path: '/cashier' },
      { label: '桌台管理', path: '/table-mgmt' },
      { label: '代客下单', path: '/pos' },
    ]
  },
  { 
    title: '商品管理', 
    icon: ShoppingBag, 
    subItems: [
      { label: '分类设置', path: '/categories' },
      { label: '商品列表', path: '/products' },
      { label: '进销存', path: '/inventory' },
    ] 
  },
  { title: '订单列表', icon: FileText, path: '/orders' },
  { title: '用户列表', icon: Users, path: '/users' },
  { 
    title: '配置管理', 
    icon: Settings, 
    subItems: [
      { label: '小程序管理', path: '/config/miniprogram' },
      { label: '门店设置', path: '/config/store' },
      { label: '订单提醒', path: '/config/notify' },
      { label: '小程序助手', path: '/config/helper' },
      { label: '界面设置', path: '/config/interface' },
      { label: '行业模板', path: '/config/templates' },
      { label: '系统设置', path: '/config/system' },
      { label: '第三方配送', path: '/config/delivery' },
      { label: '打印机设置', path: '/config/printer' },
      { label: '桌码生成', path: '/config/tablecode' },
      { label: '开发配置', path: '/config/dev' },
    ] 
  },
  { title: '营销管理', icon: Megaphone, path: '/marketing' },
]

const toggleMenu = (title: string) => {
  expandedMenu.value = expandedMenu.value === title ? '' : title
}

const isActiveDirect = (item: MenuItem) => {
  return item.path && route.path === item.path
}

const isChildActive = (item: MenuItem) => {
  return item.subItems?.some(sub => route.path === sub.path)
}

const isSubActive = (path: string) => {
  return route.path === path
}
</script>