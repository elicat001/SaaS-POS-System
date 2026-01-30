
import React from 'react';
import { Search, MapPin } from 'lucide-react';

const ConfigStoreSettings: React.FC = () => {
  return (
    <div className="bg-white rounded-sm shadow-sm min-h-[80vh]">
       {/* Tabs */}
       <div className="flex border-b border-slate-200 px-6 pt-4">
          {['门店基本设置', '门店下单设置', '门店WIFI'].map((tab, idx) => (
             <button 
               key={tab}
               className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${idx === 0 ? 'border-emerald-500 text-slate-800' : 'border-transparent text-slate-500 hover:text-emerald-500'}`}
             >
               {tab}
             </button>
          ))}
       </div>

       <div className="p-8 max-w-3xl">
          <div className="space-y-8">
             {/* Logo */}
             <div className="flex">
                <label className="w-32 text-sm text-slate-500 pt-2">门店头像</label>
                <div>
                   <div className="w-32 h-32 bg-[#fcd34d] rounded-md flex items-center justify-center text-slate-800 font-bold text-2xl border border-[#f59e0b] mb-2 relative">
                      棠小一
                      <span className="absolute top-2 right-2 text-[10px] border border-slate-800 rounded-full w-4 h-4 flex items-center justify-center">R</span>
                   </div>
                </div>
             </div>

             {/* Store Image */}
             <div className="flex">
                <label className="w-32 text-sm text-slate-500 pt-2">门店图片</label>
                <div>
                   <div className="w-64 h-32 border-2 border-dashed border-slate-300 rounded-md flex flex-col items-center justify-center text-slate-400 bg-slate-50 cursor-pointer hover:border-emerald-400 hover:text-emerald-500 transition-colors">
                      <span className="text-2xl mb-2">☁</span>
                      <span className="text-xs">点击上传</span>
                   </div>
                   <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                      <span>ⓘ</span> 用于附近门店组件显示，建议大图分辨率: 1126x750 像素，小图: 240*240
                   </div>
                </div>
             </div>

             {/* Store Name */}
             <div className="flex items-center">
                <label className="w-32 text-sm text-slate-500">门店名称</label>
                <input type="text" defaultValue="棠小一" className="flex-1 border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
             </div>

             {/* Store Code */}
             <div className="flex items-center">
                <label className="w-32 text-sm text-slate-500">门店编码</label>
                <input type="text" placeholder="可为空" className="flex-1 border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
             </div>

             {/* Address */}
             <div className="flex items-center">
                <label className="w-32 text-sm text-slate-500">门店地址</label>
                <div className="flex-1 border border-slate-200 rounded px-3 py-2 text-sm flex justify-between items-center cursor-pointer hover:border-emerald-500">
                   <span>广东省 / 江门市 / 蓬江区</span>
                   <span className="text-slate-400">▼</span>
                </div>
             </div>

             {/* Detailed Address */}
             <div className="flex items-center">
                <label className="w-32 text-sm text-slate-500">详细地址</label>
                <div className="flex-1 relative">
                   <input type="text" defaultValue="江门市蓬江区康乐里55号首层车房" className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
                   <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                </div>
             </div>

             {/* Map Selector */}
             <div className="flex items-start">
                <label className="w-32 text-sm text-slate-500 pt-2">选择坐标</label>
                <div className="flex-1 h-48 bg-slate-100 rounded border border-slate-200 relative overflow-hidden">
                   {/* Placeholder Map */}
                   <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&q=80')] bg-cover opacity-50"></div>
                   <div className="absolute inset-0 flex items-center justify-center">
                      <MapPin className="text-red-500" size={32} fill="currentColor" />
                   </div>
                   <div className="absolute bottom-2 right-2 bg-white px-2 py-1 text-xs shadow-sm rounded">© Map Data</div>
                </div>
             </div>

             {/* Buttons */}
             <div className="flex pl-32 pt-4 gap-4">
                <button className="px-8 py-2 bg-emerald-500 text-white rounded text-sm hover:bg-emerald-600">保存</button>
             </div>
          </div>
       </div>
    </div>
  );
};

export default ConfigStoreSettings;
