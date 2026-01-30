import type { RouteRecordRaw } from 'vue-router'
import MainLayout from '@/components/layout/MainLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/components/pages/Login.vue'),
    meta: {
      requiresAuth: false,
      title: '登录'
    }
  },
  {
    path: '/',
    component: MainLayout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/components/pages/Dashboard.vue'),
        meta: {
          title: '仪表板'
        }
      },
      {
        path: 'pos',
        name: 'POS',
        component: () => import('@/components/pages/POS.vue'),
        meta: {
          title: 'POS收银'
        }
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('@/components/pages/ProductList.vue'),
        meta: {
          title: '商品管理'
        }
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('@/components/pages/OrderList.vue'),
        meta: {
          title: '订单管理'
        }
      },
      {
        path: 'categories',
        name: 'Categories',
        component: () => import('@/components/pages/CategorySettings.vue'),
        meta: {
          title: '分类设置'
        }
      },
      {
        path: 'inventory',
        name: 'Inventory',
        component: () => import('@/components/pages/InventoryManagement.vue'),
        meta: {
          title: '进销存管理'
        }
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/components/pages/UserList.vue'),
        meta: {
          title: '用户管理'
        }
      },
      {
        path: 'config/interface',
        name: 'ConfigInterface',
        component: () => import('@/components/pages/ConfigInterfaceSettings.vue'),
        meta: {
          title: '界面设置'
        }
      },
      {
        path: 'sales-summary',
        name: 'SalesSummary',
        component: () => import('@/components/pages/SalesSummary.vue'),
        meta: {
          title: '销售汇总'
        }
      },
      {
        path: 'reports',
        name: 'Reports',
        component: () => import('@/components/pages/Reports.vue'),
        meta: {
          title: '营业报表'
        }
      },
      {
        path: 'table-stats',
        name: 'TableStats',
        component: () => import('@/components/pages/TableStats.vue'),
        meta: {
          title: '桌台统计'
        }
      },
      {
        path: 'balance-stats',
        name: 'BalanceStats',
        component: () => import('@/components/pages/BalanceStats.vue'),
        meta: {
          title: '余额统计'
        }
      },
      {
        path: 'commission-stats',
        name: 'CommissionStats',
        component: () => import('@/components/pages/CommissionStats.vue'),
        meta: {
          title: '提成统计'
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

export default routes