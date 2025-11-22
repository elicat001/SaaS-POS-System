
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Order } from '../types';
import { RotateCcw, HelpCircle, TrendingUp } from 'lucide-react';

interface DashboardProps {
  orders: Order[];
}

const Dashboard: React.FC<DashboardProps> = ({ orders }) => {
  // Calculate real stats from props
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
    const totalCost = orders.reduce((acc, o) => acc + (o.totalCost || 0), 0);
    const grossProfit = totalRevenue - totalCost;
    const count = orders.length;
    const avg = count > 0 ? totalRevenue / count : 0;
    return { totalRevenue, totalCost, grossProfit, count, avg };
  }, [orders]);

  // --- Chart Configs ---
  const COLORS = ['#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#f87171'];

  const orderTypeData = [
    { name: '堂食', value: stats.count || 10, color: '#fbbf24' }, // Amber
    { name: '配送', value: 0, color: '#34d399' }, // Emerald
    { name: '自取', value: 0, color: '#60a5fa' }, // Blue
    { name: '快递', value: 0, color: '#a78bfa' }, // Violet
  ];

  const paymentData = [
    { name: '美团团购', value: 15, color: '#f87171' },
    { name: '抖音团购', value: 20, color: '#fb923c' },
    { name: '挂账支付', value: 10, color: '#fbbf24' },
    { name: '线下支付', value: 25, color: '#facc15' },
    { name: '支付宝支付', value: 30, color: '#60a5fa' },
  ];

  const collectionDetailData = [
    { name: '微信支付', value: 45, color: '#34d399' },
    { name: '支付宝支付', value: 35, color: '#60a5fa' },
    { name: '余额支付', value: 10, color: '#a78bfa' },
    { name: '线下支付', value: 5, color: '#fbbf24' },
    { name: '后台充值', value: 5, color: '#f87171' },
  ];

  // --- Components ---
  const MetricCard = ({ title, value, sub, isCurrency = false, highlight = false }: any) => (
    <div className={`bg-white p-5 h-full rounded-sm shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow border border-transparent hover:border-emerald-100 ${highlight ? 'bg-emerald-50/30 border-emerald-100' : ''}`}>
      <div className="flex items-center gap-1 text-slate-500 text-sm mb-3">
        {title}
        <HelpCircle size={13} className="text-slate-300" />
      </div>
      <div className={`text-[26px] font-medium leading-none mb-3 ${isCurrency ? 'text-[#3b82f6]' : (highlight ? 'text-emerald-600' : 'text-slate-800')}`}>
        {value}
      </div>
      {sub && <div className="text-xs text-slate-400">{sub}</div>}
    </div>
  );

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center justify-between mb-5">
       <h3 className="font-bold text-slate-800 text-[15px] flex items-center gap-1">
        {children}
      </h3>
    </div>
  );

  const ChartLegend = ({ data }: { data: any[] }) => (
    <div className="grid grid-cols-2 gap-y-2 gap-x-1 mt-4">
      {data.map((item) => (
        <div key={item.name} className="flex items-center gap-1.5 text-[11px] text-slate-500">
           <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }}></span>
           <span className="truncate max-w-[60px]">{item.name}</span>
           <span className="text-slate-400 ml-auto">0.00%</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-4 font-sans text-slate-600">
      {/* --- Header Section --- */}
      <div className="bg-white p-5 rounded-sm shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-6">数据统计</h2>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
             <div className="flex bg-white">
              {['今天', '昨天', '本周', '本月', '上个月', '自定义'].map((t, i) => (
                <button 
                  key={t}
                  className={`
                    px-3 py-1 text-sm transition-colors mr-4
                    ${i === 0 ? 'text-emerald-500 font-medium' : 'text-slate-500 hover:text-slate-800'}
                  `}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          
          <div className="text-xs text-slate-400 flex items-center gap-2">
            统计时间始于00:00:00 最后更新时间: {new Date().toLocaleTimeString()} 
            <RotateCcw size={14} className="text-blue-500 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* --- Top Metrics Grid --- */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard 
          title="营业实收" 
          value={stats.totalRevenue.toFixed(2)} 
          sub="营业实收=订单实收+收款实收"
          isCurrency
        />
        <MetricCard 
          title="营业毛利" 
          value={stats.grossProfit.toFixed(2)} 
          sub="营业毛利=营业实收-商品成本"
          highlight
        />
        <MetricCard title="访问量" value="3" />
        <MetricCard title="支付顾客数" value={stats.count} />
        <MetricCard title="人均" value={stats.avg.toFixed(2)} />
        <MetricCard title="翻台率" value="0%" />
      </div>

      {/* --- Middle Section: Orders --- */}
      <div className="bg-white p-6 rounded-sm shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          
          {/* Col 1: Order Revenue Detail */}
          <div className="pr-4">
            <SectionTitle>订单实收 <HelpCircle size={13} className="text-slate-300 ml-1"/></SectionTitle>
            <div className="text-[32px] font-medium text-[#3b82f6] mb-3">
              {stats.totalRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-8">
              订单实收金额不包含用户使用余额支付和挂账支付所产生的收入
            </p>
            
            <div className="flex justify-between items-end border-t border-slate-50 pt-4">
              <div>
                 <div className="text-xs text-slate-500 mb-1">商品总成本</div>
                 <div className="font-bold text-slate-800 text-lg">{stats.totalCost.toFixed(2)}</div>
              </div>
              <div className="text-right">
                 <div className="text-xs text-slate-500 mb-1">退款 <HelpCircle size={10} className="inline text-slate-300"/></div>
                 <div className="font-bold text-slate-800 text-lg">0.00</div>
              </div>
            </div>
          </div>

          {/* Col 2: Order Amount Pie */}
          <div className="lg:pl-8">
            <SectionTitle>订单金额</SectionTitle>
            <div className="flex justify-between text-xs text-slate-500 mb-4">
               <div className="flex gap-4">
                 <div className="flex flex-col">
                   <span>堂食</span>
                   <span className="font-bold text-slate-700">0.00</span>
                 </div>
                 <div className="flex flex-col">
                   <span>配送</span>
                   <span className="font-bold text-slate-700">0.00</span>
                 </div>
               </div>
               <div className="flex gap-4 text-right">
                 <div className="flex flex-col">
                   <span>自取</span>
                   <span className="font-bold text-slate-700">0.00</span>
                 </div>
                 <div className="flex flex-col">
                   <span>快递</span>
                   <span className="font-bold text-slate-700">0.00</span>
                 </div>
               </div>
            </div>
            
            <div className="relative h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderTypeData}
                    innerRadius={35}
                    outerRadius={55}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {orderTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 {/* Center Hole */}
              </div>
            </div>
            <ChartLegend data={orderTypeData} />
          </div>

          {/* Col 3: Order Count Pie */}
          <div className="lg:pl-8">
            <SectionTitle>订单数量</SectionTitle>
            <div className="flex justify-between text-xs text-slate-500 mb-4">
               <div className="flex gap-4">
                 <div className="flex flex-col">
                   <span>堂食</span>
                   <span className="font-bold text-slate-700">{stats.count}</span>
                 </div>
                 <div className="flex flex-col">
                   <span>配送</span>
                   <span className="font-bold text-slate-700">0</span>
                 </div>
               </div>
               <div className="flex gap-4 text-right">
                 <div className="flex flex-col">
                   <span>自取</span>
                   <span className="font-bold text-slate-700">0</span>
                 </div>
                 <div className="flex flex-col">
                   <span>快递</span>
                   <span className="font-bold text-slate-700">0</span>
                 </div>
               </div>
            </div>

            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderTypeData}
                    innerRadius={35}
                    outerRadius={55}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {orderTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ChartLegend data={orderTypeData} />
          </div>

          {/* Col 4: Payment Share Pie */}
          <div className="lg:pl-8">
            <SectionTitle>订单支付占比</SectionTitle>
            <div className="h-32 mt-10">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentData}
                    innerRadius={35}
                    outerRadius={55}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {paymentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 gap-1 mt-4 pl-2">
               {paymentData.map((item) => (
                  <div key={item.name} className="flex items-center text-[11px] text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full mr-2" style={{backgroundColor: item.color}}></span>
                    <span className="flex-1">{item.name}</span>
                  </div>
               ))}
               <div className="text-[#3b82f6] text-xs mt-1 cursor-pointer hover:underline">显示更多</div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Bottom Section: Collection --- */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left: Collection Grid */}
        <div className="lg:col-span-3 bg-white p-6 rounded-sm shadow-sm">
          <div className="mb-8">
             <SectionTitle>收款实收合计 <HelpCircle size={13} className="text-slate-300 ml-1"/></SectionTitle>
             <div className="text-[32px] font-medium text-[#3b82f6]">0</div>
          </div>

          <div className="grid grid-cols-3 gap-x-12 gap-y-8">
            {[
              { label: '收银', val: '0', unit: '笔' },
              { label: '挂账还款', val: '0', unit: '笔' },
              { label: '拼团', val: '0', unit: '笔' },
              { label: '余额充值', val: '0', unit: '笔', amount: '0' },
              { label: '礼品卡', val: '0', unit: '笔', amount: '0' },
              { label: '会员开通', val: '0', unit: '笔', amount: '0' },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-start p-4 bg-slate-50/50 rounded border border-slate-100">
                 <div className="flex flex-col gap-1">
                    <span className="text-sm text-slate-500">{item.label}</span>
                    {item.amount && <span className="text-lg font-bold text-slate-800">{item.amount}</span>}
                    {!item.amount && <span className="text-lg font-bold text-slate-800">{item.val}</span>}
                 </div>
                 <span className="text-sm font-medium text-slate-600">{item.unit === '笔' ? (item.amount ? '0 笔' : '') : '0 笔'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Collection Pie */}
        <div className="bg-white p-6 rounded-sm shadow-sm flex flex-col">
          <SectionTitle>营业收款明细</SectionTitle>
          <div className="flex-1 flex flex-col justify-center">
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={collectionDetailData}
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {collectionDetailData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-6 px-2">
              {collectionDetailData.slice(0, 4).map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs text-slate-500">
                   <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></span>
                     {item.name}
                   </div>
                </div>
              ))}
              <div className="text-right text-xs text-slate-400 mt-2">... 后台充值</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
