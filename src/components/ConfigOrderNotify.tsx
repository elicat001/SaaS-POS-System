
import React from 'react';

const ConfigOrderNotify: React.FC = () => {
  return (
    <div className="bg-white rounded-sm shadow-sm min-h-[80vh]">
       {/* Header Tabs */}
       <div className="flex border-b border-slate-200 px-6 pt-4 bg-slate-50">
          {['微信通知', '短信通知', '邮箱通知'].map((tab, idx) => (
             <button 
               key={tab}
               className={`px-6 py-3 text-sm font-medium border-t-2 border-l border-r rounded-t-md transition-colors ${idx === 0 ? 'border-t-emerald-500 bg-white text-slate-800 border-l-slate-200 border-r-slate-200' : 'border-transparent bg-transparent text-slate-500 hover:text-emerald-500'}`}
               style={{ marginBottom: -1 }}
             >
               {tab}
             </button>
          ))}
       </div>

       <div className="p-6">
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-4">
                <button className="px-4 py-2 bg-emerald-500 text-white rounded text-sm font-medium hover:bg-emerald-600">添加用户</button>
                <span className="text-sm text-slate-500">当前还可以添加9个用户</span>
             </div>
          </div>

          <table className="w-full text-left text-sm">
             <thead className="bg-slate-50 text-slate-600">
                <tr>
                   <th className="p-4 font-medium">姓名</th>
                   <th className="p-4 font-medium">openid</th>
                   <th className="p-4 font-medium">绑定时间</th>
                   <th className="p-4 font-medium">操作</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                   <td className="p-4 text-slate-800">棠小一--Taiwaka-CH毛选小助手</td>
                   <td className="p-4 text-slate-500 font-mono text-xs">owgDo1RcxLW9JdlL-taeZP2C2gVw</td>
                   <td className="p-4 text-slate-600">2025-07-01 16:45:54</td>
                   <td className="p-4">
                      <div className="flex gap-4 text-sm">
                         <button className="text-blue-500 hover:underline">编辑权限</button>
                         <button className="text-red-500 hover:underline">移除</button>
                      </div>
                   </td>
                </tr>
             </tbody>
          </table>
       </div>
    </div>
  );
};

export default ConfigOrderNotify;
