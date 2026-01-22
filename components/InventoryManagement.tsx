
import React, { useState, useMemo } from 'react';
import { Product, Supplier, StockLog, StockTransactionType } from '../types';
import { Search, Plus, ArrowDown, ArrowUp, AlertTriangle, Package, Truck, History, BarChart3, Save, RefreshCw, Download } from 'lucide-react';

interface InventoryManagementProps {
  products: Product[];
  suppliers: Supplier[];
  logs: StockLog[];
  onUpdateStock: (productId: string, delta: number, type: StockTransactionType, note?: string) => void;
  onAddSupplier: (supplier: Supplier) => void;
  onUpdateProduct: (product: Product) => void;
}

const InventoryManagement: React.FC<InventoryManagementProps> = ({ 
  products, 
  suppliers, 
  logs, 
  onUpdateStock,
  onAddSupplier,
  onUpdateProduct
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'STOCK_LIST' | 'STOCK_IN' | 'LOGS' | 'SUPPLIERS'>('OVERVIEW');
  const [searchTerm, setSearchTerm] = useState('');

  // --- Computed Stats ---
  const stats = useMemo(() => {
    const totalItems = products.length;
    const lowStockItems = products.filter(p => p.stock <= (p.minStock || 0)).length;
    const totalStockValue = products.reduce((acc, p) => acc + (p.stock * (p.costPrice || 0)), 0);
    const totalStockCount = products.reduce((acc, p) => acc + p.stock, 0);
    return { totalItems, lowStockItems, totalStockValue, totalStockCount };
  }, [products]);

  // --- Filters ---
  const filteredProducts = useMemo(() => {
    return products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.includes(searchTerm));
  }, [products, searchTerm]);

  const filteredLogs = useMemo(() => {
    return logs.filter(l => l.productName.toLowerCase().includes(searchTerm.toLowerCase()) || l.operator.includes(searchTerm));
  }, [logs, searchTerm]);

  // --- Sub-Components ---

  const OverviewTab = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded shadow-sm border-l-4 border-emerald-500">
          <div className="flex justify-between items-center mb-2">
            <div className="text-slate-500 text-sm">库存总额 (成本)</div>
            <div className="p-2 bg-emerald-50 rounded-full text-emerald-600"><BarChart3 size={18}/></div>
          </div>
          <div className="text-2xl font-bold text-slate-800">¥{stats.totalStockValue.toLocaleString('zh-CN', {minimumFractionDigits: 2})}</div>
        </div>
        <div className="bg-white p-5 rounded shadow-sm border-l-4 border-blue-500">
          <div className="flex justify-between items-center mb-2">
            <div className="text-slate-500 text-sm">商品种类</div>
            <div className="p-2 bg-blue-50 rounded-full text-blue-600"><Package size={18}/></div>
          </div>
          <div className="text-2xl font-bold text-slate-800">{stats.totalItems}</div>
        </div>
        <div className="bg-white p-5 rounded shadow-sm border-l-4 border-orange-500">
          <div className="flex justify-between items-center mb-2">
            <div className="text-slate-500 text-sm">库存总量</div>
            <div className="p-2 bg-orange-50 rounded-full text-orange-600"><Package size={18}/></div>
          </div>
          <div className="text-2xl font-bold text-slate-800">{stats.totalStockCount}</div>
        </div>
        <div className="bg-white p-5 rounded shadow-sm border-l-4 border-red-500">
          <div className="flex justify-between items-center mb-2">
            <div className="text-slate-500 text-sm">库存预警</div>
            <div className="p-2 bg-red-50 rounded-full text-red-600"><AlertTriangle size={18}/></div>
          </div>
          <div className="text-2xl font-bold text-red-600">{stats.lowStockItems} <span className="text-xs font-normal text-slate-400">件商品不足</span></div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-6 rounded shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">近期出入库趋势</h3>
          <div className="h-64 flex items-center justify-center text-slate-400 bg-slate-50 rounded border border-dashed border-slate-200">
            图表组件占位符 (Charts Placeholder)
          </div>
        </div>
        <div className="bg-white p-6 rounded shadow-sm">
           <h3 className="font-bold text-slate-800 mb-4">需补货商品</h3>
           <div className="space-y-3">
             {products.filter(p => p.stock <= (p.minStock || 0)).slice(0, 5).map(p => (
               <div key={p.id} className="flex items-center justify-between p-3 bg-red-50 rounded border border-red-100">
                  <div>
                    <div className="text-sm font-medium text-slate-800">{p.name}</div>
                    <div className="text-xs text-red-500">当前: {p.stock} / 预警: {p.minStock}</div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('STOCK_IN')}
                    className="text-xs bg-white border border-red-200 text-red-600 px-2 py-1 rounded hover:bg-red-100"
                  >
                    补货
                  </button>
               </div>
             ))}
             {stats.lowStockItems === 0 && <div className="text-slate-500 text-sm text-center py-4">库存充足</div>}
           </div>
        </div>
      </div>
    </div>
  );

  const StockListTab = () => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Product>>({});

    const startEdit = (product: Product) => {
      setEditingId(product.id);
      setEditForm({ costPrice: product.costPrice, minStock: product.minStock });
    };

    const saveEdit = (id: string) => {
      const product = products.find(p => p.id === id);
      if (product) {
        onUpdateProduct({ ...product, ...editForm });
      }
      setEditingId(null);
    };

    return (
      <div className="bg-white rounded shadow-sm">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
             <input 
               type="text" 
               placeholder="搜索商品名称/编码"
               className="pl-9 pr-4 py-2 border border-slate-200 rounded text-sm w-64 focus:outline-none focus:border-emerald-500"
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
             />
          </div>
          <div className="flex gap-2">
             <button className="flex items-center gap-1 px-4 py-2 border border-slate-200 rounded text-sm hover:bg-slate-50 text-slate-600">
                <RefreshCw size={16} /> 盘点库存
             </button>
             <button className="flex items-center gap-1 px-4 py-2 bg-emerald-500 text-white rounded text-sm hover:bg-emerald-600">
                <Download size={16} /> 导出报表
             </button>
          </div>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
             <tr>
               <th className="p-4">商品名称</th>
               <th className="p-4">单位</th>
               <th className="p-4">成本价 (¥)</th>
               <th className="p-4">销售价 (¥)</th>
               <th className="p-4">当前库存</th>
               <th className="p-4">预警值</th>
               <th className="p-4 text-right">操作</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
             {filteredProducts.map(product => (
               <tr key={product.id} className="hover:bg-slate-50">
                 <td className="p-4 font-medium text-slate-800">{product.name}</td>
                 <td className="p-4 text-slate-500">{product.unit}</td>
                 <td className="p-4">
                    {editingId === product.id ? (
                      <input 
                        type="number" 
                        className="w-20 border border-emerald-300 rounded px-1 py-0.5" 
                        value={editForm.costPrice} 
                        onChange={e => setEditForm({...editForm, costPrice: parseFloat(e.target.value)})}
                      />
                    ) : (
                      <span className="text-slate-600">{product.costPrice?.toFixed(2) || '-'}</span>
                    )}
                 </td>
                 <td className="p-4 text-slate-600">{product.price.toFixed(2)}</td>
                 <td className="p-4">
                    <span className={`font-bold ${product.stock <= (product.minStock || 0) ? 'text-red-500' : 'text-emerald-600'}`}>
                       {product.stock}
                    </span>
                 </td>
                 <td className="p-4">
                    {editingId === product.id ? (
                      <input 
                        type="number" 
                        className="w-20 border border-emerald-300 rounded px-1 py-0.5" 
                        value={editForm.minStock} 
                        onChange={e => setEditForm({...editForm, minStock: parseInt(e.target.value)})}
                      />
                    ) : (
                      <span className="text-slate-400">{product.minStock || '-'}</span>
                    )}
                 </td>
                 <td className="p-4 text-right">
                    {editingId === product.id ? (
                       <button onClick={() => saveEdit(product.id)} className="text-emerald-500 hover:underline flex items-center justify-end gap-1 ml-auto">
                         <Save size={14}/> 保存
                       </button>
                    ) : (
                       <button onClick={() => startEdit(product)} className="text-blue-500 hover:underline">
                         设置
                       </button>
                    )}
                 </td>
               </tr>
             ))}
          </tbody>
        </table>
      </div>
    );
  };

  const StockInTab = () => {
    const [form, setForm] = useState({
      productId: '',
      supplierId: '',
      quantity: 0,
      note: ''
    });

    const handleSubmit = () => {
       if (!form.productId || form.quantity <= 0) return;
       onUpdateStock(form.productId, form.quantity, StockTransactionType.IN_PURCHASE, form.note);
       setForm({ productId: '', supplierId: '', quantity: 0, note: '' });
       alert('入库成功！');
    };

    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow-sm animate-in zoom-in-95 duration-200">
         <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
           <Truck className="text-emerald-500" /> 采购入库
         </h2>
         <div className="space-y-4">
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">选择商品</label>
               <select 
                 className="w-full border border-slate-200 rounded px-3 py-2"
                 value={form.productId}
                 onChange={e => setForm({...form, productId: e.target.value})}
               >
                 <option value="">请选择商品</option>
                 {products.map(p => <option key={p.id} value={p.id}>{p.name} (当前: {p.stock})</option>)}
               </select>
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">供应商</label>
               <select 
                 className="w-full border border-slate-200 rounded px-3 py-2"
                 value={form.supplierId}
                 onChange={e => setForm({...form, supplierId: e.target.value})}
               >
                 <option value="">请选择供应商</option>
                 {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
               </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">入库数量</label>
                  <input 
                    type="number" 
                    className="w-full border border-slate-200 rounded px-3 py-2"
                    value={form.quantity}
                    onChange={e => setForm({...form, quantity: parseInt(e.target.value)})}
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">备注</label>
                  <input 
                    type="text" 
                    className="w-full border border-slate-200 rounded px-3 py-2"
                    placeholder="如：单号123"
                    value={form.note}
                    onChange={e => setForm({...form, note: e.target.value})}
                  />
               </div>
            </div>
            <div className="pt-4">
               <button 
                 onClick={handleSubmit}
                 className="w-full bg-emerald-500 text-white py-2.5 rounded font-medium hover:bg-emerald-600 shadow-md shadow-emerald-100"
               >
                 确认入库
               </button>
            </div>
         </div>
      </div>
    );
  };

  const LogsTab = () => (
    <div className="bg-white rounded shadow-sm">
       <div className="p-4 border-b border-slate-100">
         <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="搜索日志..."
              className="pl-9 pr-4 py-2 border border-slate-200 rounded text-sm w-full focus:outline-none focus:border-emerald-500"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
         </div>
       </div>
       <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
             <tr>
                <th className="p-4">时间</th>
                <th className="p-4">商品名称</th>
                <th className="p-4">类型</th>
                <th className="p-4 text-right">变动数量</th>
                <th className="p-4 text-right">变动后库存</th>
                <th className="p-4">操作人</th>
                <th className="p-4">备注</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
             {filteredLogs.sort((a,b) => b.timestamp - a.timestamp).map(log => (
                <tr key={log.id} className="hover:bg-slate-50">
                   <td className="p-4 text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                   <td className="p-4 font-medium text-slate-800">{log.productName}</td>
                   <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                         log.type.includes('入库') ? 'bg-emerald-100 text-emerald-600' : 
                         log.type.includes('出库') ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                         {log.type}
                      </span>
                   </td>
                   <td className={`p-4 text-right font-mono font-bold ${log.delta > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {log.delta > 0 ? '+' : ''}{log.delta}
                   </td>
                   <td className="p-4 text-right font-mono text-slate-600">{log.currentStock}</td>
                   <td className="p-4 text-slate-600">{log.operator}</td>
                   <td className="p-4 text-slate-400 text-xs">{log.note || '-'}</td>
                </tr>
             ))}
          </tbody>
       </table>
    </div>
  );

  const SuppliersTab = () => {
    const [newSup, setNewSup] = useState({ name: '', contactName: '', phone: '', email: '' });

    const handleAdd = () => {
       if(!newSup.name) return;
       onAddSupplier({ ...newSup, id: `sup-${Date.now()}` });
       setNewSup({ name: '', contactName: '', phone: '', email: '' });
    };

    return (
       <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white rounded shadow-sm overflow-hidden">
             <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                   <tr>
                      <th className="p-4">供应商名称</th>
                      <th className="p-4">联系人</th>
                      <th className="p-4">电话</th>
                      <th className="p-4">邮箱</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {suppliers.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50">
                         <td className="p-4 font-medium text-slate-800">{s.name}</td>
                         <td className="p-4 text-slate-600">{s.contactName}</td>
                         <td className="p-4 text-slate-600">{s.phone}</td>
                         <td className="p-4 text-slate-400">{s.email || '-'}</td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
          
          <div className="bg-white rounded shadow-sm p-6 h-fit">
             <h3 className="font-bold text-slate-800 mb-4">添加供应商</h3>
             <div className="space-y-3">
                <input className="w-full border border-slate-200 rounded px-3 py-2 text-sm" placeholder="供应商名称 *" value={newSup.name} onChange={e => setNewSup({...newSup, name: e.target.value})} />
                <input className="w-full border border-slate-200 rounded px-3 py-2 text-sm" placeholder="联系人" value={newSup.contactName} onChange={e => setNewSup({...newSup, contactName: e.target.value})} />
                <input className="w-full border border-slate-200 rounded px-3 py-2 text-sm" placeholder="联系电话" value={newSup.phone} onChange={e => setNewSup({...newSup, phone: e.target.value})} />
                <input className="w-full border border-slate-200 rounded px-3 py-2 text-sm" placeholder="邮箱" value={newSup.email} onChange={e => setNewSup({...newSup, email: e.target.value})} />
                <button onClick={handleAdd} className="w-full bg-blue-500 text-white py-2 rounded text-sm font-medium hover:bg-blue-600">添加</button>
             </div>
          </div>
       </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex justify-between items-center">
         <div>
            <h2 className="text-2xl font-bold text-slate-800">进销存管理系统</h2>
            <p className="text-slate-500 text-sm">Inventory & Supply Chain Management</p>
         </div>
         <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
            {[
               { id: 'OVERVIEW', label: '概览', icon: BarChart3 },
               { id: 'STOCK_LIST', label: '库存列表', icon: Package },
               { id: 'STOCK_IN', label: '入库管理', icon: Truck },
               { id: 'LOGS', label: '库存流水', icon: History },
               { id: 'SUPPLIERS', label: '供应商', icon: Truck },
            ].map(tab => (
               <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
               >
                  <tab.icon size={16} /> {tab.label}
               </button>
            ))}
         </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[600px]">
         {activeTab === 'OVERVIEW' && <OverviewTab />}
         {activeTab === 'STOCK_LIST' && <StockListTab />}
         {activeTab === 'STOCK_IN' && <StockInTab />}
         {activeTab === 'LOGS' && <LogsTab />}
         {activeTab === 'SUPPLIERS' && <SuppliersTab />}
      </div>
    </div>
  );
};

export default InventoryManagement;
