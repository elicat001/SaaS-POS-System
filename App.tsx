
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import POS from './components/POS';
import AIAssistant from './components/AIAssistant';
import ProductList from './components/ProductList';
import OrderList from './components/OrderList';
import UserList from './components/UserList';
import EmployeeList from './components/EmployeeList';
import TableManagement from './components/TableManagement';
import CashierManagement from './components/CashierManagement';
import BalanceStatistics from './components/BalanceStatistics';
import TableStatistics from './components/TableStatistics';
import CommissionStatistics from './components/CommissionStatistics';
import ConfigMiniProgram from './components/ConfigMiniProgram';
import ConfigStoreSettings from './components/ConfigStoreSettings';
import ConfigOrderNotify from './components/ConfigOrderNotify';
import ConfigMiniProgramHelper from './components/ConfigMiniProgramHelper';
import ConfigInterfaceSettings from './components/ConfigInterfaceSettings';
import ConfigSecondaryPages from './components/ConfigSecondaryPages';
import ConfigTemplateGallery from './components/ConfigTemplateGallery';
import ConfigSystemSettings from './components/ConfigSystemSettings';
import ConfigThirdPartyDelivery from './components/ConfigThirdPartyDelivery';
import ConfigPrinterSettings from './components/ConfigPrinterSettings';
import ConfigTableCode from './components/ConfigTableCode';
import ConfigBigScreen from './components/ConfigBigScreen';
import ConfigDevConfig from './components/ConfigDevConfig';
import CarouselAds from './components/CarouselAds';
import Marketing from './components/Marketing';
import AppCenter from './components/AppCenter';
import AuxCustomerService from './components/AuxCustomerService';
import AuxLogistics from './components/AuxLogistics';
import AuxExternalDomain from './components/AuxExternalDomain';
import InventoryManagement from './components/InventoryManagement';
import SalesSummary from './components/SalesSummary';
import Reports from './components/Reports';
import CategorySettings from './components/CategorySettings';

import { INITIAL_TABLES, MOCK_ORDERS, INITIAL_PRODUCTS, MOCK_SUPPLIERS, MOCK_STOCK_LOGS } from './constants';
import { Order, Table, CartItem, OrderStatus, TableStatus, Product, Supplier, StockLog, StockTransactionType } from './types';

const App: React.FC = () => {
  // Global State
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  
  // Inventory State (Lifted Up)
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [stockLogs, setStockLogs] = useState<StockLog[]>(MOCK_STOCK_LOGS);

  // Centralized Stock Update Logic
  const handleStockUpdate = (productId: string, delta: number, type: StockTransactionType, note?: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // 1. Create Log
    const newLog: StockLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      productId,
      productName: product.name,
      type,
      delta,
      currentStock: product.stock + delta,
      operator: '当前用户', // In a real app, get from auth context
      timestamp: Date.now(),
      note
    };
    setStockLogs(prev => [newLog, ...prev]);

    // 2. Update Product Stock
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: p.stock + delta } : p));
  };

  const handlePlaceOrder = (tableId: string, items: CartItem[], total: number) => {
    // 1. Calculate Total Cost for Profit Analytics
    const totalCost = items.reduce((sum, item) => {
        const product = products.find(p => p.id === item.id);
        return sum + ((product?.costPrice || 0) * item.quantity);
    }, 0);

    // 2. Create Order
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNo: `${Date.now()}`,
      tableId,
      items,
      total,
      totalCost, // Store cost basis
      status: OrderStatus.PENDING,
      timestamp: Date.now(),
      type: 'DINE_IN'
    };

    setOrders(prev => [newOrder, ...prev]);

    // 3. Update Table Status
    setTables(prev => prev.map(t => 
      t.id === tableId ? { ...t, status: TableStatus.SCANNED, currentOrderId: newOrder.id } : t
    ));

    // 4. Deduct Inventory
    items.forEach(item => {
      handleStockUpdate(
        item.id, 
        -item.quantity, 
        StockTransactionType.OUT_SALE, 
        `订单销售: ${newOrder.orderNo}`
      );
    });
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#f1f5f9] font-sans">
        <Header />
        <Sidebar />
        
        {/* Main Content Wrapper */}
        <main className="pt-14 pl-56 min-h-screen transition-all duration-300">
          <div className="p-6 min-w-[1000px]">
            <Routes>
              <Route path="/" element={<Dashboard orders={orders} />} />
              <Route path="/sales-summary" element={<SalesSummary />} />
              <Route path="/reports" element={<Reports />} />
              
              <Route path="/pos" element={<POS tables={tables} products={products} onPlaceOrder={handlePlaceOrder} />} />
              <Route path="/products" element={<ProductList products={products} onUpdateProduct={handleUpdateProduct} />} />
              <Route path="/orders" element={<OrderList />} />
              <Route path="/users" element={<UserList />} />
              <Route path="/employees" element={<EmployeeList />} />
              <Route path="/table-mgmt" element={<TableManagement />} />
              <Route path="/cashier" element={<CashierManagement />} />
              
              <Route path="/table-stats" element={<TableStatistics />} />
              <Route path="/balance-stats" element={<BalanceStatistics />} />
              <Route path="/commission-stats" element={<CommissionStatistics />} />
              
              {/* Inventory Route */}
              <Route path="/inventory" element={
                <InventoryManagement 
                  products={products} 
                  suppliers={suppliers} 
                  logs={stockLogs}
                  onUpdateStock={handleStockUpdate}
                  onAddSupplier={(sup) => setSuppliers([...suppliers, sup])}
                  onUpdateProduct={handleUpdateProduct}
                />
              } />
              
              {/* Configuration Routes */}
              <Route path="/config/miniprogram" element={<ConfigMiniProgram />} />
              <Route path="/config/store" element={<ConfigStoreSettings />} />
              <Route path="/config/notify" element={<ConfigOrderNotify />} />
              <Route path="/config/helper" element={<ConfigMiniProgramHelper />} />
              <Route path="/config/interface" element={<ConfigInterfaceSettings />} />
              <Route path="/config/secondary-pages" element={<ConfigSecondaryPages />} />
              <Route path="/config/templates" element={<ConfigTemplateGallery />} />
              <Route path="/config/system" element={<ConfigSystemSettings />} />
              <Route path="/config/delivery" element={<ConfigThirdPartyDelivery />} />
              <Route path="/config/printer" element={<ConfigPrinterSettings />} />
              <Route path="/config/tablecode" element={<ConfigTableCode />} />
              <Route path="/config/bigscreen" element={<ConfigBigScreen />} />
              <Route path="/config/dev" element={<ConfigDevConfig />} />
              
              {/* Other Routes */}
              <Route path="/ads" element={<CarouselAds />} />
              <Route path="/marketing" element={<Marketing />} />
              <Route path="/apps" element={<AppCenter />} />
              
              {/* Auxiliary Routes */}
              <Route path="/aux/service" element={<AuxCustomerService />} />
              <Route path="/aux/logistics" element={<AuxLogistics />} />
              <Route path="/aux/domain" element={<AuxExternalDomain />} />
              
              {/* Replaced Placeholder Route */}
              <Route path="/categories" element={<CategorySettings products={products} />} />
              
              <Route path="/ai-insight" element={<AIAssistant orders={orders} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;
