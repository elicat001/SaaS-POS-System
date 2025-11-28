/**
 * 应用主入口 - 重构后使用Context API进行状态管理
 */

import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AppProvider, useApp } from './contexts/AppContext';

// Layout Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';

// Page Components
import Dashboard from './components/Dashboard';
import POS from './components/POS';
import AIAssistant from './components/AIAssistant';
import ProductList from './components/ProductList';
import OrderList from './components/OrderList';
import UserList from './components/UserList';
import TableManagement from './components/TableManagement';
import CashierManagement from './components/CashierManagement';
import BalanceStatistics from './components/BalanceStatistics';
import TableStatistics from './components/TableStatistics';
import CommissionStatistics from './components/CommissionStatistics';
import InventoryManagement from './components/InventoryManagement';
import SalesSummary from './components/SalesSummary';
import Reports from './components/Reports';
import CategorySettings from './components/CategorySettings';

// Config Components
import ConfigMiniProgram from './components/ConfigMiniProgram';
import ConfigStoreSettings from './components/ConfigStoreSettings';
import ConfigOrderNotify from './components/ConfigOrderNotify';
import ConfigMiniProgramHelper from './components/ConfigMiniProgramHelper';
import ConfigInterfaceSettings from './components/ConfigInterfaceSettings';
import ConfigTemplateGallery from './components/ConfigTemplateGallery';
import ConfigSystemSettings from './components/ConfigSystemSettings';
import ConfigThirdPartyDelivery from './components/ConfigThirdPartyDelivery';
import ConfigPrinterSettings from './components/ConfigPrinterSettings';
import ConfigTableCode from './components/ConfigTableCode';
import ConfigDevConfig from './components/ConfigDevConfig';

// Other Components
import CarouselAds from './components/CarouselAds';
import Marketing from './components/Marketing';
import AppCenter from './components/AppCenter';
import AuxCustomerService from './components/AuxCustomerService';
import AuxLogistics from './components/AuxLogistics';
import AuxExternalDomain from './components/AuxExternalDomain';

// UI Components
import { PageLoading } from './components/ui/Loading';

// Types
import { StockTransactionType } from './types';

/**
 * 主布局组件 - 包含侧边栏和头部
 */
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#f1f5f9] font-sans">
      <Header />
      <Sidebar />
      <main className="pt-14 pl-56 min-h-screen transition-all duration-300">
        <div className="p-6 min-w-[1000px]">
          {children}
        </div>
      </main>
    </div>
  );
};

/**
 * 应用路由组件
 */
const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    products, tables, orders, suppliers, stockLogs,
    loading, initializeData,
    updateProduct, updateStock, createOrder, addSupplier
  } = useApp();

  // 初始化数据
  useEffect(() => {
    if (isAuthenticated) {
      initializeData();
    }
  }, [isAuthenticated, initializeData]);

  // 认证加载中
  if (authLoading) {
    return <PageLoading message="验证登录状态..." fullScreen />;
  }

  // 数据加载中（仅在已认证时显示）
  if (isAuthenticated && loading.global) {
    return (
      <MainLayout>
        <PageLoading message="加载数据中..." />
      </MainLayout>
    );
  }

  return (
    <Routes>
      {/* 登录页面 */}
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/" replace /> : <Login />
      } />

      {/* 受保护的路由 */}
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout>
            <Dashboard orders={orders} />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/sales-summary" element={
        <ProtectedRoute>
          <MainLayout>
            <SalesSummary />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/reports" element={
        <ProtectedRoute>
          <MainLayout>
            <Reports />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/pos" element={
        <ProtectedRoute>
          <MainLayout>
            <POS
              tables={tables}
              products={products}
              onPlaceOrder={(tableId, items, total) => {
                createOrder(tableId, items, total, 'DINE_IN');
              }}
            />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/products" element={
        <ProtectedRoute>
          <MainLayout>
            <ProductList products={products} onUpdateProduct={updateProduct} />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/orders" element={
        <ProtectedRoute>
          <MainLayout>
            <OrderList />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/users" element={
        <ProtectedRoute>
          <MainLayout>
            <UserList />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/table-mgmt" element={
        <ProtectedRoute>
          <MainLayout>
            <TableManagement />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/cashier" element={
        <ProtectedRoute>
          <MainLayout>
            <CashierManagement />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/table-stats" element={
        <ProtectedRoute>
          <MainLayout>
            <TableStatistics />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/balance-stats" element={
        <ProtectedRoute>
          <MainLayout>
            <BalanceStatistics />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/commission-stats" element={
        <ProtectedRoute>
          <MainLayout>
            <CommissionStatistics />
          </MainLayout>
        </ProtectedRoute>
      } />

      {/* 库存管理 */}
      <Route path="/inventory" element={
        <ProtectedRoute>
          <MainLayout>
            <InventoryManagement
              products={products}
              suppliers={suppliers}
              logs={stockLogs}
              onUpdateStock={updateStock}
              onAddSupplier={addSupplier}
              onUpdateProduct={updateProduct}
            />
          </MainLayout>
        </ProtectedRoute>
      } />

      {/* 配置路由 */}
      <Route path="/config/miniprogram" element={
        <ProtectedRoute>
          <MainLayout><ConfigMiniProgram /></MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/config/store" element={
        <ProtectedRoute>
          <MainLayout><ConfigStoreSettings /></MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/config/notify" element={
        <ProtectedRoute>
          <MainLayout><ConfigOrderNotify /></MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/config/helper" element={
        <ProtectedRoute>
          <MainLayout><ConfigMiniProgramHelper /></MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/config/interface" element={
        <ProtectedRoute>
          <MainLayout><ConfigInterfaceSettings /></MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/config/templates" element={
        <ProtectedRoute>
          <MainLayout><ConfigTemplateGallery /></MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/config/system" element={
        <ProtectedRoute>
          <MainLayout><ConfigSystemSettings /></MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/config/delivery" element={
        <ProtectedRoute>
          <MainLayout><ConfigThirdPartyDelivery /></MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/config/printer" element={
        <ProtectedRoute>
          <MainLayout><ConfigPrinterSettings /></MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/config/tablecode" element={
        <ProtectedRoute>
          <MainLayout><ConfigTableCode /></MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/config/dev" element={
        <ProtectedRoute>
          <MainLayout><ConfigDevConfig /></MainLayout>
        </ProtectedRoute>
      } />

      {/* 其他路由 */}
      <Route path="/ads" element={
        <ProtectedRoute>
          <MainLayout><CarouselAds /></MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/marketing" element={
        <ProtectedRoute>
          <MainLayout><Marketing /></MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/apps" element={
        <ProtectedRoute>
          <MainLayout><AppCenter /></MainLayout>
        </ProtectedRoute>
      } />

      {/* 辅助功能路由 */}
      <Route path="/aux/service" element={
        <ProtectedRoute>
          <MainLayout><AuxCustomerService /></MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/aux/logistics" element={
        <ProtectedRoute>
          <MainLayout><AuxLogistics /></MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/aux/domain" element={
        <ProtectedRoute>
          <MainLayout><AuxExternalDomain /></MainLayout>
        </ProtectedRoute>
      } />

      {/* 分类设置 */}
      <Route path="/categories" element={
        <ProtectedRoute>
          <MainLayout>
            <CategorySettings products={products} />
          </MainLayout>
        </ProtectedRoute>
      } />

      {/* AI洞察 */}
      <Route path="/ai-insight" element={
        <ProtectedRoute>
          <MainLayout>
            <AIAssistant orders={orders} />
          </MainLayout>
        </ProtectedRoute>
      } />

      {/* 404重定向 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

/**
 * 应用主组件 - 包装所有Provider
 */
const App: React.FC = () => {
  return (
    <Router>
      <NotificationProvider>
        <AuthProvider>
          <AppProvider>
            <AppRoutes />
          </AppProvider>
        </AuthProvider>
      </NotificationProvider>
    </Router>
  );
};

export default App;
