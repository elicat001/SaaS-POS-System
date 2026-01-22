import React, { useState } from 'react';
import { Smartphone, Send, CheckCircle, Clock, Settings, X, Loader2 } from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';

interface VerificationRecord {
  id: string;
  phone: string;
  code: string;
  status: 'sent' | 'verified' | 'expired';
  createdAt: string;
  verifiedAt?: string;
}

const PhoneVerifyApp: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [records, setRecords] = useState<VerificationRecord[]>([
    {
      id: '1',
      phone: '138****1234',
      code: '123456',
      status: 'verified',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      verifiedAt: new Date(Date.now() - 3500000).toISOString()
    },
    {
      id: '2',
      phone: '139****5678',
      code: '654321',
      status: 'expired',
      createdAt: new Date(Date.now() - 7200000).toISOString()
    }
  ]);
  const [settings, setSettings] = useState({
    codeLength: 6,
    expireMinutes: 5,
    dailyLimit: 10,
    provider: 'aliyun'
  });
  const { success: showSuccess, error: showError } = useNotification();

  // 发送验证码
  const handleSendCode = async () => {
    if (!phone || phone.length !== 11) {
      showError('错误', '请输入正确的11位手机号');
      return;
    }
    setSending(true);
    try {
      // 模拟发送
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newRecord: VerificationRecord = {
        id: Date.now().toString(),
        phone: phone.slice(0, 3) + '****' + phone.slice(-4),
        code: Math.random().toString().slice(2, 2 + settings.codeLength),
        status: 'sent',
        createdAt: new Date().toISOString()
      };
      setRecords(prev => [newRecord, ...prev]);
      showSuccess('成功', '验证码已发送');
      setPhone('');
    } catch (e) {
      showError('错误', '发送失败，请稍后重试');
    } finally {
      setSending(false);
    }
  };

  // 验证验证码
  const handleVerify = async () => {
    if (!code || code.length !== settings.codeLength) {
      showError('错误', `请输入${settings.codeLength}位验证码`);
      return;
    }
    setVerifying(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      // 模拟验证
      const record = records.find(r => r.code === code && r.status === 'sent');
      if (record) {
        setRecords(prev => prev.map(r =>
          r.id === record.id
            ? { ...r, status: 'verified', verifiedAt: new Date().toISOString() }
            : r
        ));
        showSuccess('成功', '验证通过');
        setCode('');
      } else {
        showError('错误', '验证码无效或已过期');
      }
    } finally {
      setVerifying(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">已发送</span>;
      case 'verified':
        return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs">已验证</span>;
      case 'expired':
        return <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-xs">已过期</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Smartphone className="text-purple-500" />
          手机号验证
        </h1>
        <button
          onClick={() => setShowSettings(true)}
          className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2"
        >
          <Settings size={18} />
          配置
        </button>
      </div>

      {/* 发送验证码 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="font-bold text-slate-800 mb-4">发送验证码</h2>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">手机号码</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="请输入11位手机号"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSendCode}
              disabled={sending}
              className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              发送验证码
            </button>
          </div>
        </div>
      </div>

      {/* 验证验证码 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="font-bold text-slate-800 mb-4">验证验证码</h2>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">验证码</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, settings.codeLength))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder={`请输入${settings.codeLength}位验证码`}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleVerify}
              disabled={verifying}
              className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {verifying ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
              验证
            </button>
          </div>
        </div>
      </div>

      {/* 验证记录 */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="font-bold text-slate-800">验证记录</h2>
        </div>
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">手机号</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">验证码</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">状态</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">发送时间</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">验证时间</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {records.length > 0 ? (
              records.map(record => (
                <tr key={record.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-800 font-mono">{record.phone}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 font-mono">{record.code}</td>
                  <td className="px-4 py-3">{getStatusBadge(record.status)}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    {new Date(record.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    {record.verifiedAt ? new Date(record.verifiedAt).toLocaleString() : '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-slate-400">
                  暂无验证记录
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 配置弹窗 */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-bold text-lg text-slate-800">短信配置</h3>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">短信服务商</label>
                <select
                  value={settings.provider}
                  onChange={(e) => setSettings({ ...settings, provider: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="aliyun">阿里云短信</option>
                  <option value="tencent">腾讯云短信</option>
                  <option value="huawei">华为云短信</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">验证码长度</label>
                <select
                  value={settings.codeLength}
                  onChange={(e) => setSettings({ ...settings, codeLength: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value={4}>4位</option>
                  <option value={6}>6位</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">有效期（分钟）</label>
                <input
                  type="number"
                  value={settings.expireMinutes}
                  onChange={(e) => setSettings({ ...settings, expireMinutes: parseInt(e.target.value) || 5 })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  min={1}
                  max={30}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">每日限制（条/号）</label>
                <input
                  type="number"
                  value={settings.dailyLimit}
                  onChange={(e) => setSettings({ ...settings, dailyLimit: parseInt(e.target.value) || 10 })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  min={1}
                  max={100}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-slate-50 rounded-b-lg">
              <button onClick={() => setShowSettings(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                取消
              </button>
              <button
                onClick={() => {
                  showSuccess('成功', '配置已保存');
                  setShowSettings(false);
                }}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
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

export default PhoneVerifyApp;
