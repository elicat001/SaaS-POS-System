
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { Award, User, DollarSign, Briefcase, Calendar, Download, TrendingUp } from 'lucide-react';

const CommissionStatistics: React.FC = () => {
  // --- Mock Data ---
  const rankingData = [
    { name: '王金牌', sales: 45000, commission: 2250 },
    { name: '李销冠', sales: 38000, commission: 1900 },
    { name: '张店长', sales: 25000, commission: 1250 },
    { name: '陈服务', sales: 18000, commission: 900 },
    { name: '刘兼职', sales: 8000, commission: 400 },
  ];

  const employeeData = [
    { id: 'E001', name: '王金牌', role: '销售经理', orders: 120, sales: 45000, rate: '5%', commission: 2250, status: '已结算' },
    { id: 'E002', name: '李销冠', role: '高级销售', orders: 98, sales: 38000, rate: '5%', commission: 1900, status: '已结算' },
    { id: 'E003', name: '张店长', role: '店长', orders: 65, sales: 25000, rate: '5%', commission: 1250, status: '待结算' },
    { id: 'E004', name: '陈服务', role: '服务员', orders: 80, sales: 18000, rate: '5%', commission: 900, status: '待结算' },
    { id: 'E005', name: '刘兼职', role: '兼职', orders: 20, sales: 8000, rate: '5%', commission: 400, status: '待结算' },
  ];

  const colors = ['#f59e0b', '#94a3b8', '#b45309', '#64748b', '#cbd5e1']; // Gold, Silver, Bronze, etc.

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-sm shadow-sm flex justify-between items-center">
         <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
               <Award className="text-emerald-500" /> 提成统计
            </h2>
            <p className="text-sm text-slate-500 mt-1">员工销售业绩排行与提成发放管理</p>
         </div>
         <div className="flex items-center gap-3">
             <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input type="text" defaultValue="本月 (2025-11)" className="pl-9 pr-4 py-1.5 border border-slate-200 rounded text-sm w-40" />
             </div>
             <button className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded text-sm font-medium hover:bg-emerald-100">
                <Download size={14} /> 导出报表
             </button>
         </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-6 text-white shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10 p-4"><DollarSign size={100} /></div>
            <div className="text-emerald-100 text-sm font-medium mb-1">本月预计发放提成</div>
            <div className="text-4xl font-bold mb-4">¥ 6,700.00</div>
            <div className="text-xs text-emerald-100/80">包含已结算与待结算金额</div>
         </div>
         
         <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100 flex flex-col justify-center">
            <div className="text-slate-500 text-sm font-medium mb-1">参与提成人数</div>
            <div className="text-3xl font-bold text-slate-800 mb-2">5 <span className="text-sm font-normal text-slate-400">人</span></div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
               <div className="bg-blue-500 h-1.5 rounded-full" style={{width: '80%'}}></div>
            </div>
            <div className="text-xs text-slate-400 mt-1">全店员工 80% 参与销售</div>
         </div>

         <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center text-3xl">👑</div>
            <div>
               <div className="text-xs text-slate-500 uppercase tracking-wide">本月销售冠军</div>
               <div className="text-xl font-bold text-slate-800">王金牌</div>
               <div className="text-sm text-emerald-600 font-medium">销售额 ¥45,000</div>
            </div>
         </div>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* Ranking Chart */}
         <div className="lg:col-span-1 bg-white p-6 rounded-sm shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
               <TrendingUp size={18} className="text-slate-400"/> 业绩排行榜
            </h3>
            <div className="h-[400px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rankingData} layout="vertical" margin={{ left: 0, right: 30 }}>
                     <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                     <XAxis type="number" hide />
                     <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} width={60} />
                     <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border:'none'}} />
                     <Bar dataKey="sales" radius={[0, 4, 4, 0]} barSize={20} background={{ fill: '#f8fafc' }}>
                        {rankingData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={index < 3 ? colors[index] : '#cbd5e1'} />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Detailed Table */}
         <div className="lg:col-span-2 bg-white rounded-sm shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100">
               <h3 className="font-bold text-slate-800">提成明细表</h3>
            </div>
            <div className="flex-1 overflow-auto">
               <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                     <tr>
                        <th className="p-4">员工信息</th>
                        <th className="p-4 text-right">成单数</th>
                        <th className="p-4 text-right">销售总额</th>
                        <th className="p-4 text-center">提成比例</th>
                        <th className="p-4 text-right text-emerald-600">提成金额</th>
                        <th className="p-4 text-center">状态</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {employeeData.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                           <td className="p-4">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                                    <User size={14} />
                                 </div>
                                 <div>
                                    <div className="font-medium text-slate-800">{row.name}</div>
                                    <div className="text-xs text-slate-400">{row.role}</div>
                                 </div>
                              </div>
                           </td>
                           <td className="p-4 text-right text-slate-600">{row.orders}</td>
                           <td className="p-4 text-right font-medium text-slate-800">¥{row.sales.toLocaleString()}</td>
                           <td className="p-4 text-center text-slate-500 bg-slate-50/50">{row.rate}</td>
                           <td className="p-4 text-right font-bold text-emerald-600">¥{row.commission.toLocaleString()}</td>
                           <td className="p-4 text-center">
                              <span className={`px-2 py-0.5 rounded text-xs border ${
                                 row.status === '已结算' 
                                 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                 : 'bg-amber-50 text-amber-600 border-amber-100'
                              }`}>
                                 {row.status}
                              </span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 text-right text-xs text-slate-500">
               注: 提成计算公式 = 有效销售额 × 提成比例 (默认规则)
            </div>
         </div>
      </div>
    </div>
  );
};

export default CommissionStatistics;
