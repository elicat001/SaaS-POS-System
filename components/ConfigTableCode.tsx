
import React from 'react';

const ConfigTableCode: React.FC = () => {
  return (
    <div className="bg-white rounded-sm shadow-sm min-h-[80vh]">
       <div className="flex border-b border-slate-200 px-6 pt-4 bg-slate-50">
          <button className="px-6 py-3 text-sm font-medium border-t-2 border-l border-r border-t-emerald-500 bg-white text-slate-800 border-l-slate-200 border-r-slate-200 rounded-t-md" style={{marginBottom: -1}}>
             微信小程序码
          </button>
          <button className="px-6 py-3 text-sm font-medium text-slate-500 hover:text-emerald-500">
             微信公众号桌码
          </button>
       </div>

       <div className="p-8 max-w-2xl space-y-8">
          <div className="flex items-center">
             <label className="w-32 text-sm font-bold text-slate-700">输入自定义桌号</label>
             <input type="text" placeholder="请输入自定义桌号" className="flex-1 border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
          </div>

          <div className="flex items-center">
             <label className="w-32 text-sm font-bold text-slate-700">桌码类型</label>
             <div className="flex gap-6 text-sm text-slate-600">
                <label className="flex items-center gap-2 cursor-pointer">
                   <div className="w-4 h-4 rounded-full border border-slate-300"></div> 小程序码
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                   <div className="w-4 h-4 rounded-full border-4 border-emerald-500"></div> 样式1
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                   <div className="w-4 h-4 rounded-full border border-slate-300"></div> 样式2
                </label>
             </div>
          </div>

          <div className="flex items-center">
             <label className="w-32 text-sm font-bold text-slate-700">进入页面</label>
             <div className="flex gap-6 text-sm text-slate-600">
                <label className="flex items-center gap-2 cursor-pointer">
                   <div className="w-4 h-4 rounded-full border-4 border-emerald-500"></div> 进入首页
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                   <div className="w-4 h-4 rounded-full border border-slate-300"></div> 进入点餐页
                </label>
             </div>
          </div>

          <div className="pl-32">
             <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded text-sm font-medium">
                生成桌码
             </button>
          </div>
       </div>
    </div>
  );
};

export default ConfigTableCode;
