import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, Legend } from 'recharts';
import { RotateCcw, HelpCircle, TrendingUp } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import { Order } from '../../../types';

interface DashboardViewProps {
  orders: Order[];
}

// --- 纯视图组件 ---
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

const SectionTitle = ({ children }: { children?: React.ReactNode }) => (
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

// 主视图组件
export const DashboardView: React.FC<DashboardViewProps> = ({ orders }) => {
  const {
    timeRange,
    setTimeRange,
    stats,
    salesTrendData,
    productSalesData,
    paymentMethodData
  } = useDashboard(orders);

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* 标题和时间选择器 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">数据看板</h1>
        <div className="flex items-center gap-2">
          <select
            className="px-3 py-1.5 text-sm border border-slate-200 rounded-sm bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option>今天</option>
            <option>昨天</option>
            <option>本周</option>
            <option>本月</option>
            <option>自定义</option>
          </select>
          <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-slate-200 rounded-sm bg-white text-slate-700 hover:bg-slate-50">
            <RotateCcw size={14} />
            刷新
          </button>
        </div>
      </div>

      {/* 关键指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="总营业额"
          value={`¥${stats.totalRevenue.toFixed(2)}`}
          sub="较昨日 +12.5%"
          isCurrency
          highlight
        />
        <MetricCard
          title="总成本"
          value={`¥${stats.totalCost.toFixed(2)}`}
          sub="利润率 45.2%"
          isCurrency
        />
        <MetricCard
          title="总订单数"
          value={stats.orderCount.toString()}
          sub="较昨日 +8.2%"
        />
        <MetricCard
          title="客单价"
          value={`¥${stats.averageOrderValue.toFixed(2)}`}
          sub="较昨日 +5.1%"
          isCurrency
        />
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* 销售趋势图 */}
        <div className="bg-white p-5 rounded-sm shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <SectionTitle>
            <TrendingUp size={16} />
            销售趋势
          </SectionTitle>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 支付方式分布 */}
        <div className="bg-white p-5 rounded-sm shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <SectionTitle>支付方式分布</SectionTitle>
          <div className="flex">
            <div className="h-64 w-2/3">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`¥${value}`, '金额']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/3 pl-4">
              <ChartLegend data={paymentMethodData} />
            </div>
          </div>
        </div>
      </div>

      {/* 产品销售排名 */}
      <div className="bg-white p-5 rounded-sm shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <SectionTitle>产品销售排名</SectionTitle>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productSalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#888" fontSize={12} angle={-45} textAnchor="end" height={60} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip formatter={(value) => [`¥${value}`, '销售额']} />
              <Legend />
              <Bar dataKey="sales" fill="#3b82f6" name="销售额" radius={[2, 2, 0, 0]} />
              <Bar dataKey="quantity" fill="#10b981" name="销量" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};