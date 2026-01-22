import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Bell, RefreshCw, ChefHat } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { OrderStatus } from '../../types';

const KitchenDisplay: React.FC = () => {
  const { orders, updateOrderStatus } = useApp();
  const [currentTime, setCurrentTime] = useState(new Date());

  // 更新时间
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 筛选待处理订单
  const pendingOrders = orders.filter(o => o.status === OrderStatus.PENDING);

  // 计算等待时间
  const getWaitTime = (timestamp: number) => {
    const diff = Math.floor((Date.now() - timestamp) / 60000);
    return diff;
  };

  // 完成订单
  const handleComplete = async (orderId: string) => {
    try {
      await updateOrderStatus(orderId, OrderStatus.COMPLETED);
    } catch (e) {
      console.error('完成订单失败', e);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-slate-900 -m-6 p-6">
      {/* 顶部状态栏 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-white">
            <ChefHat size={28} className="text-orange-400" />
            <h1 className="text-2xl font-bold">后厨显示系统</h1>
          </div>
          <div className="px-3 py-1 bg-orange-500 text-white rounded-full text-sm font-bold">
            待处理: {pendingOrders.length}
          </div>
        </div>
        <div className="flex items-center gap-4 text-white">
          <Clock size={20} />
          <span className="text-xl font-mono">
            {currentTime.toLocaleTimeString('zh-CN', { hour12: false })}
          </span>
        </div>
      </div>

      {/* 订单网格 */}
      {pendingOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {pendingOrders.map(order => {
            const waitTime = getWaitTime(order.timestamp);
            const isUrgent = waitTime > 15;

            return (
              <div
                key={order.id}
                className={`bg-slate-800 rounded-lg overflow-hidden border-2 ${
                  isUrgent ? 'border-red-500 animate-pulse' : 'border-slate-700'
                }`}
              >
                {/* 订单头部 */}
                <div className={`px-4 py-3 flex items-center justify-between ${
                  isUrgent ? 'bg-red-600' : 'bg-slate-700'
                }`}>
                  <div>
                    <span className="text-white font-bold text-lg">
                      #{order.orderNo.slice(-4)}
                    </span>
                    <span className="ml-2 text-slate-300 text-sm">
                      {order.type === 'DINE_IN' ? '堂食' : order.type === 'DELIVERY' ? '外卖' : '自取'}
                    </span>
                  </div>
                  <div className={`flex items-center gap-1 ${isUrgent ? 'text-white' : 'text-orange-400'}`}>
                    <Clock size={16} />
                    <span className="font-bold">{waitTime}分钟</span>
                  </div>
                </div>

                {/* 订单内容 */}
                <div className="p-4">
                  <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center font-bold text-sm">
                            {item.quantity}
                          </span>
                          <span className="font-medium">{item.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 操作按钮 */}
                  <button
                    onClick={() => handleComplete(order.id)}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <CheckCircle size={20} />
                    完成出餐
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-96 text-slate-400">
          <ChefHat size={64} className="mb-4 opacity-50" />
          <p className="text-xl">暂无待处理订单</p>
          <p className="text-sm mt-2">新订单将自动显示在此处</p>
        </div>
      )}
    </div>
  );
};

export default KitchenDisplay;
