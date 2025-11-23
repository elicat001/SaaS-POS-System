
import React from 'react';
import { Check, Monitor, Smartphone } from 'lucide-react';

const ConfigTemplateGallery: React.FC = () => {
  const templates = [
    {
      id: 1,
      name: '标准餐饮版',
      description: '适用于大多数快餐、正餐餐厅。包含完整的点餐、外卖、排队、预订功能。',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&q=80',
      active: true,
      category: '通用'
    },
    {
      id: 2,
      name: '茶饮烘焙版',
      description: '专为奶茶店、咖啡馆、面包房设计。强调商品展示和规格选择，支持杯型、糖度等自定义。',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80',
      active: false,
      category: '茶饮'
    },
    {
      id: 3,
      name: '零售便利版',
      description: '适用于便利店、水果店、生鲜超市。支持条码扫描、称重商品、库存管理。',
      image: 'https://images.unsplash.com/photo-1604719312566-b7cb60936928?w=400&q=80',
      active: false,
      category: '零售'
    },
    {
      id: 4,
      name: '火锅烧烤版',
      description: '适用于火锅店、烧烤店。支持桌台点餐、加菜、多人同时点餐功能。',
      image: 'https://images.unsplash.com/photo-1599488615731-7e51281906ef?w=400&q=80',
      active: false,
      category: '餐饮'
    },
     {
      id: 5,
      name: '夜店酒吧版',
      description: '适用于酒吧、KTV。支持存酒、预订卡座、互动大屏功能。',
      image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=400&q=80',
      active: false,
      category: '娱乐'
    },
     {
      id: 6,
      name: '极简纯净版',
      description: '去除冗余功能，仅保留核心点餐支付流程，追求极致速度。',
      image: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=400&q=80',
      active: false,
      category: '通用'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <h2 className="text-lg font-bold text-slate-800">行业模板库</h2>
            <p className="text-sm text-slate-500 mt-1">选择适合您业态的行业模板，系统将自动配置相应的功能模块和界面风格。</p>
         </div>
         <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded text-sm font-medium hover:bg-slate-50">我的模板</button>
            <button className="px-4 py-2 bg-emerald-500 text-white rounded text-sm font-medium hover:bg-emerald-600">自定义模板</button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
         {templates.map(template => (
            <div key={template.id} className={`bg-white rounded-lg border overflow-hidden transition-all hover:shadow-md ${template.active ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-200'}`}>
               <div className="aspect-video bg-slate-100 relative group">
                  <img src={template.image} alt={template.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                     {template.category}
                  </div>
                  {template.active && (
                     <div className="absolute inset-0 bg-emerald-900/10 flex items-center justify-center">
                        <div className="bg-emerald-500 text-white px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
                           <Check size={16} /> 当前使用
                        </div>
                     </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                     <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-700 hover:text-emerald-500" title="预览小程序">
                        <Smartphone size={20} />
                     </button>
                     <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-700 hover:text-emerald-500" title="预览后台">
                        <Monitor size={20} />
                     </button>
                  </div>
               </div>
               <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                     <h3 className="font-bold text-slate-800 text-lg">{template.name}</h3>
                  </div>
                  <p className="text-sm text-slate-500 mb-6 h-10 line-clamp-2">{template.description}</p>
                  
                  <div className="flex gap-3">
                     <button 
                        className={`flex-1 py-2 rounded text-sm font-medium border transition-colors ${
                           template.active 
                              ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-default' 
                              : 'bg-white border-emerald-500 text-emerald-600 hover:bg-emerald-50'
                        }`}
                        disabled={template.active}
                     >
                        {template.active ? '已应用' : '应用此模板'}
                     </button>
                  </div>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};

export default ConfigTemplateGallery;
