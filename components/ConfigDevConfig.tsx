
import React from 'react';
import { QrCode } from 'lucide-react';

const ConfigDevConfig: React.FC = () => {
  return (
    <div className="bg-white rounded-sm shadow-sm min-h-[80vh] p-8">
       <div className="space-y-8 max-w-4xl">
          <div className="flex items-center">
             <label className="w-32 text-sm font-bold text-slate-700">门店ID</label>
             <span className="text-slate-600 text-sm">57337</span>
          </div>

          <div className="flex items-center">
             <label className="w-32 text-sm font-bold text-slate-700">应用ID</label>
             <span className="text-slate-600 text-sm">LR7gtJhLZS</span>
          </div>

          <div className="flex items-center">
             <label className="w-32 text-sm font-bold text-slate-700">开发key</label>
             <div className="flex items-center gap-4">
               <span className="text-slate-600 text-sm font-mono">Te9qUmuYKDf5JnrlnYdhkiHqhYrB4c5l</span>
               <span className="text-emerald-500 text-sm cursor-pointer hover:underline">重置</span>
             </div>
          </div>

          <div className="flex items-center">
             <label className="w-32 text-sm font-bold text-slate-700">订单回调地址</label>
             <input type="text" placeholder="设置订单回调地址" className="flex-1 border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
          </div>

          <div className="pl-32">
             <button className="bg-emerald-500 text-white px-6 py-2 rounded text-sm font-medium hover:bg-emerald-600">
                保存
             </button>
          </div>

          <div className="border-t border-slate-100 pt-8 space-y-6">
             {[
               {label: '首页', path: '/pages/pageTo/pageTo'},
               {label: '点餐(默认)', path: '/pages/goods/goods'},
               {label: '点餐(自取)', path: '/pages/goods/goods?type=zq'},
               {label: '点餐(外卖)', path: '/pages/goods/goods?type=ps'},
               {label: '点餐(堂食)', path: '/pages/goods/goods?type=ts'},
               {label: '点餐(快递)', path: '/pages/goods/goods?type=kd'},
               {label: '跳转至指定分类', path: '/pages/goods/goods?c=分类名称'},
             ].map(item => (
               <div key={item.label} className="flex items-center">
                  <label className="w-32 text-sm font-bold text-slate-700">{item.label}</label>
                  <div className="flex items-center gap-2">
                     <span className="text-slate-600 text-sm font-mono">{item.path}</span>
                     <QrCode size={16} className="text-slate-400 cursor-pointer hover:text-slate-600" />
                  </div>
               </div>
             ))}
          </div>
       </div>
    </div>
  );
};

export default ConfigDevConfig;
