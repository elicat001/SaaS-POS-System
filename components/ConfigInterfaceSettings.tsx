
import React from 'react';
import { Link } from 'react-router-dom';
import { Battery, Signal, Wifi, User, Search, ShoppingCart, ShoppingBag, Home, List, Settings, ChevronRight, Hexagon } from 'lucide-react';

const ConfigInterfaceSettings: React.FC = () => {
  return (
    <div className="bg-white rounded-sm shadow-sm min-h-[90vh] flex flex-col">
      {/* Header Actions */}
      <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6">
         <div className="flex gap-2">
            <button className="px-4 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-sm font-medium">首页</button>
            <button className="px-4 py-1.5 text-slate-600 hover:bg-slate-50 rounded text-sm font-medium">加载页</button>
         </div>
         <div className="flex gap-3">
            <button className="px-6 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 text-sm">保存</button>
            <button className="px-4 py-2 border border-slate-200 text-slate-600 rounded hover:bg-slate-50 text-sm">保存到记录</button>
            <Link to="/config/templates" className="px-4 py-2 border border-slate-200 text-slate-600 rounded hover:bg-slate-50 text-sm">
              查看模板
            </Link>
         </div>
      </div>

      {/* Toolbar */}
      <div className="h-12 border-b border-slate-200 flex items-center px-6 gap-6 text-sm text-slate-600 bg-slate-50">
         {['首页', '点餐页', '商品详情页', '订单中心', '个人中心', '会员页', '用户下单弹幕', '底部导航设计', '专题页面', '充值页面'].map((item, i) => (
            <span key={item} className={`cursor-pointer hover:text-emerald-500 ${i === 0 ? 'text-slate-900 font-bold' : ''}`}>{item}</span>
         ))}
      </div>

      <div className="flex-1 flex bg-slate-100 p-6 gap-6 overflow-hidden">
         {/* Left Panel: Modules */}
         <div className="w-64 flex flex-col gap-4 overflow-y-auto scrollbar-hide">
            <div className="bg-white rounded p-4 shadow-sm">
               <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-slate-700">开启首页</span>
                  <div className="w-10 h-5 bg-emerald-500 rounded-full relative cursor-pointer">
                     <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded p-4 shadow-sm">
               <div className="flex items-center gap-1 text-sm font-bold text-slate-700 mb-4">
                  极简组件 <span className="text-slate-300 font-normal">?</span>
               </div>
               <div className="grid grid-cols-3 gap-2">
                  {[
                     {name: '焦点入口', icon: 'II'},
                     {name: '集章/集点卡', icon: '★'},
                     {name: '领取优惠券', icon: '¥'},
                     {name: '储值余额', icon: '¥'},
                     {name: '悬浮窗口', icon: '□'},
                     {name: '会员积分', icon: '○'},
                     {name: '客服入口', icon: '💬'},
                     {name: '附近门店', icon: '⌂'},
                  ].map(item => (
                     <div key={item.name} className="aspect-square border border-slate-100 rounded flex flex-col items-center justify-center gap-1 hover:border-emerald-400 hover:bg-emerald-50 cursor-pointer group">
                        <span className="text-slate-300 group-hover:text-emerald-500">{item.icon}</span>
                        <span className="text-[10px] text-slate-500 scale-90">{item.name}</span>
                     </div>
                  ))}
               </div>
            </div>

            <div className="bg-white rounded p-4 shadow-sm">
               <div className="flex items-center gap-1 text-sm font-bold text-slate-700 mb-4">
                  组件
               </div>
               <div className="grid grid-cols-3 gap-2">
                  {[
                     {name: '轮播图', icon: '🖼'},
                     {name: '导航', icon: '::'},
                     {name: '门店列表', icon: '≡'},
                  ].map(item => (
                     <div key={item.name} className="aspect-square border border-slate-100 rounded flex flex-col items-center justify-center gap-1 hover:border-emerald-400 hover:bg-emerald-50 cursor-pointer group">
                        <span className="text-slate-300 group-hover:text-emerald-500">{item.icon}</span>
                        <span className="text-[10px] text-slate-500 scale-90">{item.name}</span>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Center Panel: Phone Preview */}
         <div className="flex-1 flex justify-center">
            <div className="w-[375px] h-[720px] bg-white rounded-[30px] shadow-2xl border-[8px] border-slate-800 overflow-hidden relative flex flex-col">
               {/* Status Bar */}
               <div className="h-10 bg-slate-100 flex items-center justify-between px-6 text-xs font-bold">
                  <span>9:41</span>
                  <div className="flex gap-1.5">
                     <Signal size={12} />
                     <Wifi size={12} />
                     <Battery size={12} />
                  </div>
               </div>

               {/* App Header */}
               <div className="bg-slate-100 p-4 relative">
                  <div className="flex justify-between items-start">
                     <div className="w-32 h-12 relative">
                        <h1 className="text-2xl font-bold text-slate-800 italic">棠小一</h1>
                        <span className="absolute top-0 right-0 text-[8px] border border-slate-800 rounded-full w-3 h-3 flex items-center justify-center">R</span>
                     </div>
                     <div className="flex gap-2">
                        <div className="w-8 h-6 bg-white rounded-full border border-slate-300 flex items-center justify-center">•••</div>
                        <div className="w-8 h-6 bg-white rounded-full border border-slate-300 flex items-center justify-center">◎</div>
                     </div>
                  </div>
                  {/* Illustration */}
                  <div className="mt-2 flex justify-center">
                     <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&q=80" className="w-32 h-32 object-cover rounded-full" alt="cat" />
                  </div>
               </div>

               {/* Content Body */}
               <div className="flex-1 bg-white p-4 relative -mt-4 rounded-t-3xl shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                  <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-4">
                     <div className="flex justify-between items-start mb-1">
                        <h2 className="text-xl font-bold text-slate-800">Hello</h2>
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-white"><User size={20} /></div>
                     </div>
                     <div className="flex items-center gap-2 mb-4">
                        <h3 className="font-bold text-slate-900">微信昵称</h3>
                        <span className="bg-amber-100 text-amber-600 text-[10px] px-1.5 rounded font-bold">VIP1</span>
                        <span className="ml-auto bg-[#fcd34d] text-slate-800 text-xs px-2 py-0.5 rounded font-bold">💳 会员码</span>
                     </div>
                     <p className="text-xs text-slate-400 mb-6">再消费500元升为V2</p>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 rounded-lg p-3 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-emerald-50 group">
                           <Home className="text-slate-400 group-hover:text-emerald-500" />
                           <span className="font-bold text-slate-700">堂食</span>
                           <span className="text-[10px] text-slate-400 uppercase">Dine In</span>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-emerald-50 group">
                           <ShoppingBag className="text-slate-400 group-hover:text-emerald-500" />
                           <span className="font-bold text-slate-700">自取</span>
                           <span className="text-[10px] text-slate-400 uppercase">Pick Up</span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Bottom Nav */}
               <div className="h-16 border-t border-slate-200 flex justify-around items-center text-slate-400 text-[10px]">
                  <div className="flex flex-col items-center gap-1 text-emerald-500">
                     <Home size={20} />
                     <span>首页</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                     <List size={20} />
                     <span>点餐</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                     <ShoppingCart size={20} />
                     <span>订单</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                     <User size={20} />
                     <span>我的</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Right Panel: Config */}
         <div className="w-72 bg-white rounded p-4 shadow-sm overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
               <span className="font-bold text-slate-700">全屏配置</span>
               <Settings size={16} className="text-slate-400" />
            </div>

            {['轮播图', '焦点入口', '开通条件', '自由容器', '自由容器'].map((item, i) => (
               <div key={i} className="flex justify-between items-center py-3 border-b border-slate-100 text-sm text-slate-600 hover:text-emerald-500 cursor-pointer">
                  <span>{item}</span>
                  <div className="flex items-center gap-2 text-slate-300">
                     <List size={14} />
                  </div>
               </div>
            ))}
            
            <div className="mt-4 pt-2 border-t border-slate-100 flex justify-between items-center text-sm text-slate-600 cursor-pointer">
               <span>页面设置</span>
               <Hexagon size={16} className="text-slate-400" />
            </div>
         </div>
      </div>
    </div>
  );
};

export default ConfigInterfaceSettings;
