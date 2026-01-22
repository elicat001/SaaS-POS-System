import React, { useState, useEffect } from 'react';
import { Users, Phone, Bell, Check, X, Clock, Volume2, Loader2 } from 'lucide-react';
import { appApi } from '../../services/api';
import { useNotification } from '../../contexts/NotificationContext';
import type { QueueTicket } from '../../types';

const QueueSystem: React.FC = () => {
  const [tickets, setTickets] = useState<QueueTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'waiting' | 'called' | 'all'>('waiting');
  const { success: showSuccess, error: showError } = useNotification();

  // 表单状态
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    queueType: 'small',
    customerName: '',
    customerPhone: '',
    partySize: 2
  });

  // 获取排队列表
  const fetchTickets = async () => {
    try {
      const data = await appApi.listQueueTickets();
      setTickets(data);
    } catch (e) {
      showError('错误', '获取排队列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    // 每30秒刷新
    const timer = setInterval(fetchTickets, 30000);
    return () => clearInterval(timer);
  }, []);

  // 取号
  const handleTakeNumber = async () => {
    if (!form.customerPhone) {
      showError('错误', '请输入手机号');
      return;
    }
    try {
      await appApi.createQueueTicket(form);
      showSuccess('成功', '取号成功');
      setShowForm(false);
      setForm({ queueType: 'small', customerName: '', customerPhone: '', partySize: 2 });
      fetchTickets();
    } catch (e) {
      showError('错误', '取号失败');
    }
  };

  // 叫号
  const handleCall = async (ticketId: string) => {
    try {
      await appApi.callQueueTicket(ticketId);
      showSuccess('成功', '已叫号');
      fetchTickets();
    } catch (e) {
      showError('错误', '叫号失败');
    }
  };

  // 取消
  const handleCancel = async (ticketId: string) => {
    if (!confirm('确定要取消此排队吗？')) return;
    try {
      await appApi.cancelQueueTicket(ticketId);
      showSuccess('成功', '已取消');
      fetchTickets();
    } catch (e) {
      showError('错误', '取消失败');
    }
  };

  // 过滤票据
  const filteredTickets = tickets.filter(t => {
    if (activeTab === 'waiting') return t.status === 'waiting';
    if (activeTab === 'called') return t.status === 'called';
    return true;
  });

  // 统计
  const waitingCount = tickets.filter(t => t.status === 'waiting').length;
  const calledCount = tickets.filter(t => t.status === 'called').length;

  const getQueueTypeLabel = (type: string) => {
    switch (type) {
      case 'small': return '小桌 (1-2人)';
      case 'medium': return '中桌 (3-4人)';
      case 'large': return '大桌 (5人以上)';
      default: return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">等待中</span>;
      case 'called':
        return <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">已叫号</span>;
      case 'seated':
        return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs">已入座</span>;
      case 'cancelled':
        return <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-xs">已取消</span>;
      default:
        return null;
    }
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
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">排队取号</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2"
        >
          <Users size={18} />
          取号
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-blue-600 text-sm font-medium">等待中</div>
          <div className="text-3xl font-bold text-blue-700 mt-1">{waitingCount}</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="text-orange-600 text-sm font-medium">已叫号</div>
          <div className="text-3xl font-bold text-orange-700 mt-1">{calledCount}</div>
        </div>
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="text-slate-600 text-sm font-medium">今日总数</div>
          <div className="text-3xl font-bold text-slate-700 mt-1">{tickets.length}</div>
        </div>
      </div>

      {/* Tab切换 */}
      <div className="flex gap-2 border-b">
        {(['waiting', 'called', 'all'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab === 'waiting' ? '等待中' : tab === 'called' ? '已叫号' : '全部'}
          </button>
        ))}
      </div>

      {/* 排队列表 */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">排队号</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">类型</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">顾客</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">人数</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">状态</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">取号时间</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredTickets.length > 0 ? (
              filteredTickets.map(ticket => (
                <tr key={ticket.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <span className="text-lg font-bold text-slate-800">{ticket.ticketNo}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {getQueueTypeLabel(ticket.queueType)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-slate-800">{ticket.customerName || '-'}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-1">
                      <Phone size={12} />
                      {ticket.customerPhone}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{ticket.partySize}人</td>
                  <td className="px-4 py-3">{getStatusBadge(ticket.status)}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    {ticket.createdAt ? new Date(ticket.createdAt).toLocaleTimeString() : '-'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {ticket.status === 'waiting' && (
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleCall(ticket.id)}
                          className="px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 flex items-center gap-1"
                        >
                          <Volume2 size={14} />
                          叫号
                        </button>
                        <button
                          onClick={() => handleCancel(ticket.id)}
                          className="px-3 py-1 bg-slate-100 text-slate-600 rounded text-sm hover:bg-slate-200"
                        >
                          取消
                        </button>
                      </div>
                    )}
                    {ticket.status === 'called' && (
                      <button
                        onClick={() => handleCancel(ticket.id)}
                        className="px-3 py-1 bg-slate-100 text-slate-600 rounded text-sm hover:bg-slate-200"
                      >
                        过号
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                  暂无排队记录
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 取号弹窗 */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-bold text-lg text-slate-800">取号</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">桌位类型</label>
                <select
                  value={form.queueType}
                  onChange={(e) => setForm({ ...form, queueType: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="small">小桌 (1-2人)</option>
                  <option value="medium">中桌 (3-4人)</option>
                  <option value="large">大桌 (5人以上)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">手机号 *</label>
                <input
                  type="tel"
                  value={form.customerPhone}
                  onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="请输入手机号"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">姓名</label>
                <input
                  type="text"
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="请输入姓名（选填）"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">就餐人数</label>
                <input
                  type="number"
                  min={1}
                  value={form.partySize}
                  onChange={(e) => setForm({ ...form, partySize: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-slate-50 rounded-b-lg">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                取消
              </button>
              <button
                onClick={handleTakeNumber}
                className="px-4 py-2 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
              >
                确认取号
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueueSystem;
