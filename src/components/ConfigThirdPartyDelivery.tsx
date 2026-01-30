
import React from 'react';

const ConfigThirdPartyDelivery: React.FC = () => {
  return (
    <div className="grid grid-cols-4 gap-6 min-h-[80vh]">
      <div className="col-span-1 bg-white rounded-sm shadow-sm overflow-hidden">
         <div className="p-0">
           {[
             '达达配送', '美团配送', '蜂鸟配送', '快跑配送', '闪送设置', '顺丰同城', 'UU跑腿', '闪时送', '麦芽田', '易象配送', '青云配送', '云喇叭聚合配送', '东海速送'
           ].map((item, idx) => (
             <div 
               key={item} 
               className={`px-6 py-3.5 text-sm font-medium cursor-pointer transition-colors ${idx === 0 ? 'bg-emerald-50 text-emerald-600 border-l-4 border-emerald-500' : 'text-slate-600 hover:bg-slate-50'}`}
             >
               {item}
             </div>
           ))}
         </div>
      </div>

      <div className="col-span-3 bg-white rounded-sm shadow-sm flex items-center justify-center text-center p-12">
         <div className="max-w-md">
            <p className="text-slate-500 mb-8">此功能由第三方平台达达配送提供，请先绑定或注册达达配送</p>
            <div className="flex gap-4 justify-center">
               <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded text-sm font-medium">授权我的达达账号</button>
               <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-6 py-2 rounded text-sm font-medium underline">注册达达配送商户</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ConfigThirdPartyDelivery;
