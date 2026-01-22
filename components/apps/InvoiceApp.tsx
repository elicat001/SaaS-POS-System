import React, { useState, useEffect } from 'react';
import { FileText, Check, X, Download, Loader2 } from 'lucide-react';
import { appApi } from '../../services/api';
import { useNotification } from '../../contexts/NotificationContext';
import type { Invoice } from '../../types';

const InvoiceApp: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'issued' | 'all'>('pending');
  const [issueModal, setIssueModal] = useState<{ invoice: Invoice | null; invoiceNo: string; invoiceUrl: string }>({
    invoice: null, invoiceNo: '', invoiceUrl: ''
  });
  const [rejectModal, setRejectModal] = useState<{ invoice: Invoice | null; reason: string }>({
    invoice: null, reason: ''
  });
  const { success: showSuccess, error: showError } = useNotification();

  const fetchInvoices = async () => {
    try {
      const status = activeTab === 'all' ? undefined : activeTab;
      const data = await appApi.listInvoices(status);
      setInvoices(data);
    } catch (e) {
      showError('错误', '获取发票列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [activeTab]);

  // 开具发票
  const handleIssue = async () => {
    if (!issueModal.invoice || !issueModal.invoiceNo) {
      showError('错误', '请输入发票号码');
      return;
    }
    try {
      await appApi.issueInvoice(issueModal.invoice.id, issueModal.invoiceNo, issueModal.invoiceUrl);
      showSuccess('成功', '发票已开具');
      setIssueModal({ invoice: null, invoiceNo: '', invoiceUrl: '' });
      fetchInvoices();
    } catch (e) {
      showError('错误', '开具失败');
    }
  };

  // 拒绝发票
  const handleReject = async () => {
    if (!rejectModal.invoice || !rejectModal.reason) {
      showError('错误', '请输入拒绝原因');
      return;
    }
    try {
      await appApi.rejectInvoice(rejectModal.invoice.id, rejectModal.reason);
      showSuccess('成功', '已拒绝');
      setRejectModal({ invoice: null, reason: '' });
      fetchInvoices();
    } catch (e) {
      showError('错误', '操作失败');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">待开具</span>;
      case 'issued':
        return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs">已开具</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">已拒绝</span>;
      default:
        return null;
    }
  };

  // 统计
  const pendingCount = invoices.filter(i => i.status === 'pending').length;
  const totalAmount = invoices.filter(i => i.status === 'issued').reduce((sum, i) => sum + i.amount, 0);

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
          <FileText className="text-blue-500" />
          发票管理
        </h1>
        <div className="flex gap-4">
          <div className="bg-yellow-50 rounded-lg px-4 py-2">
            <span className="text-yellow-600 text-sm">待处理: </span>
            <span className="text-yellow-700 font-bold">{pendingCount}</span>
          </div>
          <div className="bg-emerald-50 rounded-lg px-4 py-2">
            <span className="text-emerald-600 text-sm">已开票金额: </span>
            <span className="text-emerald-700 font-bold">¥{totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Tab切换 */}
      <div className="flex gap-2 border-b">
        {(['pending', 'issued', 'all'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab === 'pending' ? '待开具' : tab === 'issued' ? '已开具' : '全部'}
          </button>
        ))}
      </div>

      {/* 发票列表 */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">订单号</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">抬头</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">类型</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">金额</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">状态</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">申请时间</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {invoices.length > 0 ? (
              invoices.map(invoice => (
                <tr key={invoice.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-800 font-mono">
                    #{invoice.orderId.slice(-8)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-slate-800">{invoice.title}</div>
                    {invoice.taxNumber && (
                      <div className="text-xs text-slate-400">税号: {invoice.taxNumber}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {invoice.invoiceType === 'personal' ? '个人' : '企业'}
                    <span className="text-slate-400 mx-1">/</span>
                    {invoice.titleType === 'general' ? '普票' : '专票'}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">
                    ¥{invoice.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(invoice.status)}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    {invoice.createdAt ? new Date(invoice.createdAt).toLocaleString() : '-'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {invoice.status === 'pending' && (
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setIssueModal({ invoice, invoiceNo: '', invoiceUrl: '' })}
                          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 flex items-center gap-1"
                        >
                          <Check size={14} />
                          开具
                        </button>
                        <button
                          onClick={() => setRejectModal({ invoice, reason: '' })}
                          className="px-3 py-1 bg-red-50 text-red-500 rounded text-sm hover:bg-red-100"
                        >
                          拒绝
                        </button>
                      </div>
                    )}
                    {invoice.status === 'issued' && invoice.invoiceUrl && (
                      <a
                        href={invoice.invoiceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-slate-100 text-slate-600 rounded text-sm hover:bg-slate-200 inline-flex items-center gap-1"
                      >
                        <Download size={14} />
                        下载
                      </a>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                  暂无发票申请
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 开具弹窗 */}
      {issueModal.invoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="px-6 py-4 border-b">
              <h3 className="font-bold text-lg text-slate-800">开具发票</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-sm text-blue-600">抬头: {issueModal.invoice.title}</div>
                <div className="text-sm text-blue-600">金额: ¥{issueModal.invoice.amount.toFixed(2)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">发票号码 *</label>
                <input
                  type="text"
                  value={issueModal.invoiceNo}
                  onChange={(e) => setIssueModal({ ...issueModal, invoiceNo: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="请输入发票号码"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">电子发票链接</label>
                <input
                  type="url"
                  value={issueModal.invoiceUrl}
                  onChange={(e) => setIssueModal({ ...issueModal, invoiceUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-slate-50">
              <button onClick={() => setIssueModal({ invoice: null, invoiceNo: '', invoiceUrl: '' })} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                取消
              </button>
              <button onClick={handleIssue} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                确认开具
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 拒绝弹窗 */}
      {rejectModal.invoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="px-6 py-4 border-b">
              <h3 className="font-bold text-lg text-slate-800">拒绝开票</h3>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-slate-700 mb-1">拒绝原因 *</label>
              <textarea
                value={rejectModal.reason}
                onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                rows={3}
                placeholder="请输入拒绝原因..."
              />
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-slate-50">
              <button onClick={() => setRejectModal({ invoice: null, reason: '' })} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                取消
              </button>
              <button onClick={handleReject} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                确认拒绝
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceApp;
