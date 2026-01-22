import React, { useState } from 'react';
import { Printer, Plus, Trash2, Calendar, Tag, Settings, X, Loader2 } from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';

interface ExpiryLabel {
  id: string;
  productName: string;
  productionDate: string;
  expiryDate: string;
  batchNo: string;
  quantity: number;
  printedAt?: string;
}

interface LabelTemplate {
  id: string;
  name: string;
  width: number;
  height: number;
  fields: string[];
}

const ExpiryPrintApp: React.FC = () => {
  const [labels, setLabels] = useState<ExpiryLabel[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [form, setForm] = useState({
    productName: '',
    productionDate: new Date().toISOString().split('T')[0],
    shelfLifeDays: 7,
    batchNo: '',
    quantity: 1
  });
  const [settings, setSettings] = useState({
    printerName: '',
    template: 'default',
    autoCalculate: true
  });
  const [templates] = useState<LabelTemplate[]>([
    { id: 'default', name: '标准标签 (40x30mm)', width: 40, height: 30, fields: ['productName', 'productionDate', 'expiryDate', 'batchNo'] },
    { id: 'simple', name: '简易标签 (30x20mm)', width: 30, height: 20, fields: ['productName', 'expiryDate'] },
    { id: 'detailed', name: '详细标签 (50x40mm)', width: 50, height: 40, fields: ['productName', 'productionDate', 'expiryDate', 'batchNo', 'storageCondition'] }
  ]);
  const { success: showSuccess, error: showError } = useNotification();

  // 计算到期日期
  const calculateExpiryDate = (productionDate: string, days: number) => {
    const date = new Date(productionDate);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  // 添加标签
  const handleAddLabel = () => {
    if (!form.productName) {
      showError('错误', '请输入产品名称');
      return;
    }
    const expiryDate = calculateExpiryDate(form.productionDate, form.shelfLifeDays);
    const newLabel: ExpiryLabel = {
      id: Date.now().toString(),
      productName: form.productName,
      productionDate: form.productionDate,
      expiryDate,
      batchNo: form.batchNo || `B${Date.now().toString().slice(-6)}`,
      quantity: form.quantity
    };
    setLabels(prev => [...prev, newLabel]);
    setForm({
      productName: '',
      productionDate: new Date().toISOString().split('T')[0],
      shelfLifeDays: 7,
      batchNo: '',
      quantity: 1
    });
    setShowForm(false);
    showSuccess('成功', '标签已添加到打印队列');
  };

  // 删除标签
  const handleRemoveLabel = (id: string) => {
    setLabels(prev => prev.filter(l => l.id !== id));
  };

  // 打印所有标签
  const handlePrintAll = async () => {
    if (labels.length === 0) {
      showError('错误', '打印队列为空');
      return;
    }
    setPrinting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // 模拟打印
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>有效期标签打印</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .label { border: 1px dashed #ccc; padding: 10px; margin: 10px 0; page-break-inside: avoid; }
                .label h3 { margin: 0 0 8px 0; font-size: 14px; }
                .label p { margin: 4px 0; font-size: 12px; }
                @media print { .label { border: 1px solid #000; } }
              </style>
            </head>
            <body>
              ${labels.map(label => Array(label.quantity).fill(`
                <div class="label">
                  <h3>${label.productName}</h3>
                  <p>生产日期: ${label.productionDate}</p>
                  <p><strong>有效期至: ${label.expiryDate}</strong></p>
                  <p>批次号: ${label.batchNo}</p>
                </div>
              `).join('')).join('')}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
      setLabels(prev => prev.map(l => ({ ...l, printedAt: new Date().toISOString() })));
      showSuccess('成功', `已打印 ${labels.reduce((sum, l) => sum + l.quantity, 0)} 张标签`);
    } catch (e) {
      showError('错误', '打印失败');
    } finally {
      setPrinting(false);
    }
  };

  // 清空队列
  const handleClearAll = () => {
    if (!confirm('确定要清空打印队列吗？')) return;
    setLabels([]);
    showSuccess('成功', '打印队列已清空');
  };

  const totalLabels = labels.reduce((sum, l) => sum + l.quantity, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Printer className="text-orange-500" />
          有效期打印
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSettings(true)}
            className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2"
          >
            <Settings size={18} />
            设置
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            添加标签
          </button>
        </div>
      </div>

      {/* 统计 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="text-sm text-slate-500">待打印产品</div>
          <div className="text-2xl font-bold text-slate-800">{labels.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="text-sm text-slate-500">标签总数</div>
          <div className="text-2xl font-bold text-orange-600">{totalLabels}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="text-sm text-slate-500">当前模板</div>
          <div className="text-lg font-medium text-slate-800">
            {templates.find(t => t.id === settings.template)?.name || '标准标签'}
          </div>
        </div>
      </div>

      {/* 打印队列 */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-bold text-slate-800">打印队列</h2>
          {labels.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={handleClearAll}
                className="px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 rounded-lg"
              >
                清空队列
              </button>
              <button
                onClick={handlePrintAll}
                disabled={printing}
                className="px-4 py-1.5 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-1 disabled:opacity-50"
              >
                {printing ? <Loader2 size={16} className="animate-spin" /> : <Printer size={16} />}
                打印全部
              </button>
            </div>
          )}
        </div>
        {labels.length > 0 ? (
          <div className="divide-y">
            {labels.map(label => (
              <div key={label.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Tag size={20} className="text-orange-500" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-800">{label.productName}</div>
                    <div className="text-sm text-slate-500">
                      批次: {label.batchNo} | 数量: {label.quantity}张
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm text-slate-500">生产日期</div>
                    <div className="font-medium text-slate-700">{label.productionDate}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-500">有效期至</div>
                    <div className="font-medium text-red-600">{label.expiryDate}</div>
                  </div>
                  <button
                    onClick={() => handleRemoveLabel(label.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <Printer size={48} className="mx-auto mb-4 opacity-50" />
            <p>打印队列为空</p>
            <p className="text-sm mt-1">点击上方按钮添加标签</p>
          </div>
        )}
      </div>

      {/* 添加标签弹窗 */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-bold text-lg text-slate-800">添加有效期标签</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">产品名称 *</label>
                <input
                  type="text"
                  value={form.productName}
                  onChange={(e) => setForm({ ...form, productName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="如: 鲜榨橙汁"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">生产日期</label>
                  <input
                    type="date"
                    value={form.productionDate}
                    onChange={(e) => setForm({ ...form, productionDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">保质期（天）</label>
                  <input
                    type="number"
                    value={form.shelfLifeDays}
                    onChange={(e) => setForm({ ...form, shelfLifeDays: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    min={1}
                  />
                </div>
              </div>
              <div className="bg-orange-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-orange-700">
                  <Calendar size={16} />
                  <span className="text-sm">
                    有效期至: <strong>{calculateExpiryDate(form.productionDate, form.shelfLifeDays)}</strong>
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">批次号</label>
                  <input
                    type="text"
                    value={form.batchNo}
                    onChange={(e) => setForm({ ...form, batchNo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="自动生成"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">打印数量</label>
                  <input
                    type="number"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    min={1}
                    max={100}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-slate-50 rounded-b-lg">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                取消
              </button>
              <button onClick={handleAddLabel} className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                添加到队列
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 设置弹窗 */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-bold text-lg text-slate-800">打印设置</h3>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">打印机</label>
                <select
                  value={settings.printerName}
                  onChange={(e) => setSettings({ ...settings, printerName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="">使用系统默认打印机</option>
                  <option value="label-printer-1">标签打印机 1</option>
                  <option value="label-printer-2">标签打印机 2</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">标签模板</label>
                <select
                  value={settings.template}
                  onChange={(e) => setSettings({ ...settings, template: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  {templates.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autoCalculate"
                  checked={settings.autoCalculate}
                  onChange={(e) => setSettings({ ...settings, autoCalculate: e.target.checked })}
                  className="w-4 h-4 text-orange-500 rounded"
                />
                <label htmlFor="autoCalculate" className="text-sm text-slate-700">
                  自动计算有效期
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-slate-50 rounded-b-lg">
              <button onClick={() => setShowSettings(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                取消
              </button>
              <button
                onClick={() => {
                  showSuccess('成功', '设置已保存');
                  setShowSettings(false);
                }}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpiryPrintApp;
