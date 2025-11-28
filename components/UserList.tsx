
import React from 'react';
import { MOCK_USERS } from '../constants';
import { Search, UserCheck, Coins } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const UserList: React.FC = () => {
  const data = [
     { name: '下单用户', value: 591, color: '#34d399' },
     { name: '未下单用户', value: 9, color: '#e2e8f0' },
  ];
  const memberData = [
     { name: '普通', value: 591, color: '#fbbf24' },
     { name: '会员', value: 9, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-4">
      {/* Header Filters */}
      <div className="bg-white p-4 rounded-sm shadow-sm">
         <div className="flex items-center gap-4 border-b border-slate-100 pb-4 mb-4">
             <button className="px-4 py-1.5 bg-slate-100 text-slate-700 rounded text-sm font-medium">用户列表</button>
             <button className="px-4 py-1.5 text-slate-500 hover:bg-slate-50 rounded text-sm">用户标签</button>
             <button className="px-4 py-1.5 text-slate-500 hover:bg-slate-50 rounded text-sm">导入用户</button>
             <button className="px-4 py-1.5 text-slate-500 hover:bg-slate-50 rounded text-sm">设置</button>
         </div>

         <div className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col gap-1">
               <label className="text-xs text-slate-500">搜索用户</label>
               <input type="text" placeholder="ID/昵称/手机号码/账号" className="border border-slate-200 rounded px-3 py-1.5 text-sm w-56 focus:outline-none focus:border-emerald-500" />
            </div>
            <div className="flex flex-col gap-1">
               <label className="text-xs text-slate-500">会员</label>
               <select className="border border-slate-200 rounded px-3 py-1.5 text-sm w-32 focus:outline-none text-slate-600">
                 <option>全部用户</option>
               </select>
            </div>
            <div className="flex flex-col gap-1">
               <label className="text-xs text-slate-500">已授手机号</label>
               <select className="border border-slate-200 rounded px-3 py-1.5 text-sm w-32 focus:outline-none text-slate-600">
                 <option>全部</option>
               </select>
            </div>
            <div className="flex flex-col gap-1">
               <label className="text-xs text-slate-500">注册时间</label>
               <input type="text" placeholder="开始日期 至 结束日期" className="border border-slate-200 rounded px-3 py-1.5 text-sm w-64 focus:outline-none" readOnly />
            </div>
            <button className="bg-emerald-500 text-white px-6 py-1.5 rounded text-sm font-medium hover:bg-emerald-600">查询</button>
            <button className="bg-white border border-slate-200 text-slate-600 px-4 py-1.5 rounded text-sm font-medium hover:bg-slate-50">导出</button>
            <button className="bg-white border border-slate-200 text-slate-600 px-4 py-1.5 rounded text-sm font-medium hover:bg-slate-50">导出记录</button>
         </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 h-64">
         <div className="bg-white p-5 rounded-sm shadow-sm flex flex-col justify-center">
            <h3 className="font-bold text-slate-800 mb-6">统计数据</h3>
            <div className="grid grid-cols-2 gap-8">
               <div>
                  <div className="text-slate-500 text-sm mb-1">用户数</div>
                  <div className="text-2xl font-bold text-slate-800">600</div>
               </div>
               <div>
                  <div className="text-slate-500 text-sm mb-1">会员数</div>
                  <div className="text-2xl font-bold text-slate-800">9</div>
               </div>
               <div>
                  <div className="text-slate-500 text-sm mb-1">总余额</div>
                  <div className="text-2xl font-bold text-slate-800 flex items-center gap-1">10.00 <span className="text-slate-400 text-lg">{'>'}</span></div>
               </div>
               <div>
                  <div className="text-slate-500 text-sm mb-1">总积分</div>
                  <div className="text-2xl font-bold text-slate-800">23</div>
               </div>
            </div>
         </div>

         <div className="col-span-2 bg-white p-5 rounded-sm shadow-sm flex items-center">
             <div className="flex-1">
                 <h3 className="font-bold text-slate-800 mb-4">数据分析</h3>
                 <div className="grid grid-cols-3 gap-4">
                    <div className="h-40 relative">
                       <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                             <Pie data={data} innerRadius={30} outerRadius={50} dataKey="value" stroke="none">
                               {data.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                             </Pie>
                          </PieChart>
                       </ResponsiveContainer>
                       <div className="text-center text-xs mt-2 text-slate-500">
                          <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full mr-1"></span>下单用户
                       </div>
                    </div>
                    <div className="h-40 relative">
                       <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                             <Pie data={memberData} innerRadius={30} outerRadius={50} dataKey="value" stroke="none">
                               {memberData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                             </Pie>
                          </PieChart>
                       </ResponsiveContainer>
                       <div className="text-center text-xs mt-2 text-slate-500">
                          <span className="inline-block w-2 h-2 bg-amber-400 rounded-full mr-1"></span>会员
                       </div>
                    </div>
                    <div className="h-40 relative flex items-center justify-center">
                         {/* Placeholder for other charts */}
                         <div className="text-slate-300 text-xs">更多图表...</div>
                    </div>
                 </div>
             </div>
         </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-sm shadow-sm">
         <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
               <tr>
                  <th className="p-4 w-10"><input type="checkbox" /></th>
                  <th className="p-4">ID</th>
                  <th className="p-4">头像</th>
                  <th className="p-4">用户昵称</th>
                  <th className="p-4">上级分销员</th>
                  <th className="p-4">性别</th>
                  <th className="p-4">余额</th>
                  <th className="p-4">积分</th>
                  <th className="p-4">手机号</th>
                  <th className="p-4">生日</th>
                  <th className="p-4">会员</th>
                  <th className="p-4">持有券</th>
                  <th className="p-4">总消费</th>
                  <th className="p-4">操作</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {MOCK_USERS.map(user => (
                 <tr key={user.id} className="hover:bg-slate-50">
                    <td className="p-4"><input type="checkbox" /></td>
                    <td className="p-4 text-slate-500">143866425</td>
                    <td className="p-4">
                       <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-400">
                          <UserCheck size={20} />
                       </div>
                    </td>
                    <td className="p-4 text-emerald-500 cursor-pointer">备注</td>
                    <td className="p-4">
                       <div className="text-slate-800">无</div>
                       <div className="text-emerald-500 text-xs cursor-pointer">设定</div>
                    </td>
                    <td className="p-4"><span className="bg-red-50 text-red-500 px-2 py-0.5 rounded text-xs">女</span></td>
                    <td className="p-4 text-emerald-500">{user.balance.toFixed(2)}</td>
                    <td className="p-4">{user.points}</td>
                    <td className="p-4">
                       <div className="font-medium text-slate-800">+447562214847</div>
                       <div className="text-emerald-500 text-xs cursor-pointer">解除绑定</div>
                    </td>
                    <td className="p-4 text-emerald-500 cursor-pointer">修改生日</td>
                    <td className="p-4 text-slate-500">否</td>
                    <td className="p-4">
                       <span>0</span> <span className="text-emerald-500 mx-1">|</span> <span className="text-emerald-500 cursor-pointer">详情</span>
                    </td>
                    <td className="p-4">0.00</td>
                    <td className="p-4">
                       <div className="flex gap-2 text-emerald-500 text-xs cursor-pointer">
                          <span>历史订单</span>
                          <span>查看分销</span>
                          <span>更多</span>
                       </div>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
};

export default UserList;
