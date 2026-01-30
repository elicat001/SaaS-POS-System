
import React from 'react';
import { Search } from 'lucide-react';

const CashierManagement: React.FC = () => {
  return (
    <div className="space-y-4">
       <div className="bg-white p-6 rounded-sm shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-6">收银管理</h2>
          
          <div className="grid grid-cols-5 gap-8 mb-8">
             {[
               { label: '今日收银(笔)', val: '0' },
               { label: '今日收银金额', val: '0' },
               { label: '今日微信支付收银', val: '0' },
               { label: '今日支付宝收银', val: '0' },
               { label: '今日现金收银', val: '0' },
               { label: '今日余额收银', val: '0' },
               { label: '今日现金收银', val: '0' }, // Duplicate in screenshot, keeping as is
             ].map((item, i) => (
               <div key={i}>
                  <div className="text-slate-500 text-sm mb-1">{item.label}</div>
                  <div className="text-2xl font-bold text-slate-800">{item.val}</div>
               </div>
             ))}
          </div>

          <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
             <span className="text-slate-600 font-medium">收款金额</span>
             <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">¥</span>
                <input type="number" className="pl-8 pr-4 py-2 border border-slate-200 rounded w-64 focus:outline-none focus:border-emerald-500" />
             </div>
             <button className="bg-emerald-500 text-white px-8 py-2 rounded font-medium hover:bg-emerald-600">提交</button>
          </div>
       </div>

       <div className="bg-white p-4 rounded-sm shadow-sm min-h-[400px]">
          <div className="flex flex-wrap gap-4 items-center mb-4">
             <div className="text-sm text-slate-500">日期</div>
             <input type="text" value="2025-11-19 - 2025-11-19" className="border border-slate-200 rounded px-3 py-1.5 text-sm w-64" readOnly />
             <div className="flex gap-4 text-sm text-emerald-500 font-medium px-2">
                <span>今天</span>
                <span>昨天</span>
                <span>近1个月</span>
                <span>本月</span>
                <span>上个月</span>
             </div>
             <div className="ml-auto flex items-center gap-2">
                <span className="text-sm text-slate-500">搜索</span>
                <input type="text" placeholder="搜索昵称/手机号码" className="border border-slate-200 rounded px-3 py-1.5 text-sm w-48 focus:outline-none" />
                <button className="bg-emerald-500 text-white px-6 py-1.5 rounded text-sm hover:bg-emerald-600">查询</button>
             </div>
          </div>

          <div className="grid grid-cols-5 text-sm font-medium text-slate-500 py-3 bg-slate-50 border-b border-slate-100 text-center">
             <div>用户</div>
             <div>金额</div>
             <div>类型</div>
             <div>支付时间</div>
             <div>状态</div>
          </div>
          
          <div className="py-20 text-center text-slate-400 text-sm">
             暂无数据
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 pt-4 border-t border-slate-100">
             <span>共0条</span>
             <select className="border border-slate-200 rounded px-2 py-1"><option>10条/页</option></select>
             <div className="flex gap-1">
                <button className="w-6 h-6 border border-slate-200 rounded bg-slate-50 text-slate-400">&lt;</button>
                <button className="w-6 h-6 bg-blue-500 text-white rounded">1</button>
                <button className="w-6 h-6 border border-slate-200 rounded bg-slate-50 text-slate-400">&gt;</button>
             </div>
             <span>前往 <input type="text" className="w-8 border border-slate-200 text-center" defaultValue="1"/> 页</span>
          </div>
       </div>
    </div>
  );
};

export default CashierManagement;
