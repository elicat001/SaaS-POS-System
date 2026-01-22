import React from 'react';
import { Order, OrderStatus } from '../types';
import { Clock, CheckCircle, XCircle, MoreHorizontal } from 'lucide-react';

interface OrderHistoryProps {
  orders: Order[];
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Order History</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-700">Order ID</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Table</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Items</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Total</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Time</th>
              <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono text-slate-600">#{order.id.slice(-6).toUpperCase()}</td>
                <td className="px-6 py-4 font-medium text-slate-800">Table {order.tableId.replace('t', '')}</td>
                <td className="px-6 py-4 text-slate-600">
                  {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                </td>
                <td className="px-6 py-4 font-bold text-slate-800">${order.total.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`
                    inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border
                    ${order.status === OrderStatus.COMPLETED ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
                    ${order.status === OrderStatus.PENDING ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                    ${order.status === OrderStatus.CANCELLED ? 'bg-red-50 text-red-700 border-red-200' : ''}
                  `}>
                    {order.status === OrderStatus.COMPLETED && <CheckCircle size={12} />}
                    {order.status === OrderStatus.PENDING && <Clock size={12} />}
                    {order.status === OrderStatus.CANCELLED && <XCircle size={12} />}
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">
                  {new Date(order.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </td>
                <td className="px-6 py-4 text-right">
                   <button className="text-slate-400 hover:text-slate-600">
                     <MoreHorizontal size={20} />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {orders.length === 0 && (
           <div className="p-12 text-center text-slate-400">
             No orders found for this period.
           </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;