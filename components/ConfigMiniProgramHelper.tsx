
import React from 'react';

const ConfigMiniProgramHelper: React.FC = () => {
  return (
    <div className="bg-white rounded-sm shadow-sm min-h-[80vh] p-6">
      <div className="flex justify-between items-center mb-6">
         <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded text-sm font-medium">
           绑定管理员
         </button>
      </div>

      <table className="w-full text-left text-sm">
         <thead className="bg-slate-50 text-slate-500">
            <tr>
               <th className="p-4 w-16">#</th>
               <th className="p-4">用户头像</th>
               <th className="p-4">用户姓名</th>
               <th className="p-4">绑定时间</th>
               <th className="p-4">操作</th>
            </tr>
         </thead>
         <tbody className="divide-y divide-slate-100">
            <tr className="hover:bg-slate-50">
               <td className="p-4 text-slate-500">1</td>
               <td className="p-4">
                  <img src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&q=80" className="w-10 h-10 rounded bg-slate-200 object-cover" alt="" />
               </td>
               <td className="p-4 text-slate-600">棠小一--Taiwaka-CH毛选小助手</td>
               <td className="p-4 text-slate-500">2025-07-01 16:45:06</td>
               <td className="p-4">
                  <div className="flex gap-3 text-sm">
                     <span className="text-emerald-500 cursor-pointer hover:underline">修改名称</span>
                     <span className="text-blue-500 cursor-pointer hover:underline">编辑权限</span>
                     <span className="text-red-500 cursor-pointer hover:underline">删除</span>
                  </div>
               </td>
            </tr>
         </tbody>
      </table>
    </div>
  );
};

export default ConfigMiniProgramHelper;
