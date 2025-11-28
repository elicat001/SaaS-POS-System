
import React from 'react';
import { QrCode, CheckCircle, ExternalLink } from 'lucide-react';

const ConfigMiniProgram: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Card: Mini Program Info */}
      <div className="bg-white p-8 rounded-sm shadow-sm">
        <h2 className="text-lg font-medium text-slate-800 mb-8 border-b border-slate-100 pb-4">小程序信息</h2>
        
        <div className="space-y-8">
          <div className="flex">
            <span className="w-24 text-sm text-slate-500 pt-2">小程序头像</span>
            <div>
               <div className="w-20 h-20 bg-[#fcd34d] rounded-full flex items-center justify-center text-slate-800 font-bold text-xl shadow-sm border border-[#f59e0b]">
                 棠小一
               </div>
            </div>
          </div>

          <div className="flex items-center">
            <span className="w-24 text-sm text-slate-500">小程序名称</span>
            <div className="flex items-center gap-2">
               <span className="text-slate-700">棠小一 糖少一点</span>
               <span className="bg-slate-100 text-slate-500 text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
                 🛡 交易保障
               </span>
            </div>
          </div>

          <div className="flex items-center">
             <span className="w-24 text-sm text-slate-500">小程序简介</span>
             <div className="flex items-center gap-2">
                <span className="text-slate-700">减糖甜品，贝果，早餐，咖啡</span>
                <span className="text-emerald-500 text-sm cursor-pointer">编辑</span>
             </div>
          </div>

          <div className="flex items-start">
             <span className="w-24 text-sm text-slate-500 pt-1">小程序码</span>
             <div className="flex gap-4">
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                   <QrCode size={60} className="text-slate-800" />
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                   <div className="w-[60px] h-[60px] rounded-full bg-[#fcd34d] flex items-center justify-center border border-[#f59e0b]">
                      <QrCode size={30} className="text-slate-800" />
                   </div>
                </div>
             </div>
          </div>

          <div className="flex items-center">
             <span className="w-24 text-sm text-slate-500">主体类型</span>
             <span className="text-slate-700">企业</span>
          </div>

          <div className="flex items-center">
             <span className="w-24 text-sm text-slate-500">主体名称</span>
             <span className="text-slate-700">蓬江区岚咖饮品店(个体工商户)</span>
          </div>

          <div className="flex items-center">
             <span className="w-24 text-sm text-slate-500">服务类目</span>
             <div className="flex items-center gap-4">
                <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-1 text-xs rounded">
                   餐饮服务{'>'}餐饮服务场所/餐饮服务管理企业 ×
                </span>
                <span className="text-emerald-500 text-sm cursor-pointer">添加</span>
             </div>
          </div>

          <div className="flex items-center">
             <span className="w-24 text-sm text-slate-500">实名验证</span>
             <span className="text-slate-700">实名验证成功</span>
          </div>

          <div className="flex items-center">
             <span className="w-24 text-sm text-slate-500">资质认证</span>
             <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-xs flex items-center gap-1">
               <CheckCircle size={12} /> 已认证
             </span>
          </div>

          <div className="flex items-center">
             <span className="w-24 text-sm text-slate-500">年审到期时间</span>
             <span className="text-slate-700">2026-06-23 18:19:22</span>
          </div>
        </div>
      </div>

      {/* Right Column Wrapper */}
      <div className="space-y-6">
        {/* Authorized Mini Program */}
        <div className="bg-white p-8 rounded-sm shadow-sm flex flex-col items-center text-center">
           <h2 className="text-lg font-medium text-slate-800 w-full text-left mb-8 border-b border-slate-100 pb-4">授权小程序</h2>
           
           <div className="w-24 h-24 bg-[#fcd34d] rounded-full flex items-center justify-center text-slate-800 font-bold text-2xl shadow-sm border-2 border-[#f59e0b] mb-4">
              棠小一
           </div>
           <QrCode size={24} className="text-slate-400 mb-2" />
           
           <h3 className="text-xl font-bold text-slate-800 mb-1">棠小一 糖少一点</h3>
           <p className="text-slate-500 text-sm mb-6">appid: wxa38072a364e8da11</p>
           
           <p className="text-slate-600 mb-6">当前版本号: 7.6.2</p>
           
           <div className="flex items-center gap-4 text-xs text-slate-500 mb-8 w-full justify-center">
              <span>隐私设置保护指引: <a href="#" className="text-blue-500">查询</a></span>
              <span className="text-slate-300">|</span>
              <span>地理位置接口权限: <span className="text-emerald-500">已开通</span></span>
              <span className="text-slate-300">|</span>
              <span>小程序备案: <span className="text-slate-600">已备案</span> <a href="#" className="text-blue-500">查看详情</a></span>
           </div>

           <div className="flex gap-4">
              <button className="px-6 py-2 border border-slate-200 rounded hover:bg-slate-50 text-slate-600 text-sm">预览小程序</button>
              <button className="px-6 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 text-sm font-medium">更新到 7.7.4</button>
              <button className="px-6 py-2 border border-slate-200 rounded hover:bg-slate-50 text-slate-600 text-sm">版本回退</button>
           </div>
        </div>

        {/* Bind Tester */}
        <div className="bg-white p-8 rounded-sm shadow-sm">
           <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-lg font-medium text-slate-800">绑定体验者</h2>
              <button className="px-4 py-1.5 border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50">添加体验者</button>
           </div>
           
           <div className="bg-orange-50 border border-orange-100 text-orange-600 px-4 py-3 rounded text-xs mb-6">
              如果想查看所有体验者，请到微信公众平台-登录小程序-用户身份中设置，<a href="#" className="text-blue-500 underline">点击这里跳转</a>。
           </div>

           <div className="flex gap-4">
              {['chainfind', 'chenjianxiong9975'].map(name => (
                 <div key={name} className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded border border-emerald-200 text-sm flex items-center gap-2">
                    {name}
                    <span className="cursor-pointer hover:text-emerald-800">×</span>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigMiniProgram;
