
import React, { useState } from 'react';
import { MOCK_ORDERS } from '../constants';
import { Search, Printer, RefreshCw, QrCode } from 'lucide-react';
import QRCodeModal from './QRCodeModal';

const OrderList: React.FC = () => {
  const [qrModal, setQrModal] = useState<{isOpen: boolean, title: string, data: string, subtext: string}>({
    isOpen: false,
    title: '',
    data: '',
    subtext: ''
  });

  const handleShowQR = (orderNo: string) => {
    setQrModal({
      isOpen: true,
      title: '订单核销码',
      data: orderNo,
      subtext: '请出示此二维码进行取餐或核销'
    });
  };

  return (
    <div className="space-y-4">
      {/* Search Area */}
      <div className="bg-white p-4 rounded-sm shadow-sm">
        <div className="flex flex-wrap gap-4 items-end mb-4">
           <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-500">订单号</label>
              <input type="text" placeholder="订单编号/取餐号/地址" className="border border-slate-200 rounded px-3 py-1.5 text-sm w-56 focus:outline-none focus:border-emerald-500" />
           </div>
           <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-500">下单时间</label>
              <input type="text" value="2025-10-20 00:00:00 至 2025-11-19 23:59:59" className="border border-slate-200 rounded px-3 py-1.5 text-sm w-80 focus:outline-none focus:border-emerald-500 text-slate-600" readOnly />
           </div>
           <div className="flex items-center gap-6 text-sm text-emerald-500 ml-auto font-medium">
               <span>今天</span>
               <span>昨天</span>
               <span>近7天</span>
               <span>本月</span>
           </div>
           <button className="bg-emerald-500 text-white px-6 py-1.5 rounded text-sm font-medium hover:bg-emerald-600">查询</button>
           <button className="bg-white border border-slate-200 text-slate-600 px-6 py-1.5 rounded text-sm font-medium hover:bg-slate-50">导出</button>
           <button className="bg-white border border-slate-200 text-slate-600 px-4 py-1.5 rounded text-sm font-medium hover:bg-slate-50">导出记录</button>
        </div>

        <div className="flex items-center gap-6 py-3 border-t border-slate-100 text-xs text-slate-600">
            <div className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded">高级筛选</div>
            <label className="flex items-center gap-1"><input type="checkbox" /> 自动刷新</label>
            <label className="flex items-center gap-1"><input type="checkbox" /> 显示加单信息</label>
            <label className="flex items-center gap-1"><input type="checkbox" /> 显示取单二维码</label>
            <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-1 rounded border border-amber-100">
               <span>!</span> 可使用扫码枪扫码核销 <span className="text-blue-500 cursor-pointer">如何开启</span>
            </div>
        </div>
        
        <div className="flex gap-12 mt-4">
           <div>
              <div className="text-sm text-slate-500 mb-1">总订单数 {'>'}</div>
              <div className="text-2xl font-bold text-slate-800">2</div>
           </div>
           <div>
              <div className="text-sm text-slate-500 mb-1">已支付金额 {'>'}</div>
              <div className="text-2xl font-bold text-slate-800">0.00</div>
           </div>
           <div>
              <div className="text-sm text-slate-500 mb-1">退款金额 {'>'}</div>
              <div className="text-2xl font-bold text-slate-800">0.00</div>
           </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-sm shadow-sm">
        <div className="flex border-b border-slate-200 bg-slate-50">
           {['全部', '支付成功', '未支付', '退款中', '退款成功', '待配送', '待骑手接单', '配送中'].map((tab, idx) => (
              <button 
                key={tab} 
                className={`px-5 py-3 text-xs font-medium ${idx === 0 ? 'text-emerald-600 bg-white border-t-2 border-emerald-500' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                {tab}
              </button>
           ))}
        </div>

        <div className="grid grid-cols-12 text-xs font-medium text-slate-500 p-3 border-b border-slate-100">
           <div className="col-span-3">商品</div>
           <div className="col-span-1">单价(元)/数量</div>
           <div className="col-span-1">取单号</div>
           <div className="col-span-1">桌码</div>
           <div className="col-span-1">支付总额</div>
           <div className="col-span-1">优惠</div>
           <div className="col-span-1">信息</div>
           <div className="col-span-1">类型</div>
           <div className="col-span-1">订单状态</div>
           <div className="col-span-1 text-right">操作</div>
        </div>

        <div className="divide-y divide-slate-100">
           {MOCK_ORDERS.map(order => (
             <div key={order.id} className="text-xs">
                {/* Order Header */}
                <div className="bg-slate-50 p-2 flex items-center gap-4 text-slate-500 border-b border-slate-100">
                   <span className="border border-emerald-500 text-emerald-500 px-1 rounded">快递</span>
                   <span>订单号: {order.orderNo}</span>
                   <span>日期: {new Date(order.timestamp).toLocaleString()}</span>
                   <span>支付方式: {order.paymentMethod || '未支付'}</span>
                   
                   <div className="ml-auto flex items-center gap-4">
                      <button 
                         onClick={() => handleShowQR(order.orderNo)}
                         className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700"
                      >
                         <QrCode size={14} />
                         <span className="font-medium">核销码</span>
                      </button>
                      <span className="text-emerald-500 cursor-pointer">查看订单详情-备注</span>
                   </div>
                </div>

                {/* Order Body */}
                <div className="grid grid-cols-12 p-4 gap-4 items-center hover:bg-slate-50">
                   {/* Product Info */}
                   <div className="col-span-3 flex flex-col gap-3">
                      {order.items.map(item => (
                        <div key={item.id} className="flex gap-2">
                           <img src={item.image} className="w-10 h-10 rounded bg-slate-200 object-cover" alt="" />
                           <div className="flex-1">
                              <div className="text-slate-800 font-medium">{item.name}</div>
                              <div className="text-slate-400">{item.quantity * 100}克</div>
                           </div>
                        </div>
                      ))}
                   </div>

                   {/* Unit Price/Qty */}
                   <div className="col-span-1 flex flex-col gap-8">
                      {order.items.map(item => (
                        <div key={item.id} className="text-slate-600">
                           <div>{item.price.toFixed(2)}</div>
                           <div>{item.quantity}件</div>
                        </div>
                      ))}
                   </div>

                   {/* Pickup No */}
                   <div className="col-span-1 text-slate-600">3663</div>

                   {/* Table */}
                   <div className="col-span-1 text-slate-600">快递</div>

                   {/* Total */}
                   <div className="col-span-1 text-slate-800 font-bold">{order.total.toFixed(2)}</div>

                   {/* Discount */}
                   <div className="col-span-1 text-slate-400">-</div>

                   {/* Info */}
                   <div className="col-span-1 text-slate-500">
                      <div className="text-emerald-600">七*</div>
                      <div>陈*</div>
                      <div>155****1755</div>
                      <div>内蒙古自治区***</div>
                   </div>

                   {/* Type */}
                   <div className="col-span-1 text-slate-600">快递</div>

                   {/* Status */}
                   <div className="col-span-1 text-slate-600">
                      {order.status === 'PENDING' ? '待支付' : '已完成'}
                   </div>

                   {/* Actions */}
                   <div className="col-span-1 flex flex-col gap-2 items-end">
                      <button className="px-2 py-1 border border-slate-200 rounded bg-white text-slate-600 hover:bg-slate-50">订单取消</button>
                      <button className="px-2 py-1 bg-amber-400 text-white rounded hover:bg-amber-500 w-full">整单结账</button>
                      <button className="px-2 py-1 bg-emerald-500 text-white rounded hover:bg-emerald-600 w-full">重新打印</button>
                   </div>
                </div>
                
                <div className="p-2 border-t border-slate-100 text-center text-emerald-500 cursor-pointer hover:bg-slate-50 transition-colors">
                   查看全部
                </div>
             </div>
           ))}
        </div>
      </div>

      <QRCodeModal 
         isOpen={qrModal.isOpen}
         onClose={() => setQrModal({...qrModal, isOpen: false})}
         title={qrModal.title}
         data={qrModal.data}
         subtext={qrModal.subtext}
      />
    </div>
  );
};

export default OrderList;
