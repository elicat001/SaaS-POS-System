import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Lazy load views
const LoginView = () => import('@/views/LoginView.vue')
const DashboardView = () => import('@/views/DashboardView.vue')
const POSView = () => import('@/views/POSView.vue')
const ProductListView = () => import('@/views/ProductListView.vue')
const OrderListView = () => import('@/views/OrderListView.vue')
const UserListView = () => import('@/views/UserListView.vue')
const TableManagementView = () => import('@/views/TableManagementView.vue')
const InventoryView = () => import('@/views/InventoryView.vue')
const SalesSummaryView = () => import('@/views/SalesSummaryView.vue')
const ReportsView = () => import('@/views/ReportsView.vue')
const TableStatisticsView = () => import('@/views/TableStatisticsView.vue')
const BalanceStatisticsView = () => import('@/views/BalanceStatisticsView.vue')
const CommissionStatisticsView = () => import('@/views/CommissionStatisticsView.vue')
const CashierManagementView = () => import('@/views/CashierManagementView.vue')
const MarketingView = () => import('@/views/MarketingView.vue')
const CategorySettingsView = () => import('@/views/CategorySettingsView.vue')

// Config views
const ConfigMiniProgramView = () => import('@/views/config/ConfigMiniProgramView.vue')
const ConfigStoreSettingsView = () => import('@/views/config/ConfigStoreSettingsView.vue')
const ConfigOrderNotifyView = () => import('@/views/config/ConfigOrderNotifyView.vue')
const ConfigMiniProgramHelperView = () => import('@/views/config/ConfigMiniProgramHelperView.vue')
const ConfigInterfaceSettingsView = () => import('@/views/config/ConfigInterfaceSettingsView.vue')
const ConfigTemplateGalleryView = () => import('@/views/config/ConfigTemplateGalleryView.vue')
const ConfigSystemSettingsView = () => import('@/views/config/ConfigSystemSettingsView.vue')
const ConfigThirdPartyDeliveryView = () => import('@/views/config/ConfigThirdPartyDeliveryView.vue')
const ConfigPrinterSettingsView = () => import('@/views/config/ConfigPrinterSettingsView.vue')
const ConfigTableCodeView = () => import('@/views/config/ConfigTableCodeView.vue')
const ConfigDevConfigView = () => import('@/views/config/ConfigDevConfigView.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: '/pos',
    name: 'POS',
    component: POSView,
    meta: { requiresAuth: true },
  },
  {
    path: '/products',
    name: 'Products',
    component: ProductListView,
    meta: { requiresAuth: true },
  },
  {
    path: '/orders',
    name: 'Orders',
    component: OrderListView,
    meta: { requiresAuth: true },
  },
  {
    path: '/users',
    name: 'Users',
    component: UserListView,
    meta: { requiresAuth: true },
  },
  {
    path: '/table-mgmt',
    name: 'TableManagement',
    component: TableManagementView,
    meta: { requiresAuth: true },
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: InventoryView,
    meta: { requiresAuth: true },
  },
  {
    path: '/sales-summary',
    name: 'SalesSummary',
    component: SalesSummaryView,
    meta: { requiresAuth: true },
  },
  {
    path: '/reports',
    name: 'Reports',
    component: ReportsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/table-stats',
    name: 'TableStatistics',
    component: TableStatisticsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/balance-stats',
    name: 'BalanceStatistics',
    component: BalanceStatisticsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/commission-stats',
    name: 'CommissionStatistics',
    component: CommissionStatisticsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/cashier',
    name: 'Cashier',
    component: CashierManagementView,
    meta: { requiresAuth: true },
  },
  {
    path: '/marketing',
    name: 'Marketing',
    component: MarketingView,
    meta: { requiresAuth: true },
  },
  {
    path: '/categories',
    name: 'Categories',
    component: CategorySettingsView,
    meta: { requiresAuth: true },
  },
  // Config routes
  {
    path: '/config/miniprogram',
    name: 'ConfigMiniProgram',
    component: ConfigMiniProgramView,
    meta: { requiresAuth: true },
  },
  {
    path: '/config/store',
    name: 'ConfigStore',
    component: ConfigStoreSettingsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/config/notify',
    name: 'ConfigNotify',
    component: ConfigOrderNotifyView,
    meta: { requiresAuth: true },
  },
  {
    path: '/config/helper',
    name: 'ConfigHelper',
    component: ConfigMiniProgramHelperView,
    meta: { requiresAuth: true },
  },
  {
    path: '/config/interface',
    name: 'ConfigInterface',
    component: ConfigInterfaceSettingsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/config/templates',
    name: 'ConfigTemplates',
    component: ConfigTemplateGalleryView,
    meta: { requiresAuth: true },
  },
  {
    path: '/config/system',
    name: 'ConfigSystem',
    component: ConfigSystemSettingsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/config/delivery',
    name: 'ConfigDelivery',
    component: ConfigThirdPartyDeliveryView,
    meta: { requiresAuth: true },
  },
  {
    path: '/config/printer',
    name: 'ConfigPrinter',
    component: ConfigPrinterSettingsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/config/tablecode',
    name: 'ConfigTableCode',
    component: ConfigTableCodeView,
    meta: { requiresAuth: true },
  },
  {
    path: '/config/dev',
    name: 'ConfigDev',
    component: ConfigDevConfigView,
    meta: { requiresAuth: true },
  },
  // Catch all - redirect to dashboard
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// Navigation guard
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()

  // Check if route requires auth
  if (to.meta.requiresAuth !== false && !authStore.isAuthenticated) {
    next({ name: 'Login' })
  } else if (to.name === 'Login' && authStore.isAuthenticated) {
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router
