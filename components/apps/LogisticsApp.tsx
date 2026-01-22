import React, { useState } from 'react';
import { Truck, Search, Package, MapPin, Clock, RefreshCw, X, Loader2 } from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';

interface LogisticsRecord {
  id: string;
  trackingNo: string;
  carrier: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'exception';
  origin: string;
  destination: string;
  events: Array<{
    time: string;
    location: string;
    description: string;
  }>;
  createdAt: string;
  lastUpdated: string;
}

const LogisticsApp: React.FC = () => {
  const [trackingNo, setTrackingNo] = useState('');
  const [searching, setSearching] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<LogisticsRecord | null>(null);
  const [records, setRecords] = useState<LogisticsRecord[]>([
    {
      id: '1',
      trackingNo: 'SF1234567890',
      carrier: '顺丰速运',
      status: 'in_transit',
      origin: '深圳市',
      destination: '北京市',
      events: [
        { time: '2024-01-20 14:30', location: '北京分拨中心', description: '快件已到达' },
        { time: '2024-01-20 08:15', location: '武汉分拨中心', description: '快件已发出' },
        { time: '2024-01-19 20:00', location: '深圳集散中心', description: '快件已发出' },
        { time: '2024-01-19 16:30', location: '深圳南山营业部', description: '已揽收' }
      ],
      createdAt: '2024-01-19T16:30:00Z',
      lastUpdated: '2024-01-20T14:30:00Z'
    },
    {
      id: '2',
      trackingNo: 'YT9876543210',
      carrier: '圆通速递',
      status: 'delivered',
      origin: '杭州市',
      destination: '上海市',
      events: [
        { time: '2024-01-18 11:20', location: '上海浦东', description: '已签收' },
        { time: '2024-01-18 08:00', location: '上海分拨中心', description: '派送中' },
        { time: '2024-01-17 22:00', location: '杭州分拨中心', description: '快件已发出' },
        { time: '2024-01-17 18:00', location: '杭州西湖区营业部', description: '已揽收' }
      ],
      createdAt: '2024-01-17T18:00:00Z',
      lastUpdated: '2024-01-18T11:20:00Z'
    }
  ]);
  const { success: showSuccess, error: showError } = useNotification();

  // 搜索物流
  const handleSearch = async () => {
    if (!trackingNo.trim()) {
      showError('错误', '请输入快递单号');
      return;
    }
    setSearching(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // 模拟搜索
      const existing = records.find(r => r.trackingNo === trackingNo);
      if (existing) {
        setSelectedRecord(existing);
      } else {
        // 模拟创建新记录
        const carriers = ['顺丰速运', '圆通速递', '中通快递', '韵达快递', '申通快递'];
        const newRecord: LogisticsRecord = {
          id: Date.now().toString(),
          trackingNo,
          carrier: carriers[Math.floor(Math.random() * carriers.length)],
          status: 'in_transit',
          origin: '广州市',
          destination: '成都市',
          events: [
            { time: new Date().toLocaleString(), location: '广州分拨中心', description: '快件已发出' },
            { time: new Date(Date.now() - 3600000).toLocaleString(), location: '广州白云区营业部', description: '已揽收' }
          ],
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        };
        setRecords(prev => [newRecord, ...prev]);
        setSelectedRecord(newRecord);
        showSuccess('成功', '物流信息已添加');
      }
      setTrackingNo('');
    } catch (e) {
      showError('错误', '查询失败，请稍后重试');
    } finally {
      setSearching(false);
    }
  };

  // 刷新物流信息
  const handleRefresh = async (record: LogisticsRecord) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      // 模拟更新
      const newEvent = {
        time: new Date().toLocaleString(),
        location: '最新位置',
        description: '物流信息已更新'
      };
      setRecords(prev => prev.map(r =>
        r.id === record.id
          ? { ...r, events: [newEvent, ...r.events], lastUpdated: new Date().toISOString() }
          : r
      ));
      if (selectedRecord?.id === record.id) {
        setSelectedRecord(prev => prev ? { ...prev, events: [newEvent, ...prev.events], lastUpdated: new Date().toISOString() } : null);
      }
      showSuccess('成功', '物流信息已更新');
    } catch (e) {
      showError('错误', '刷新失败');
    }
  };

  // 删除记录
  const handleDelete = (id: string) => {
    if (!confirm('确定要删除此物流记录吗？')) return;
    setRecords(prev => prev.filter(r => r.id !== id));
    if (selectedRecord?.id === id) {
      setSelectedRecord(null);
    }
    showSuccess('成功', '记录已删除');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">待揽收</span>;
      case 'in_transit':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">运输中</span>;
      case 'delivered':
        return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs">已签收</span>;
      case 'exception':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">异常</span>;
      default:
        return null;
    }
  };

  const getCarrierColor = (carrier: string) => {
    if (carrier.includes('顺丰')) return 'bg-red-500';
    if (carrier.includes('圆通')) return 'bg-yellow-500';
    if (carrier.includes('中通')) return 'bg-blue-500';
    if (carrier.includes('韵达')) return 'bg-orange-500';
    if (carrier.includes('申通')) return 'bg-yellow-600';
    return 'bg-slate-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Truck className="text-teal-500" />
          实时快递查询
        </h1>
      </div>

      {/* 搜索框 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">快递单号</label>
            <input
              type="text"
              value={trackingNo}
              onChange={(e) => setTrackingNo(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              placeholder="请输入快递单号"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={searching}
              className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {searching ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
              查询
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 物流记录列表 */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="font-bold text-slate-800">物流记录</h2>
          </div>
          {records.length > 0 ? (
            <div className="divide-y max-h-[500px] overflow-y-auto">
              {records.map(record => (
                <div
                  key={record.id}
                  onClick={() => setSelectedRecord(record)}
                  className={`px-6 py-4 cursor-pointer hover:bg-slate-50 transition-colors ${
                    selectedRecord?.id === record.id ? 'bg-teal-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${getCarrierColor(record.carrier)}`} />
                      <span className="font-medium text-slate-800">{record.carrier}</span>
                    </div>
                    {getStatusBadge(record.status)}
                  </div>
                  <div className="text-sm font-mono text-slate-600 mb-1">{record.trackingNo}</div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MapPin size={12} />
                    <span>{record.origin} → {record.destination}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <Package size={48} className="mx-auto mb-4 opacity-50" />
              <p>暂无物流记录</p>
              <p className="text-sm mt-1">输入快递单号开始查询</p>
            </div>
          )}
        </div>

        {/* 物流详情 */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="font-bold text-slate-800">物流详情</h2>
            {selectedRecord && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleRefresh(selectedRecord)}
                  className="p-2 text-teal-500 hover:bg-teal-50 rounded-lg"
                  title="刷新"
                >
                  <RefreshCw size={18} />
                </button>
                <button
                  onClick={() => handleDelete(selectedRecord.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  title="删除"
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>
          {selectedRecord ? (
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${getCarrierColor(selectedRecord.carrier)}`}>
                  <Truck size={20} />
                </div>
                <div>
                  <div className="font-medium text-slate-800">{selectedRecord.carrier}</div>
                  <div className="text-sm font-mono text-slate-500">{selectedRecord.trackingNo}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6 p-3 bg-slate-50 rounded-lg">
                <div className="flex-1 text-center">
                  <div className="text-xs text-slate-500">发货地</div>
                  <div className="font-medium text-slate-800">{selectedRecord.origin}</div>
                </div>
                <div className="text-slate-300">→</div>
                <div className="flex-1 text-center">
                  <div className="text-xs text-slate-500">收货地</div>
                  <div className="font-medium text-slate-800">{selectedRecord.destination}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Clock size={14} />
                  物流轨迹
                </div>
                <div className="relative pl-6 space-y-4">
                  <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-slate-200" />
                  {selectedRecord.events.map((event, index) => (
                    <div key={index} className="relative">
                      <div className={`absolute -left-4 w-3 h-3 rounded-full border-2 ${
                        index === 0 ? 'bg-teal-500 border-teal-500' : 'bg-white border-slate-300'
                      }`} />
                      <div className="text-xs text-slate-400">{event.time}</div>
                      <div className="text-sm text-slate-800">{event.description}</div>
                      <div className="text-xs text-slate-500">{event.location}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <Truck size={48} className="mx-auto mb-4 opacity-50" />
              <p>选择一条记录查看详情</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogisticsApp;
