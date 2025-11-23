
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Smartphone, Layout, Type, Image as ImageIcon, Grid, 
  Megaphone, Search, ShoppingBag, Plus, Trash2, 
  ChevronLeft, Eye, Save, Move, Palette, Layers,
  CreditCard, MapPin, AlignLeft, CheckCircle2
} from 'lucide-react';

// --- Types ---
type WidgetType = 'SEARCH' | 'BANNER' | 'GRID_NAV' | 'NOTICE' | 'PRODUCT_FEED' | 'TITLE' | 'SPACER';

interface Widget {
  id: string;
  type: WidgetType;
  props: any;
}

interface PageConfig {
  id: string;
  name: string;
  backgroundColor: string;
  widgets: Widget[];
}

// --- Mock Initial Data ---
const INITIAL_WIDGETS: Widget[] = [
  { 
    id: 'w1', 
    type: 'SEARCH', 
    props: { placeholder: '搜索好吃的...', style: 'ROUNDED', background: '#ffffff' } 
  },
  { 
    id: 'w2', 
    type: 'BANNER', 
    props: { 
      height: 160, 
      images: [
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80',
        'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&q=80'
      ] 
    } 
  },
  {
    id: 'w3',
    type: 'GRID_NAV',
    props: {
      cols: 5,
      items: [
        { label: '点餐', icon: 'Utensils', color: '#10b981' },
        { label: '外卖', icon: 'ShoppingBag', color: '#3b82f6' },
        { label: '会员', icon: 'Crown', color: '#f59e0b' },
        { label: '优惠券', icon: 'Ticket', color: '#ef4444' },
        { label: '签到', icon: 'Calendar', color: '#8b5cf6' },
      ]
    }
  },
  {
    id: 'w4',
    type: 'NOTICE',
    props: { text: '📢 新店开业，全场8.8折！会员充值更有好礼相送~' }
  },
  {
    id: 'w5',
    type: 'PRODUCT_FEED',
    props: { title: '店长推荐', mode: 'DOUBLE' }
  }
];

const COMPONENT_LIBRARY = [
  { type: 'SEARCH', label: '搜索框', icon: Search, category: '基础' },
  { type: 'TITLE', label: '标题文本', icon: Type, category: '基础' },
  { type: 'SPACER', label: '辅助空白', icon: AlignLeft, category: '基础' },
  { type: 'BANNER', label: '图片轮播', icon: ImageIcon, category: '媒体' },
  { type: 'GRID_NAV', label: '金刚区导航', icon: Grid, category: '导航' },
  { type: 'NOTICE', label: '公告栏', icon: Megaphone, category: '营销' },
  { type: 'PRODUCT_FEED', label: '商品列表', icon: ShoppingBag, category: '业务' },
  { type: 'STORE_INFO', label: '门店信息', icon: MapPin, category: '业务' },
  { type: 'MEMBER_CARD', label: '会员卡片', icon: CreditCard, category: '业务' },
];

const ConfigInterfaceSettings: React.FC = () => {
  const [activePage, setActivePage] = useState('HOME');
  const [widgets, setWidgets] = useState<Widget[]>(INITIAL_WIDGETS);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
  const [pageSettings, setPageSettings] = useState({ title: '首页', bgColor: '#f8fafc' });

  const selectedWidget = widgets.find(w => w.id === selectedWidgetId);

  // --- Handlers ---
  const handleAddWidget = (type: WidgetType) => {
    const newWidget: Widget = {
      id: `w-${Date.now()}`,
      type,
      props: getDefaultProps(type)
    };
    setWidgets([...widgets, newWidget]);
    setSelectedWidgetId(newWidget.id);
  };

  const handleRemoveWidget = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setWidgets(widgets.filter(w => w.id !== id));
    if (selectedWidgetId === id) setSelectedWidgetId(null);
  };

  const handleUpdateProps = (key: string, value: any) => {
    if (!selectedWidgetId) return;
    setWidgets(widgets.map(w => 
      w.id === selectedWidgetId ? { ...w, props: { ...w.props, [key]: value } } : w
    ));
  };

  const getDefaultProps = (type: WidgetType) => {
    switch (type) {
      case 'SEARCH': return { placeholder: '搜索商品', style: 'ROUNDED', background: '#fff' };
      case 'BANNER': return { height: 160, images: ['https://placehold.co/400x200'] };
      case 'GRID_NAV': return { cols: 4, items: [{label: '导航1'}, {label: '导航2'}, {label: '导航3'}, {label: '导航4'}] };
      case 'NOTICE': return { text: '请填写公告内容' };
      case 'TITLE': return { text: '标题文本', align: 'left', size: '16px' };
      case 'SPACER': return { height: 20, background: 'transparent' };
      case 'PRODUCT_FEED': return { title: '推荐商品', mode: 'DOUBLE' };
      default: return {};
    }
  };

  // --- Renderers ---

  // 1. Mobile Renderer (The "Preview")
  const renderMobileWidget = (widget: Widget) => {
    const isSelected = selectedWidgetId === widget.id;
    const { type, props } = widget;

    let content = null;
    switch (type) {
      case 'SEARCH':
        content = (
          <div className="p-3" style={{ backgroundColor: props.background }}>
            <div className={`bg-slate-100 text-slate-400 px-4 py-2 text-sm flex items-center gap-2 ${props.style === 'ROUNDED' ? 'rounded-full' : 'rounded-md'}`}>
              <Search size={14} /> {props.placeholder}
            </div>
          </div>
        );
        break;
      case 'BANNER':
        content = (
          <div className="w-full bg-slate-200 relative overflow-hidden" style={{ height: props.height }}>
            <img src={props.images[0]} alt="Banner" className="w-full h-full object-cover" />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              <div className="w-4 h-1 bg-white rounded-full"></div>
              <div className="w-1.5 h-1 bg-white/50 rounded-full"></div>
            </div>
          </div>
        );
        break;
      case 'GRID_NAV':
        content = (
          <div className="p-4 bg-white grid gap-4" style={{ gridTemplateColumns: `repeat(${props.cols || 5}, 1fr)` }}>
            {props.items?.map((item: any, i: number) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl" style={{color: item.color}}>
                  {/* Mock Icons based on config */}
                  <div className="w-6 h-6 rounded bg-current opacity-20"></div>
                </div>
                <span className="text-xs text-slate-600">{item.label}</span>
              </div>
            ))}
          </div>
        );
        break;
      case 'NOTICE':
        content = (
          <div className="px-3 py-2 bg-orange-50 text-orange-600 text-xs flex items-center gap-2">
            <Megaphone size={14} />
            <span className="truncate">{props.text}</span>
          </div>
        );
        break;
      case 'PRODUCT_FEED':
        content = (
          <div className="p-3">
             {props.title && <h3 className="font-bold text-slate-800 mb-3 text-sm">{props.title}</h3>}
             <div className={`grid gap-3 ${props.mode === 'DOUBLE' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {[1,2,3,4].map(i => (
                  <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm">
                     <div className="aspect-square bg-slate-100"></div>
                     <div className="p-2">
                        <div className="h-4 bg-slate-100 rounded w-3/4 mb-2"></div>
                        <div className="flex justify-between items-center">
                           <div className="h-4 bg-red-50 w-12 rounded text-xs text-red-500 font-bold px-1">¥ 9.9</div>
                           <div className="w-5 h-5 bg-emerald-500 rounded-full text-white flex items-center justify-center text-xs">+</div>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        );
        break;
      case 'SPACER':
        content = <div style={{ height: props.height, backgroundColor: props.background }}></div>;
        break;
      case 'TITLE':
        content = (
           <div className="px-4 py-2 bg-transparent" style={{ textAlign: props.align }}>
             <span style={{ fontSize: props.size, fontWeight: 'bold' }}>{props.text}</span>
           </div>
        );
        break;
      default:
        content = <div className="p-4 text-center text-slate-400 border border-dashed">未知组件</div>;
    }

    return (
      <div 
        key={widget.id}
        onClick={() => setSelectedWidgetId(widget.id)}
        className={`relative cursor-pointer transition-all group hover:opacity-90 ${isSelected ? 'ring-2 ring-emerald-500 z-10' : 'hover:ring-1 hover:ring-slate-300'}`}
      >
        {content}
        {isSelected && (
           <button 
             onClick={(e) => handleRemoveWidget(e, widget.id)}
             className="absolute -right-3 -top-3 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-sm z-20 hover:scale-110 transition-transform"
           >
             <Trash2 size={12} />
           </button>
        )}
      </div>
    );
  };

  // 2. Property Inspector (Right Panel)
  const renderPropertyPanel = () => {
    if (!selectedWidget) {
      return (
        <div className="p-6">
          <div className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
             <Layout size={16}/> 页面设置
          </div>
          <div className="space-y-4">
             <div>
                <label className="text-xs text-slate-500 mb-1 block">页面标题</label>
                <input 
                  type="text" 
                  value={pageSettings.title}
                  onChange={(e) => setPageSettings({...pageSettings, title: e.target.value})}
                  className="w-full border border-slate-200 rounded px-3 py-2 text-sm" 
                />
             </div>
             <div>
                <label className="text-xs text-slate-500 mb-1 block">背景颜色</label>
                <div className="flex items-center gap-2">
                   <input 
                      type="color" 
                      value={pageSettings.bgColor}
                      onChange={(e) => setPageSettings({...pageSettings, bgColor: e.target.value})}
                      className="w-8 h-8 rounded cursor-pointer border-none" 
                   />
                   <span className="text-xs text-slate-600 font-mono">{pageSettings.bgColor}</span>
                </div>
             </div>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6 animate-in slide-in-from-right-2 duration-200">
         <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
            <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
               <Palette size={16}/> 组件属性
            </div>
            <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{selectedWidget.type}</span>
         </div>

         {/* Dynamic Form based on Type */}
         <div className="space-y-5">
            {selectedWidget.type === 'SEARCH' && (
              <>
                <div>
                   <label className="text-xs text-slate-500 mb-1 block">提示文字</label>
                   <input 
                      type="text" 
                      value={selectedWidget.props.placeholder}
                      onChange={e => handleUpdateProps('placeholder', e.target.value)}
                      className="w-full border border-slate-200 rounded px-3 py-2 text-sm"
                   />
                </div>
                <div>
                   <label className="text-xs text-slate-500 mb-1 block">框体样式</label>
                   <div className="grid grid-cols-2 gap-2">
                      <button 
                         onClick={() => handleUpdateProps('style', 'ROUNDED')}
                         className={`py-2 text-xs border rounded ${selectedWidget.props.style === 'ROUNDED' ? 'border-emerald-500 text-emerald-600 bg-emerald-50' : 'border-slate-200 text-slate-600'}`}
                      >
                         圆角
                      </button>
                      <button 
                         onClick={() => handleUpdateProps('style', 'SQUARE')}
                         className={`py-2 text-xs border rounded ${selectedWidget.props.style === 'SQUARE' ? 'border-emerald-500 text-emerald-600 bg-emerald-50' : 'border-slate-200 text-slate-600'}`}
                      >
                         方形
                      </button>
                   </div>
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">背景颜色</label>
                  <input type="color" value={selectedWidget.props.background} onChange={e => handleUpdateProps('background', e.target.value)} />
                </div>
              </>
            )}

            {selectedWidget.type === 'BANNER' && (
               <>
                  <div>
                     <label className="text-xs text-slate-500 mb-1 block">高度 (px)</label>
                     <div className="flex items-center gap-2">
                        <input 
                          type="range" min="100" max="400" 
                          value={selectedWidget.props.height} 
                          onChange={e => handleUpdateProps('height', parseInt(e.target.value))}
                          className="flex-1 accent-emerald-500"
                        />
                        <span className="text-xs text-slate-600 w-8">{selectedWidget.props.height}</span>
                     </div>
                  </div>
                  <div>
                     <label className="text-xs text-slate-500 mb-2 block">图片设置</label>
                     <div className="space-y-2">
                        {selectedWidget.props.images.map((img: string, i: number) => (
                           <div key={i} className="flex gap-2">
                              <div className="w-12 h-12 bg-slate-100 rounded bg-cover bg-center shrink-0" style={{backgroundImage: `url(${img})`}}></div>
                              <input type="text" value={img} className="flex-1 border border-slate-200 rounded px-2 text-xs text-slate-500" readOnly />
                           </div>
                        ))}
                        <button className="w-full py-2 border border-dashed border-slate-300 rounded text-slate-400 text-xs hover:border-emerald-500 hover:text-emerald-500">
                           + 添加图片
                        </button>
                     </div>
                  </div>
               </>
            )}

            {selectedWidget.type === 'GRID_NAV' && (
               <>
                  <div>
                     <label className="text-xs text-slate-500 mb-1 block">列数</label>
                     <div className="flex bg-slate-100 rounded p-1">
                        {[3, 4, 5].map(col => (
                           <button 
                              key={col}
                              onClick={() => handleUpdateProps('cols', col)}
                              className={`flex-1 text-xs py-1 rounded ${selectedWidget.props.cols === col ? 'bg-white shadow-sm font-bold text-emerald-600' : 'text-slate-500'}`}
                           >
                              {col}列
                           </button>
                        ))}
                     </div>
                  </div>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                     <label className="text-xs text-slate-500 block">导航项</label>
                     {selectedWidget.props.items.map((item: any, i: number) => (
                        <div key={i} className="flex items-center gap-2 bg-slate-50 p-2 rounded border border-slate-100">
                           <div className="w-6 h-6 rounded bg-slate-200"></div>
                           <input 
                              className="flex-1 bg-transparent border-none text-xs focus:ring-0 px-0"
                              value={item.label}
                              onChange={(e) => {
                                 const newItems = [...selectedWidget.props.items];
                                 newItems[i].label = e.target.value;
                                 handleUpdateProps('items', newItems);
                              }}
                           />
                        </div>
                     ))}
                  </div>
               </>
            )}

            {selectedWidget.type === 'NOTICE' && (
               <div>
                  <label className="text-xs text-slate-500 mb-1 block">公告内容</label>
                  <textarea 
                     value={selectedWidget.props.text}
                     onChange={e => handleUpdateProps('text', e.target.value)}
                     className="w-full border border-slate-200 rounded px-3 py-2 text-sm h-24 resize-none focus:outline-none focus:border-emerald-500"
                  />
               </div>
            )}

            {selectedWidget.type === 'TITLE' && (
               <>
                  <div>
                     <label className="text-xs text-slate-500 mb-1 block">标题内容</label>
                     <input 
                        type="text" 
                        value={selectedWidget.props.text}
                        onChange={e => handleUpdateProps('text', e.target.value)}
                        className="w-full border border-slate-200 rounded px-3 py-2 text-sm"
                     />
                  </div>
                  <div>
                     <label className="text-xs text-slate-500 mb-1 block">对齐方式</label>
                     <div className="flex bg-slate-100 rounded p-1">
                        {['left', 'center', 'right'].map(align => (
                           <button 
                              key={align}
                              onClick={() => handleUpdateProps('align', align)}
                              className={`flex-1 text-xs py-1 rounded capitalize ${selectedWidget.props.align === align ? 'bg-white shadow-sm font-bold text-emerald-600' : 'text-slate-500'}`}
                           >
                              {align}
                           </button>
                        ))}
                     </div>
                  </div>
               </>
            )}

            {selectedWidget.type === 'SPACER' && (
               <>
                  <div>
                     <label className="text-xs text-slate-500 mb-1 block">高度 (px)</label>
                     <input 
                        type="number" 
                        value={selectedWidget.props.height}
                        onChange={e => handleUpdateProps('height', parseInt(e.target.value))}
                        className="w-full border border-slate-200 rounded px-3 py-2 text-sm"
                     />
                  </div>
                  <div>
                     <label className="text-xs text-slate-500 mb-1 block">背景颜色</label>
                     <input type="color" value={selectedWidget.props.background} onChange={e => handleUpdateProps('background', e.target.value)} />
                  </div>
               </>
            )}
         </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-slate-50 -m-6 rounded-none">
      
      {/* Top Bar */}
      <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
         <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-sm">
               <ChevronLeft size={16} /> 返回
            </button>
            <div className="h-4 w-px bg-slate-200"></div>
            <div className="flex bg-slate-100 rounded-lg p-1">
               {['HOME', 'USER', 'ORDER'].map(page => (
                  <button 
                     key={page}
                     onClick={() => { setActivePage(page); setSelectedWidgetId(null); }}
                     className={`px-4 py-1 rounded-md text-xs font-medium transition-all ${activePage === page ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                     {page === 'HOME' ? '首页装修' : page === 'USER' ? '会员中心' : '订单页'}
                  </button>
               ))}
            </div>
         </div>
         <div className="flex items-center gap-3">
            <div className="text-xs text-slate-400 flex items-center gap-1 mr-4">
               <CheckCircle2 size={12} className="text-emerald-500" /> 自动保存于 10:42
            </div>
            <Link to="/config/templates" className="px-4 py-2 border border-slate-200 text-slate-600 rounded text-sm hover:bg-slate-50">
               切换模板
            </Link>
            <button className="px-4 py-2 border border-slate-200 text-slate-600 rounded text-sm hover:bg-slate-50 flex items-center gap-2">
               <Eye size={16} /> 预览
            </button>
            <button className="px-6 py-2 bg-emerald-500 text-white rounded text-sm font-medium hover:bg-emerald-600 flex items-center gap-2 shadow-sm shadow-emerald-200">
               <Save size={16} /> 发布装修
            </button>
         </div>
      </div>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
         
         {/* Left: Component Library */}
         <div className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 z-10">
            <div className="p-4 border-b border-slate-100">
               <h3 className="text-sm font-bold text-slate-800">组件库</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
               {['基础', '媒体', '导航', '业务', '营销'].map(cat => (
                  <div key={cat}>
                     <div className="text-xs font-medium text-slate-400 mb-3 ml-1">{cat}组件</div>
                     <div className="grid grid-cols-2 gap-3">
                        {COMPONENT_LIBRARY.filter(c => c.category === cat).map(comp => (
                           <div 
                              key={comp.type}
                              onClick={() => handleAddWidget(comp.type as WidgetType)}
                              className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-100 rounded hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 cursor-pointer transition-all group"
                           >
                              <comp.icon size={24} className="mb-2 text-slate-400 group-hover:text-emerald-500" strokeWidth={1.5} />
                              <span className="text-xs text-slate-600 group-hover:text-emerald-700">{comp.label}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Center: Canvas */}
         <div className="flex-1 bg-slate-100 flex justify-center pt-8 pb-8 overflow-y-auto relative">
            <div 
               className="w-[375px] bg-white shadow-2xl rounded-none min-h-[750px] flex flex-col relative transition-all"
               style={{ backgroundColor: pageSettings.bgColor }}
               onClick={() => setSelectedWidgetId(null)}
            >
               {/* Phone Frame Header */}
               <div className="h-12 bg-white sticky top-0 z-30 flex items-center justify-center border-b border-slate-100/50 backdrop-blur-sm bg-white/80" onClick={(e) => e.stopPropagation()}>
                  <span className="font-bold text-slate-800">{pageSettings.title}</span>
                  <div className="absolute right-4 flex gap-1">
                     <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                     <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                  </div>
               </div>

               {/* Widgets */}
               <div className="flex-1 pb-10">
                  {widgets.length === 0 ? (
                     <div className="flex flex-col items-center justify-center h-64 text-slate-300">
                        <Plus size={48} strokeWidth={1} />
                        <p className="text-sm mt-4">点击左侧添加组件</p>
                     </div>
                  ) : (
                     widgets.map(renderMobileWidget)
                  )}
               </div>
            </div>

            {/* Canvas Helpers */}
            <div className="absolute bottom-6 flex gap-4">
               <button className="bg-white px-4 py-2 rounded-full shadow-lg text-xs font-medium text-slate-600 flex items-center gap-2 hover:text-emerald-600">
                  <Move size={14} /> 拖拽模式 (暂未启用)
               </button>
            </div>
         </div>

         {/* Right: Property Panel */}
         <div className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 z-10 overflow-y-auto">
            {renderPropertyPanel()}
         </div>
      </div>
    </div>
  );
};

export default ConfigInterfaceSettings;
