
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
import ConfigMiniProgram from './components/ConfigMiniProgram';
import ConfigStoreSettings from './components/ConfigStoreSettings';
import ConfigOrderNotify from './components/ConfigOrderNotify';
import ConfigMiniProgramHelper from './components/ConfigMiniProgramHelper';
import ConfigInterfaceSettings from './components/ConfigInterfaceSettings';
import ConfigSecondaryPages from './components/ConfigSecondaryPages';
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
              <Route path="/pos" element={<POS tables={tables} products={products} onPlaceOrder={handlePlaceOrder} />} />
              <Route path="/products" element={<ProductList products={products} onUpdateProduct={handleUpdateProduct} />} />
              <Route path="/orders" element={<OrderList />} />
              <Route path="/users" element={<UserList />} />
              <Route path="/employees" element={<EmployeeList />} />
              <Route path="/table-mgmt" element={<TableManagement />} />
              <Route path="/cashier" element={<CashierManagement />} />
              <Route path="/balance-stats" element={<BalanceStatistics />} />
              
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
              
              {/* Legacy/Placeholder Routes */}
              <Route path="/sales-summary" element={<div className="p-10 text-center text-slate-500">销售汇总 - 🚧 施工中</div>} />
              <Route path="/reports" element={<div className="p-10 text-center text-slate-500">营业报表 - 🚧 施工中</div>} />
              <Route path="/table-stats" element={<div className="p-10 text-center text-slate-500">桌台统计 - 🚧 施工中</div>} />
              <Route path="/commission-stats" element={<div className="p-10 text-center text-slate-500">提成统计 - 🚧 施工中</div>} />
              <Route path="/credit" element={<div className="p-10 text-center text-slate-500">挂账管理 - 🚧 施工中</div>} />
              <Route path="/handover" element={<div className="p-10 text-center text-slate-500">交接班 - 🚧 施工中</div>} />
              <Route path="/categories" element={<div className="p-10 text-center text-slate-500">分类设置 - 🚧 施工中</div>} />
              <Route path="/stock-warning" element={<div className="p-10 text-center text-slate-500">库存预警 - 🚧 施工中</div>} />
              <Route path="/specs" element={<div className="p-10 text-center text-slate-500">规格模板 - 🚧 施工中</div>} />
              <Route path="/mandatory" element={<div className="p-10 text-center text-slate-500">必点商品 - 🚧 施工中</div>} />
              <Route path="/tags" element={<div className="p-10 text-center text-slate-500">标签管理 - 🚧 施工中</div>} />
              
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
