import React, { useState, useEffect } from 'react';
import { Wifi, Plus, Edit2, Trash2, QrCode, X, Loader2 } from 'lucide-react';
import { appApi } from '../../services/api';
import { useNotification } from '../../contexts/NotificationContext';
import type { StoreWifiConfig } from '../../types';

const WifiConfigApp: React.FC = () => {
  const [wifiConfigs, setWifiConfigs] = useState<StoreWifiConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingWifi, setEditingWifi] = useState<StoreWifiConfig | null>(null);
  const [form, setForm] = useState({
    ssid: '',
    password: '',
    encryptionType: 'WPA2',
    isDefault: false,
    description: ''
  });
  const { success: showSuccess, error: showError } = useNotification();

  const fetchWifiConfigs = async () => {
    try {
      const data = await appApi.listWifiConfigs();
      setWifiConfigs(data);
    } catch (e) {
      showError('错误', '获取WiFi配置失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWifiConfigs();
  }, []);

  const handleSave = async () => {
    if (!form.ssid) {
      showError('错误', '请输入WiFi名称');
      return;
    }
    try {
      if (editingWifi) {
        await appApi.updateWifiConfig(editingWifi.id, form);
        showSuccess('成功', 'WiFi配置已更新');
      } else {
        await appApi.createWifiConfig(form);
        showSuccess('成功', 'WiFi配置已添加');
      }
      closeForm();
      fetchWifiConfigs();
    } catch (e) {
      showError('错误', '保存失败');
    }
  };

  const handleDelete = async (wifiId: string) => {
    if (!confirm('确定要删除此WiFi配置吗？')) return;
    try {
      await appApi.deleteWifiConfig(wifiId);
      showSuccess('成功', 'WiFi配置已删除');
      fetchWifiConfigs();
    } catch (e) {
      showError('错误', '删除失败');
    }
  };

  const openForm = (wifi?: StoreWifiConfig) => {
    if (wifi) {
      setEditingWifi(wifi);
      setForm({
        ssid: wifi.ssid,
        password: wifi.password || '',
        encryptionType: wifi.encryptionType,
        isDefault: wifi.isDefault,
        description: wifi.description || ''
      });
    } else {
      setEditingWifi(null);
      setForm({
        ssid: '',
        password: '',
        encryptionType: 'WPA2',
        isDefault: false,
        description: ''
      });
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingWifi(null);
    setForm({
      ssid: '',
      password: '',
      encryptionType: 'WPA2',
      isDefault: false,
      description: ''
    });
  };

  // 生成WiFi二维码内容
  const generateWifiQRContent = (wifi: StoreWifiConfig) => {
    const auth = wifi.encryptionType === 'OPEN' ? 'nopass' : wifi.encryptionType;
    return `WIFI:T:${auth};S:${wifi.ssid};P:${wifi.password || ''};;`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Wifi className="text-blue-500" />
          门店WiFi配置
        </h1>
        <button
          onClick={() => openForm()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          添加WiFi
        </button>
      </div>

      {/* WiFi列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wifiConfigs.length > 0 ? (
          wifiConfigs.map(wifi => (
            <div key={wifi.id} className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Wifi size={24} className="text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{wifi.ssid}</h3>
                    {wifi.description && (
                      <p className="text-xs text-slate-500">{wifi.description}</p>
                    )}
                  </div>
                </div>
                {wifi.isDefault && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">默认</span>
                )}
              </div>

              <div className="space-y-2 text-sm text-slate-600 mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">加密方式:</span>
                  <span>{wifi.encryptionType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">密码:</span>
                  <span className="font-mono">{wifi.password || '(无密码)'}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const content = generateWifiQRContent(wifi);
                    alert(`WiFi二维码内容:\n${content}\n\n(可使用在线工具生成二维码)`);
                  }}
                  className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-1 text-sm"
                >
                  <QrCode size={16} />
                  二维码
                </button>
                <button
                  onClick={() => openForm(wifi)}
                  className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(wifi.id)}
                  className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-slate-400">
            <Wifi size={48} className="mx-auto mb-4 opacity-50" />
            <p>暂无WiFi配置</p>
            <p className="text-sm mt-1">点击上方按钮添加WiFi</p>
          </div>
        )}
      </div>

      {/* 添加/编辑弹窗 */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-bold text-lg text-slate-800">
                {editingWifi ? '编辑WiFi' : '添加WiFi'}
              </h3>
              <button onClick={closeForm} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">WiFi名称 (SSID) *</label>
                <input
                  type="text"
                  value={form.ssid}
                  onChange={(e) => setForm({ ...form, ssid: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入WiFi名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">密码</label>
                <input
                  type="text"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入密码（留空表示无密码）"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">加密方式</label>
                <select
                  value={form.encryptionType}
                  onChange={(e) => setForm({ ...form, encryptionType: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="WPA2">WPA2</option>
                  <option value="WPA">WPA</option>
                  <option value="WEP">WEP</option>
                  <option value="OPEN">无加密</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">描述</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="如: 顾客WiFi"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={form.isDefault}
                  onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                  className="w-4 h-4 text-blue-500 rounded"
                />
                <label htmlFor="isDefault" className="text-sm text-slate-700">设为默认WiFi</label>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-slate-50 rounded-b-lg">
              <button onClick={closeForm} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">
                取消
              </button>
              <button onClick={handleSave} className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WifiConfigApp;
