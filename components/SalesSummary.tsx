
import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, TrendingDown, DollarSign, ShoppingCart, 
  CreditCard, Calendar, Download, RefreshCw, ChevronDown 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';

const SalesSummary: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7DAYS');

  // --- Mock Data ---
  const trendData = [
    { date: '11-13', sales: 4200, orders: 120 },
    { date: '11-14', sales: 3800, orders: 98 },
    { date: '11-15', sales: 5100, orders: 145 },
    { date: '11-16', sales: 6500, orders: 180 },
    { date: '11-17', sales: 6100, orders: 170 },
    { date: '11-18', sales: 4800, orders: 130 },
    { date: '11-19', sales: 5300, orders: 155 },
  ];

  const paymentData = [
    { name: '微信支付', value: 24500, color: '#10b981' }, // Emerald
    { name: '支付宝', value: 12300, color: '#3b82f6' }, // Blue
    { name: '现金', value: 1200, color: '#f59e0b' }, // Amber
    { name: '会员余额', value: 4500, color: '#8b5cf6' }, // Violet
  ];

  const categoryData = [
    { name: '蛋糕甜点', value: 15000 },
    { name: '现磨咖啡', value: 8500 },
    { name: '烘焙面包', value: 6200 },
    { name: '季节限定', value: 4300 },
    { name: '周边商品', value: 1200 },
  ];

  const topItems = [
    { rank: 1, name: '巴斯克切件蛋糕', sales: 1245, revenue: 24775.5, trend: 'up' },
    { rank: 2, name: '冰美式(大)', sales: 980, revenue: 14700.0, trend: 'up' },
    { rank: 3, name: '巧克力贝果', sales: 856, revenue: 9244.8, trend: 'down' },
    { rank: 4, name: '抹茶瑞士卷', sales: 654, revenue: 5755.2, trend: 'up' },
    { rank: 5, name: '红丝绒蛋糕', sales: 432, revenue: 8596.8, trend: 'down' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header & Controls */}
      <div className="bg-white p-5 rounded-sm shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
         <div>
            <h2 className="text-xl font-bold text-slate-800">销售汇总</h2>
            <p className="text-sm text-slate-500 mt-1">实时监控店铺经营核心数据指标</p>
         </div>
         <div className="flex flex-wrap items-center gap-3">
            <div className="flex bg-slate-100 rounded-lg p-1 text-sm font-medium">
               {['今日', '昨日', '近7天', '本月'].map((range, idx) => (
                  <button 
                     key={range}
                     onClick={() => setTimeRange(idx === 2 ? '7DAYS' : 'OTHER')}
                     className={`px-3 py-1.5 rounded-md transition-all ${
                        (idx === 2 && timeRange === '7DAYS') || (idx !== 2 && timeRange === 'OTHER' && idx === 0) // Mock logic
                        ? 'bg-white text-emerald-600 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                     }`}
                  >
                     {range}
                  </button>
               ))}
            </div>
            <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-sm text-slate-600">
               <Calendar size={14} className="text-slate-400" />
               <span>2025-11-13 ~ 2025-11-19</span>
            </div>
            <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600" title="刷新数据">
               <RefreshCw size={16} />
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 hover:bg-emerald-100 text-sm font-medium">
               <Download size={14} /> 导出报表
            </button>
         </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         {[
            { label: '营业实收 (元)', value: '35,200.00', sub: '较上周', subVal: '+12.5%', icon: DollarSign, color: 'text-emerald-600', trend: 'up' },
            { label: '有效订单数 (单)', value: '998', sub: '较上周', subVal: '+5.2%', icon: ShoppingCart, color: 'text-blue-600', trend: 'up' },
            { label: '客单价 (元)', value: '35.27', sub: '较上周', subVal: '-2.1%', icon: CreditCard, color: 'text-orange-600', trend: 'down' },
            { label: '退款金额 (元)', value: '128.00', sub: '退款率', subVal: '0.3%', icon: RefreshCw, color: 'text-slate-600', trend: 'down' }, // down is good for refund
         ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-sm shadow-sm border border-transparent hover:border-emerald-100 transition-colors">
               <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-lg bg-slate-50 ${stat.color}`}>
                     <stat.icon size={20} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded ${stat.trend === 'up' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                     {stat.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                     {stat.subVal}
                  </div>
               </div>
               <div className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</div>
               <div className="text-xs text-slate-400">{stat.label}</div>
            </div>
         ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Main Sales Trend */}
         <div className="lg:col-span-2 bg-white p-6 rounded-sm shadow-sm">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-slate-800">销售趋势</h3>
               <div className="flex gap-2">
                  <span className="flex items-center gap-1 text-xs text-emerald-600"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> 销售额</span>
                  <span className="flex items-center gap-1 text-xs text-blue-500 ml-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span> 订单量</span>
               </div>
            </div>
            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                     <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                     <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                     <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                     <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontSize: '12px' }}
                     />
                     <Area yAxisId="left" type="monotone" dataKey="sales" name="销售额" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                     <Area yAxisId="right" type="monotone" dataKey="orders" name="订单量" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorOrders)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Sales Composition */}
         <div className="bg-white p-6 rounded-sm shadow-sm flex flex-col">
            <h3 className="font-bold text-slate-800 mb-6">支付方式占比</h3>
            <div className="flex-1 flex flex-col justify-center relative">
               <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie
                           data={paymentData}
                           cx="50%"
                           cy="50%"
                           innerRadius={60}
                           outerRadius={80}
                           paddingAngle={5}
                           dataKey="value"
                        >
                           {paymentData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                           ))}
                        </Pie>
                        <Tooltip />
                     </PieChart>
                  </ResponsiveContainer>
                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-12">
                     <span className="text-xs text-slate-400">总营收</span>
                     <span className="text-xl font-bold text-slate-800">4.2w</span>
                  </div>
               </div>
               <div className="mt-4 space-y-3">
                  {paymentData.map((item, i) => (
                     <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                           <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }}></span>
                           <span className="text-slate-600">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                           <span className="font-medium text-slate-800">¥{item.value.toLocaleString()}</span>
                           <span className="text-xs text-slate-400 w-8 text-right">
                              {Math.round(item.value / paymentData.reduce((a,b)=>a+b.value,0) * 100)}%
                           </span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Category Sales Bar */}
         <div className="bg-white p-6 rounded-sm shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6">品类销售排行</h3>
            <div className="h-[250px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical" margin={{ left: 20, right: 20 }}>
                     <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                     <XAxis type="number" hide />
                     <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} width={80} />
                     <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border:'none'}} />
                     <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Top Items Table */}
         <div className="bg-white p-6 rounded-sm shadow-sm">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-slate-800">商品销量 Top 5</h3>
               <button className="text-xs text-emerald-500 hover:underline flex items-center gap-1">
                  查看全部 <ChevronDown size={12} />
               </button>
            </div>
            <div className="space-y-4">
               {topItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors">
                     <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                           idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                           idx === 1 ? 'bg-slate-200 text-slate-600' :
                           idx === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-50 text-slate-400'
                        }`}>
                           {item.rank}
                        </div>
                        <div>
                           <div className="text-sm font-medium text-slate-800">{item.name}</div>
                           <div className="text-xs text-slate-400">销量: {item.sales}</div>
                        </div>
                     </div>
                     <div className="text-right">
                        <div className="text-sm font-bold text-slate-800">¥{item.revenue.toLocaleString()}</div>
                        <div className={`text-[10px] flex items-center justify-end gap-0.5 ${item.trend === 'up' ? 'text-red-500' : 'text-green-500'}`}>
                           {item.trend === 'up' ? '上升' : '下降'} 
                           {item.trend === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default SalesSummary;
