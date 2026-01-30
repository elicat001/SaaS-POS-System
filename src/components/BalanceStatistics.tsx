
import React, { useState } from 'react';
import { 
  CreditCard, TrendingUp, ArrowDownLeft, ArrowUpRight, 
  Wallet, Search, Calendar, Filter, ChevronDown 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend 
} from 'recharts';

const BalanceStatistics: React.FC = () => {
  const [filterType, setFilterType] = useState<'ALL' | 'RECHARGE' | 'CONSUME'>('ALL');

  // --- Mock Data ---
  const trendData = [
    { date: '11-13', recharge: 2000, consume: 1500 },
    { date: '11-14', recharge: 1800, consume: 2200 },
    { date: '11-15', recharge: 3500, consume: 1800 },
    { date: '11-16', recharge: 4200, consume: 3100 },
    { date: '11-17', recharge: 3800, consume: 2900 },
    { date: '11-18', recharge: 2500, consume: 1600 },
    { date: '11-19', recharge: 5100, consume: 2400 },
  ];

  const transactions = [
    { id: 'T001', user: '张三', phone: '138****0000', type: 'RECHARGE', amount: 500, balance: 1250, time: '2025-11-19 14:30', operator: '系统充值' },
    { id: 'T002', user: '李四', phone: '139****1234', type: 'CONSUME', amount: -45.50, balance: 204.50, time: '2025-11-19 14:15', operator: '订单支付' },
    { id: 'T003', user: '王五', phone: '137****8888', type: 'RECHARGE', amount: 200, balance: 200, time: '2025-11-19 13:40', operator: '前台办理' },
    { id: 'T004', user: '赵六', phone: '155****6666', type: 'CONSUME', amount: -128.00, balance: 872.00, time: '2025-11-19 12:20', operator: '订单支付' },
    { id: 'T005', user: '孙七', phone: '186****9999', type: 'REFUND', amount: 50, balance: 50, time: '2025-11-19 11:00', operator: '退款' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-sm shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
         <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
               <Wallet className="text-emerald-500" /> 余额统计
            </h2>
            <p className="text-sm text-slate-500 mt-1">会员储值资金流动监控与对账</p>
         </div>
         <div className="flex items-center gap-3">
             <div className="flex bg-slate-100 rounded-lg p-1 text-sm font-medium">
               {['今天', '近7天', '本月'].map((t, i) => (
                  <button key={t} className={`px-3 py-1 rounded ${i === 1 ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}>{t}</button>
               ))}
             </div>
             <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input type="text" defaultValue="2025-11-13 ~ 2025-11-19" className="pl-9 pr-4 py-1.5 border border-slate-200 rounded text-sm w-48" />
             </div>
         </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-sm shadow-sm relative overflow-hidden group border-l-4 border-slate-700">
              <div className="text-sm font-medium text-slate-500 mb-2">当前会员总余额 (负债)</div>
              <div className="text-3xl font-bold text-slate-800">¥ 124,580.00</div>
              <div className="text-xs text-slate-400 mt-2">所有会员账户剩余可用金额总和</div>
          </div>
          <div className="bg-white p-6 rounded-sm shadow-sm relative overflow-hidden group border-l-4 border-emerald-500">
              <div className="text-sm font-medium text-slate-500 mb-2 flex items-center gap-2">
                 本期充值总额 <ArrowUpRight size={16} className="text-emerald-500" />
              </div>
              <div className="text-3xl font-bold text-emerald-600">¥ 22,900.00</div>
              <div className="text-xs text-emerald-600/60 mt-2">+12% 较上期</div>
          </div>
          <div className="bg-white p-6 rounded-sm shadow-sm relative overflow-hidden group border-l-4 border-blue-500">
              <div className="text-sm font-medium text-slate-500 mb-2 flex items-center gap-2">
                 本期消费总额 <ArrowDownLeft size={16} className="text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-blue-600">¥ 15,200.00</div>
              <div className="text-xs text-blue-600/60 mt-2">-5% 较上期</div>
          </div>
          <div className="bg-white p-6 rounded-sm shadow-sm relative overflow-hidden group border-l-4 border-orange-500">
              <div className="text-sm font-medium text-slate-500 mb-2">本期退款/冲正</div>
              <div className="text-3xl font-bold text-orange-600">¥ 350.00</div>
              <div className="text-xs text-slate-400 mt-2">操作笔数: 4笔</div>
          </div>
      </div>

      {/* Charts */}
      <div className="bg-white p-6 rounded-sm shadow-sm">
         <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">资金变动趋势</h3>
            <div className="flex gap-4 text-xs">
               <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> 充值金额</span>
               <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> 消费金额</span>
            </div>
         </div>
         <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
               <LineChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                  <RechartsTooltip contentStyle={{borderRadius: '8px', border:'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Line type="monotone" dataKey="recharge" name="充值" stroke="#10b981" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                  <Line type="monotone" dataKey="consume" name="消费" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
               </LineChart>
            </ResponsiveContainer>
         </div>
      </div>
      
      {/* Detailed Table */}
      <div className="bg-white rounded-sm shadow-sm overflow-hidden">
         <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-2">
               {['ALL', 'RECHARGE', 'CONSUME', 'REFUND'].map(type => (
                  <button 
                     key={type}
                     onClick={() => setFilterType(type as any)}
                     className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        (type === 'ALL' && filterType === 'ALL') || filterType === type
                        ? 'bg-slate-800 text-white' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                     }`}
                  >
                     {type === 'ALL' ? '全部记录' : type === 'RECHARGE' ? '充值记录' : type === 'CONSUME' ? '消费记录' : '退款/其他'}
                  </button>
               ))}
            </div>
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
               <input type="text" placeholder="搜索会员姓名/手机号" className="pl-9 pr-4 py-1.5 border border-slate-200 rounded text-sm w-64 focus:outline-none focus:border-emerald-500" />
            </div>
         </div>

         <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
               <tr>
                  <th className="p-4">时间</th>
                  <th className="p-4">会员信息</th>
                  <th className="p-4">变动类型</th>
                  <th className="p-4 text-right">变动金额</th>
                  <th className="p-4 text-right">变动后余额</th>
                  <th className="p-4">操作渠道/说明</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {transactions.filter(t => filterType === 'ALL' || t.type === filterType).map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                     <td className="p-4 text-slate-500 font-mono text-xs">{row.time}</td>
                     <td className="p-4">
                        <div className="font-medium text-slate-800">{row.user}</div>
                        <div className="text-xs text-slate-400">{row.phone}</div>
                     </td>
                     <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                           row.type === 'RECHARGE' ? 'bg-emerald-50 text-emerald-600' :
                           row.type === 'CONSUME' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                        }`}>
                           {row.type === 'RECHARGE' ? '充值' : row.type === 'CONSUME' ? '消费' : '退款'}
                        </span>
                     </td>
                     <td className={`p-4 text-right font-bold font-mono ${row.amount > 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
                        {row.amount > 0 ? '+' : ''}{row.amount.toFixed(2)}
                     </td>
                     <td className="p-4 text-right font-mono text-slate-600">{row.balance.toFixed(2)}</td>
                     <td className="p-4 text-slate-500 text-xs">{row.operator}</td>
                  </tr>
               ))}
            </tbody>
         </table>
         {transactions.length === 0 && <div className="p-10 text-center text-slate-400">暂无数据</div>}
      </div>
    </div>
  );
};

export default BalanceStatistics;
