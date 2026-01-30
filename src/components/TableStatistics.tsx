
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { LayoutGrid, Users, Clock, TrendingUp, Calendar, Filter, Download } from 'lucide-react';

const TableStatistics: React.FC = () => {
  const [activeArea, setActiveArea] = useState('ALL');

  // --- Mock Data ---
  const areaPerformance = [
    { name: '大厅', revenue: 12500, orders: 150, turnRate: 3.5 },
    { name: '包厢', revenue: 8900, orders: 45, turnRate: 1.2 },
    { name: '露台', revenue: 4200, orders: 60, turnRate: 2.1 },
    { name: '二楼', revenue: 3100, orders: 30, turnRate: 1.5 },
  ];

  const hourlyOccupancy = [
    { time: '10:00', rate: 10 }, { time: '11:00', rate: 35 },
    { time: '12:00', rate: 85 }, { time: '13:00', rate: 90 },
    { time: '14:00', rate: 60 }, { time: '15:00', rate: 40 },
    { time: '16:00', rate: 35 }, { time: '17:00', rate: 50 },
    { time: '18:00', rate: 80 }, { time: '19:00', rate: 95 },
    { time: '20:00', rate: 85 }, { time: '21:00', rate: 50 },
    { time: '22:00', rate: 20 },
  ];

  const tableDetails = [
    { id: 'A01', area: '大厅', capacity: 4, orders: 12, guests: 45, revenue: 1240.00, avgTime: '45m' },
    { id: 'A02', area: '大厅', capacity: 4, orders: 10, guests: 38, revenue: 980.50, avgTime: '50m' },
    { id: 'A03', area: '大厅', capacity: 2, orders: 15, guests: 28, revenue: 850.00, avgTime: '35m' },
    { id: 'B01', area: '包厢', capacity: 8, orders: 2, guests: 16, revenue: 2400.00, avgTime: '120m' },
    { id: 'B02', area: '包厢', capacity: 10, orders: 1, guests: 10, revenue: 1800.00, avgTime: '150m' },
    { id: 'C01', area: '露台', capacity: 2, orders: 8, guests: 15, revenue: 560.00, avgTime: '60m' },
  ];

  const StatCard = ({ title, value, sub, icon: Icon, color }: any) => (
    <div className="bg-white p-5 rounded-sm shadow-sm border border-transparent hover:border-emerald-100 transition-all">
       <div className="flex justify-between items-start mb-4">
          <div className={`p-2 rounded-lg bg-slate-50 ${color}`}>
             <Icon size={20} />
          </div>
       </div>
       <div className="text-2xl font-bold text-slate-800 mb-1">{value}</div>
       <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400">{title}</span>
          <span className="text-xs font-medium text-emerald-600">{sub}</span>
       </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-sm shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
         <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
               <LayoutGrid className="text-emerald-500" /> 桌台统计
            </h2>
            <p className="text-sm text-slate-500 mt-1">分析各区域桌台使用率、翻台率及营收贡献</p>
         </div>
         <div className="flex items-center gap-3">
             <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input type="text" defaultValue="今天" className="pl-9 pr-4 py-1.5 border border-slate-200 rounded text-sm w-32 text-center" />
             </div>
             <button className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded text-sm hover:bg-slate-50">
                <Filter size={14} /> 筛选区域
             </button>
             <button className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded text-sm font-medium hover:bg-emerald-100">
                <Download size={14} /> 导出
             </button>
         </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <StatCard title="平均翻台率" value="2.8" sub="次/天" icon={TrendingUp} color="text-emerald-600" />
         <StatCard title="今日接待桌数" value="285" sub="桌" icon={LayoutGrid} color="text-blue-600" />
         <StatCard title="今日接待人数" value="892" sub="人" icon={Users} color="text-orange-600" />
         <StatCard title="平均用餐时长" value="58" sub="分钟" icon={Clock} color="text-purple-600" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Revenue By Area */}
         <div className="bg-white p-6 rounded-sm shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6">区域营收排行</h3>
            <div className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={areaPerformance} layout="vertical" margin={{ left: 20 }}>
                     <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                     <XAxis type="number" hide />
                     <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} width={60} />
                     <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border:'none'}} />
                     <Bar dataKey="revenue" fill="#10b981" radius={[0, 4, 4, 0]} barSize={30} name="营收(元)" />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Hourly Occupancy */}
         <div className="bg-white p-6 rounded-sm shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6">今日就餐高峰时段 (上座率)</h3>
            <div className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hourlyOccupancy}>
                     <defs>
                        <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                           <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                     <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} unit="%" />
                     <RechartsTooltip contentStyle={{borderRadius: '8px', border:'none'}} />
                     <Area type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" name="上座率" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-sm shadow-sm overflow-hidden">
         <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-700 text-sm">桌台明细数据</h3>
            <div className="flex gap-2 text-sm">
                {['ALL', '大厅', '包厢', '露台'].map(area => (
                   <button 
                     key={area}
                     onClick={() => setActiveArea(area)}
                     className={`px-3 py-1 rounded transition-colors ${activeArea === area ? 'bg-emerald-500 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                   >
                     {area === 'ALL' ? '全部' : area}
                   </button>
                ))}
            </div>
         </div>
         <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
               <tr>
                  <th className="p-4">桌台号</th>
                  <th className="p-4">所属区域</th>
                  <th className="p-4">座位数</th>
                  <th className="p-4 text-right">开台次数</th>
                  <th className="p-4 text-right">接待人数</th>
                  <th className="p-4 text-right">平均用餐时长</th>
                  <th className="p-4 text-right">总营收 (元)</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {tableDetails.filter(t => activeArea === 'ALL' || t.area === activeArea).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                     <td className="p-4 font-bold text-slate-700">{row.id}</td>
                     <td className="p-4 text-slate-500">
                        <span className={`px-2 py-0.5 rounded text-xs ${row.area === '包厢' ? 'bg-purple-50 text-purple-600' : 'bg-slate-100 text-slate-600'}`}>
                           {row.area}
                        </span>
                     </td>
                     <td className="p-4 text-slate-500">{row.capacity}人</td>
                     <td className="p-4 text-right text-slate-600">{row.orders}</td>
                     <td className="p-4 text-right text-slate-600">{row.guests}</td>
                     <td className="p-4 text-right text-slate-600">{row.avgTime}</td>
                     <td className="p-4 text-right font-bold text-emerald-600">{row.revenue.toLocaleString('zh-CN', {minimumFractionDigits: 2})}</td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
};

export default TableStatistics;
