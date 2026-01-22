import React, { useState, useEffect } from 'react';
import { Wine, Plus, Search, Phone, Calendar, Package, X, Loader2 } from 'lucide-react';
import { appApi } from '../../services/api';
import { useNotification } from '../../contexts/NotificationContext';
import type { WineStorage } from '../../types';

const WineStorageApp: React.FC = () => {
  const [wines, setWines] = useState<WineStorage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stored' | 'retrieved' | 'all'>('stored');
  const [searchPhone, setSearchPhone] = useState('');
  const { success: showSuccess, error: showError } = useNotification();

  // 表单状态
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    customerId: '',
    customerName: '',
    customerPhone: '',
    wineName: '',
    wineType: '',
    quantity: 1,
    unit: '瓶',
    storageDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    notes: ''
  });

  // 取酒弹窗
  const [retrieveModal, setRetrieveModal] = useState<{ wine: WineStorage | null; quantity: number; notes: string }>({
    wine: null,
    quantity: 1,
    notes: ''
  });

  // 获取存酒列表
  const fetchWines = async () => {
    try {
      const status = activeTab === 'all' ? undefined : activeTab;
      const data = await appApi.listWineStorage(status);
      setWines(data);
    } catch (e) {
      showError('错误', '获取存酒列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWines();
  }, [activeTab]);

  // 创建存酒
  const handleCreate = async () => {
    if (!form.customerPhone || !form.wineName) {
      showError('错误', '请填写必要信息');
      return;
    }
    try {
      await appApi.createWineStorage({
        ...form,
        customerId: form.customerId || form.customerPhone
      });
      showSuccess('成功', '存酒记录已创建');
      setShowForm(false);
      setForm({
        customerId: '',
        customerName: '',
        customerPhone: '',
        wineName: '',
        wineType: '',
        quantity: 1,
        unit: '瓶',
        storageDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
        notes: ''
      });
      fetchWines();
    } catch (e) {
      showError('错误', '创建失败');
    }
  };

  // 取酒
  const handleRetrieve = async () => {
    if (!retrieveModal.wine) return;
    try {
      await appApi.retrieveWine(retrieveModal.wine.id, retrieveModal.quantity, retrieveModal.notes);
      showSuccess('成功', '取酒成功');
      setRetrieveModal({ wine: null, quantity: 1, notes: '' });
      fetchWines();
    } catch (e) {
      showError('错误', '取酒失败');
    }
  };

  // 过滤
  const filteredWines = wines.filter(w => {
    if (!searchPhone) return true;
    return w.customerPhone.includes(searchPhone);
  });

  // 统计
  const storedCount = wines.filter(w => w.status === 'stored').length;
  const totalQuantity = wines.filter(w => w.status === 'stored').reduce((sum, w) => sum + w.quantity, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Wine className="text-purple-500" />
          存酒管理
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          新增存酒
        </button>
      </div>

      {/* 统计和搜索 */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div className="bg-purple-50 rounded-lg px-4 py-2">
            <span className="text-purple-600 text-sm">存酒客户: </span>
            <span className="text-purple-700 font-bold">{storedCount}</span>
          </div>
          <div className="bg-purple-50 rounded-lg px-4 py-2">
            <span className="text-purple-600 text-sm">存酒总量: </span>
            <span className="text-purple-700 font-bold">{totalQuantity} 瓶</span>
          </div>
        </div>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="手机号搜索..."
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Tab切换 */}
      <div className="flex gap-2 border-b">
        {(['stored', 'retrieved', 'all'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab === 'stored' ? '存放中' : tab === 'retrieved' ? '已取走' : '全部'}
          </button>
        ))}
      </div>

      {/* 存酒列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWines.length > 0 ? (
          filteredWines.map(wine => (
            <div key={wine.id} className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-slate-800">{wine.wineName}</h3>
                  {wine.wineType && (
                    <span className="text-xs text-slate-500">{wine.wineType}</span>
                  )}
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  wine.status === 'stored' ? 'bg-purple-100 text-purple-700' :
                  wine.status === 'retrieved' ? 'bg-slate-100 text-slate-500' :
                  'bg-red-100 text-red-700'
                }`}>
                  {wine.status === 'stored' ? '存放中' : wine.status === 'retrieved' ? '已取走' : '已过期'}
                </span>
              </div>

              <div className="space-y-2 text-sm text-slate-600 mb-4">
                <div className="flex items-center gap-2">
                  <Phone size={14} />
                  <span>{wine.customerName || '匿名'} - {wine.customerPhone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package size={14} />
                  <span>剩余: {wine.quantity - (wine.retrievedQuantity || 0)} / {wine.quantity} {wine.unit}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  <span>存入: {wine.storageDate}</span>
                </div>
                {wine.expiryDate && (
                  <div className="text-orange-500 text-xs">
                    有效期至: {wine.expiryDate}
                  </div>
                )}
              </div>

              {wine.status === 'stored' && (
                <button
                  onClick={() => setRetrieveModal({ wine, quantity: 1, notes: '' })}
                  className="w-full py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
                >
                  取酒
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-slate-400">
            暂无存酒记录
          </div>
        )}
      </div>

      {/* 新增存酒弹窗 */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
              <h3 className="font-bold text-lg text-slate-800">新增存酒</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">客户姓名</label>
                  <input
                    type="text"
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="请输入姓名"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">手机号 *</label>
                  <input
                    type="tel"
                    value={form.customerPhone}
                    onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="请输入手机号"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">酒名 *</label>
                <input
                  type="text"
                  value={form.wineName}
                  onChange={(e) => setForm({ ...form, wineName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="如: 茅台飞天"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">酒类型</label>
                  <select
                    value={form.wineType}
                    onChange={(e) => setForm({ ...form, wineType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="">请选择</option>
                    <option value="白酒">白酒</option>
                    <option value="红酒">红酒</option>
                    <option value="啤酒">啤酒</option>
                    <option value="洋酒">洋酒</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">数量</label>
                  <div className="flex">
                    <input
                      type="number"
                      min={1}
                      value={form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: parseFloat(e.target.value) || 1 })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-l-lg"
                    />
                    <select
                      value={form.unit}
                      onChange={(e) => setForm({ ...form, unit: e.target.value })}
                      className="px-3 py-2 border border-l-0 border-slate-300 rounded-r-lg bg-slate-50"
                    >
                      <option value="瓶">瓶</option>
                      <option value="ml">ml</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">存入日期</label>
                  <input
                    type="date"
                    value={form.storageDate}
                    onChange={(e) => setForm({ ...form, storageDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">有效期至</label>
                  <input
                    type="date"
                    value={form.expiryDate}
                    onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">备注</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  rows={2}
                  placeholder="备注信息..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-slate-50">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                取消
              </button>
              <button onClick={handleCreate} className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
                确认存酒
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 取酒弹窗 */}
      {retrieveModal.wine && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-bold text-lg text-slate-800">取酒</h3>
              <button onClick={() => setRetrieveModal({ wine: null, quantity: 1, notes: '' })} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="font-medium text-purple-800">{retrieveModal.wine.wineName}</div>
                <div className="text-sm text-purple-600">
                  剩余: {retrieveModal.wine.quantity - (retrieveModal.wine.retrievedQuantity || 0)} {retrieveModal.wine.unit}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">取酒数量</label>
                <input
                  type="number"
                  min={1}
                  max={retrieveModal.wine.quantity - (retrieveModal.wine.retrievedQuantity || 0)}
                  value={retrieveModal.quantity}
                  onChange={(e) => setRetrieveModal({ ...retrieveModal, quantity: parseFloat(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">备注</label>
                <input
                  type="text"
                  value={retrieveModal.notes}
                  onChange={(e) => setRetrieveModal({ ...retrieveModal, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="取酒备注..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-slate-50">
              <button onClick={() => setRetrieveModal({ wine: null, quantity: 1, notes: '' })} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                取消
              </button>
              <button onClick={handleRetrieve} className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
                确认取酒
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WineStorageApp;
