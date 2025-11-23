
import React, { useState } from 'react';
import { 
  FileText, Calendar, Filter, Download, Printer, Search, 
  ChevronDown, ArrowUpRight, ArrowDownRight, Coffee
} from 'lucide-react';

// --- Mock Report Data ---
const DAILY_DATA = Array.from({ length: 10 }, (_, i) => ({
  date: `2025-11-${19 - i}`,
  orders: Math.floor(Math.random() * 50) + 100,
  gross: (Math.random() * 3000 + 4000).toFixed(2),
  discounts: (Math.random() * 200 + 50).toFixed(2),
  net: 0, // Calculated later
  customers: Math.floor(Math.random() * 40) + 80,
  avg: 0 // Calculated later
})).map(d => ({
  ...d, 
  net: (parseFloat(d.gross) - parseFloat(d.discounts)).toFixed(2),
  avg: ((parseFloat(d.gross) - parseFloat(d.discounts)) / d.orders).toFixed(2)
}));

const PRODUCT_DATA = [
  { id: '1001', name: '巴斯克切件蛋糕', cat: '蛋糕甜点', qty: 124, gross: 2467.60, cost: 992.00, profit: 1475.60, margin: '59%' },
  { id: '1002', name: '冰美式(大)', cat: '现磨咖啡', qty: 98, gross: 1470.00, cost: 294.00, profit: 1176.00, margin: '80%' },
  { id: '1003', name: '巧克力贝果', cat: '烘焙面包', qty: 85, gross: 918.00, cost: 340.00, profit: 578.00, margin: '63%' },
  { id: '1004', name: '抹茶瑞士卷', cat: '蛋糕甜点', qty: 65, gross: 572.00, cost: 227.50, profit: 344.50, margin: '60%' },
  { id: '1005', name: '生椰拿铁', cat: '现磨咖啡', qty: 54, gross: 1026.00, cost: 324.00, profit: 702.00, margin: '68%' },
  { id: '1006', name: '提拉米苏', cat: '蛋糕甜点', qty: 42, gross: 1176.00, cost: 420.00, profit: 756.00, margin: '64%' },
  { id: '1007', name: '原味牛角包', cat: '烘焙面包', qty: 38, gross: 304.00, cost: 114.00, profit: 190.00, margin: '62%' },
];

const CATEGORY_DATA = [
  { name: '蛋糕甜点', qty: 542, sales: 12450.00, ratio: '42%' },
  { name: '现磨咖啡', qty: 421, sales: 8840.00, ratio: '30%' },
  { name: '烘焙面包', qty: 310, sales: 5200.00, ratio: '18%' },
  { name: '其他饮品', qty: 120, sales: 1800.00, ratio: '6%' },
  { name: '周边商品', qty: 45, sales: 1120.00, ratio: '4%' },
];

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'DAILY' | 'PRODUCT' | 'CATEGORY'>('DAILY');
  const [timeRange, setTimeRange] = useState('本月');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Area */}
      <div className="bg-white p-6 rounded-sm shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <FileText className="text-emerald-500" /> 营业报表
            </h2>
            <p className="text-sm text-slate-500 mt-1">查看详细的营业数据明细与财务报表</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded hover:bg-slate-50 text-slate-600 text-sm font-medium transition-colors">
              <Printer size={16} /> 打印
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 text-sm font-medium transition-colors shadow-sm shadow-emerald-200">
              <Download size={16} /> 导出 Excel
            </button>
          </div>
        </div>

        {/* Filters & Tabs */}
        <div className="flex flex-col xl:flex-row justify-between gap-4 border-t border-slate-100 pt-6">
           <div className="flex bg-slate-100 p-1 rounded-lg self-start shrink-0">
              {[
                { id: 'DAILY', label: '营业日报' },
                { id: 'PRODUCT', label: '商品销售报表' },
                { id: 'CATEGORY', label: '分类报表' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab.id 
                    ? 'bg-white text-emerald-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
           </div>

           <div className="flex flex-wrap items-center gap-3">
              <div className="flex bg-slate-100 rounded-lg p-1 text-sm font-medium">
                 {['今天', '昨天', '本周', '本月', '自定义'].map(t => (
                    <button 
                       key={t}
                       onClick={() => setTimeRange(t)}
                       className={`px-3 py-1.5 rounded-md transition-all ${
                          timeRange === t 
                          ? 'bg-white text-emerald-600 shadow-sm' 
                          : 'text-slate-500 hover:text-slate-700'
                       }`}
                    >
                       {t}
                    </button>
                 ))}
              </div>

              <div className="relative">
                 <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                 <input 
                    type="text" 
                    defaultValue="2025-11-01 ~ 2025-11-19"
                    className="pl-9 pr-4 py-2 border border-slate-200 rounded text-sm w-48 focus:outline-none focus:border-emerald-500"
                 />
              </div>
              <div className="relative">
                 <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                 <select className="pl-9 pr-8 py-2 border border-slate-200 rounded text-sm bg-white appearance-none min-w-[140px] focus:outline-none focus:border-emerald-500">
                    <option>全部门店</option>
                    <option>棠小一(主店)</option>
                 </select>
                 <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
              </div>
              <button className="px-6 py-2 bg-emerald-500 text-white rounded text-sm font-medium hover:bg-emerald-600">
                 查询
              </button>
           </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-sm shadow-sm overflow-hidden min-h-[500px]">
        
        {/* DAILY REPORT */}
        {activeTab === 'DAILY' && (
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                   <tr>
                      <th className="p-4 font-bold">日期</th>
                      <th className="p-4 font-bold text-right">订单数</th>
                      <th className="p-4 font-bold text-right">营业总额 (元)</th>
                      <th className="p-4 font-bold text-right">优惠/折扣 (元)</th>
                      <th className="p-4 font-bold text-right text-emerald-600">实收金额 (元)</th>
                      <th className="p-4 font-bold text-right">客单价 (元)</th>
                      <th className="p-4 font-bold text-right">客流量</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {DAILY_DATA.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                         <td className="p-4 font-mono text-slate-600">{row.date}</td>
                         <td className="p-4 text-right">{row.orders}</td>
                         <td className="p-4 text-right">{parseFloat(row.gross).toLocaleString()}</td>
                         <td className="p-4 text-right text-slate-400">-{parseFloat(row.discounts).toLocaleString()}</td>
                         <td className="p-4 text-right font-bold text-slate-800">{parseFloat(row.net).toLocaleString()}</td>
                         <td className="p-4 text-right text-slate-600">{row.avg}</td>
                         <td className="p-4 text-right">{row.customers}</td>
                      </tr>
                   ))}
                   <tr className="bg-emerald-50 font-bold text-emerald-900">
                      <td className="p-4">合计</td>
                      <td className="p-4 text-right">{DAILY_DATA.reduce((a,b) => a + b.orders, 0)}</td>
                      <td className="p-4 text-right">{DAILY_DATA.reduce((a,b) => a + parseFloat(b.gross), 0).toLocaleString('zh-CN', {minimumFractionDigits: 2})}</td>
                      <td className="p-4 text-right">-{DAILY_DATA.reduce((a,b) => a + parseFloat(b.discounts), 0).toLocaleString('zh-CN', {minimumFractionDigits: 2})}</td>
                      <td className="p-4 text-right">{DAILY_DATA.reduce((a,b) => a + parseFloat(b.net), 0).toLocaleString('zh-CN', {minimumFractionDigits: 2})}</td>
                      <td className="p-4 text-right">-</td>
                      <td className="p-4 text-right">{DAILY_DATA.reduce((a,b) => a + b.customers, 0)}</td>
                   </tr>
                </tbody>
             </table>
          </div>
        )}

        {/* PRODUCT REPORT */}
        {activeTab === 'PRODUCT' && (
          <div>
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="text" placeholder="搜索商品名称" className="pl-9 pr-4 py-1.5 border border-slate-200 rounded text-sm bg-white focus:outline-none focus:border-emerald-500 w-64" />
               </div>
               <div className="text-xs text-slate-500">
                  按销量降序排列
               </div>
            </div>
            <table className="w-full text-left text-sm">
               <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                     <th className="p-4 font-bold w-20">排名</th>
                     <th className="p-4 font-bold">商品名称</th>
                     <th className="p-4 font-bold">所属分类</th>
                     <th className="p-4 font-bold text-right">销售数量</th>
                     <th className="p-4 font-bold text-right">销售额 (元)</th>
                     <th className="p-4 font-bold text-right">成本 (元)</th>
                     <th className="p-4 font-bold text-right text-emerald-600">毛利 (元)</th>
                     <th className="p-4 font-bold text-right">毛利率</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {PRODUCT_DATA.map((row, i) => (
                     <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 text-slate-400 font-mono text-center">{i + 1}</td>
                        <td className="p-4 font-medium text-slate-800">{row.name}</td>
                        <td className="p-4 text-slate-500 text-xs">
                           <span className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200">{row.cat}</span>
                        </td>
                        <td className="p-4 text-right">{row.qty}</td>
                        <td className="p-4 text-right">{row.gross.toFixed(2)}</td>
                        <td className="p-4 text-right text-slate-500">{row.cost.toFixed(2)}</td>
                        <td className="p-4 text-right font-bold text-emerald-600">{row.profit.toFixed(2)}</td>
                        <td className="p-4 text-right text-slate-600">{row.margin}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
          </div>
        )}

        {/* CATEGORY REPORT */}
        {activeTab === 'CATEGORY' && (
          <div className="p-8">
             <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="border border-slate-200 rounded-lg p-6">
                   <h3 className="font-bold text-slate-700 mb-4">销售额占比</h3>
                   <div className="space-y-4">
                      {CATEGORY_DATA.map((cat, i) => (
                         <div key={i}>
                            <div className="flex justify-between text-sm mb-1">
                               <span>{cat.name}</span>
                               <span className="font-medium">{cat.ratio}</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2">
                               <div 
                                  className={`h-2 rounded-full ${i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-blue-500' : i === 2 ? 'bg-orange-500' : 'bg-slate-400'}`} 
                                  style={{ width: cat.ratio }}
                               ></div>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
                <div className="border border-slate-200 rounded-lg p-6 flex flex-col justify-center items-center text-center bg-slate-50">
                   <Coffee size={48} className="text-emerald-500 mb-4" />
                   <h3 className="text-xl font-bold text-slate-800">蛋糕甜点</h3>
                   <p className="text-slate-500 mb-4">当前销售冠军分类</p>
                   <div className="text-3xl font-bold text-emerald-600">¥12,450.00</div>
                   <p className="text-xs text-slate-400 mt-2">占总销售额 42%</p>
                </div>
             </div>

             <table className="w-full text-left text-sm border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                   <tr>
                      <th className="p-4 font-bold">分类名称</th>
                      <th className="p-4 font-bold text-right">销售数量</th>
                      <th className="p-4 font-bold text-right">销售金额 (元)</th>
                      <th className="p-4 font-bold text-right">占比</th>
                      <th className="p-4 font-bold text-right">趋势</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                   {CATEGORY_DATA.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                         <td className="p-4 font-medium text-slate-800">{row.name}</td>
                         <td className="p-4 text-right">{row.qty}</td>
                         <td className="p-4 text-right font-bold">{row.sales.toFixed(2)}</td>
                         <td className="p-4 text-right">{row.ratio}</td>
                         <td className="p-4 text-right flex justify-end items-center gap-1">
                            {i < 2 ? <ArrowUpRight size={14} className="text-red-500"/> : <ArrowDownRight size={14} className="text-green-500"/>}
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}

      </div>
    </div>
  );
};

export default Reports;
