import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Smartphone, Layout, Type, Image as ImageIcon, Grid,
  Megaphone, Search, ShoppingBag, Plus, Trash2,
  ChevronLeft, Eye, Save, Move, Palette, Layers,
  CreditCard, MapPin, AlignLeft, CheckCircle2, History,
  Copy, Download, Upload, Settings, Undo2, Redo2,
  GripVertical, ChevronDown, ChevronRight, X, Loader2,
  Sparkles, Clock, Video, FileText, Minus, Tag, Zap,
  Home, User, ClipboardList, LayoutTemplate, Monitor
} from 'lucide-react';
import { interfaceApi } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';
import type {
  InterfacePage, InterfaceWidget, InterfaceTemplate, InterfaceTheme,
  InterfaceHistory, WidgetType
} from '../types';

// ==================== 组件库定义 ====================

interface ComponentDef {
  type: WidgetType;
  label: string;
  icon: React.ElementType;
  category: string;
  description: string;
  defaultProps: Record<string, unknown>;
}

const COMPONENT_LIBRARY: ComponentDef[] = [
  // 基础组件
  { type: 'SEARCH', label: '搜索框', icon: Search, category: '基础', description: '商品搜索入口',
    defaultProps: { placeholder: '搜索商品', style: 'ROUNDED', background: '#ffffff', showIcon: true } },
  { type: 'TITLE', label: '标题文本', icon: Type, category: '基础', description: '区域标题',
    defaultProps: { text: '标题文本', align: 'left', size: '16px', color: '#1e293b', bold: true, showMore: false } },
  { type: 'SPACER', label: '辅助空白', icon: Minus, category: '基础', description: '间距控制',
    defaultProps: { height: 20, background: 'transparent' } },
  { type: 'DIVIDER', label: '分割线', icon: AlignLeft, category: '基础', description: '内容分隔',
    defaultProps: { style: 'solid', color: '#e2e8f0', margin: 16 } },
  { type: 'RICH_TEXT', label: '富文本', icon: FileText, category: '基础', description: '自定义图文',
    defaultProps: { content: '<p>请编辑内容...</p>', padding: 16 } },

  // 媒体组件
  { type: 'BANNER', label: '图片轮播', icon: ImageIcon, category: '媒体', description: '轮播广告位',
    defaultProps: { height: 160, images: [{ url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80' }], autoPlay: true, interval: 3000, indicatorType: 'dots' } },
  { type: 'IMAGE', label: '单张图片', icon: ImageIcon, category: '媒体', description: '图片展示',
    defaultProps: { url: '', mode: 'aspectFill', radius: 0 } },
  { type: 'VIDEO', label: '视频', icon: Video, category: '媒体', description: '视频播放',
    defaultProps: { url: '', poster: '', autoPlay: false, loop: false, muted: true } },

  // 导航组件
  { type: 'GRID_NAV', label: '金刚区导航', icon: Grid, category: '导航', description: '图标导航入口',
    defaultProps: { cols: 5, rows: 1, items: [
      { icon: '🍜', label: '点餐', color: '#10b981' },
      { icon: '🛵', label: '外卖', color: '#3b82f6' },
      { icon: '👑', label: '会员', color: '#f59e0b' },
      { icon: '🎫', label: '优惠券', color: '#ef4444' },
      { icon: '📅', label: '签到', color: '#8b5cf6' }
    ], background: '#ffffff', iconSize: 40 } },
  { type: 'CATEGORY_NAV', label: '分类导航', icon: LayoutTemplate, category: '导航', description: '商品分类入口',
    defaultProps: { style: 'scroll', showImage: true } },

  // 业务组件
  { type: 'PRODUCT_FEED', label: '商品列表', icon: ShoppingBag, category: '业务', description: '商品展示',
    defaultProps: { title: '推荐商品', mode: 'DOUBLE', source: 'recommend', limit: 10, showPrice: true, showSales: true, showCart: true } },
  { type: 'HOT_PRODUCTS', label: '热销商品', icon: Zap, category: '业务', description: '热销榜单',
    defaultProps: { title: '热销榜', limit: 10, style: 'list' } },
  { type: 'STORE_INFO', label: '门店信息', icon: MapPin, category: '业务', description: '店铺信息卡片',
    defaultProps: { showLogo: true, showName: true, showAddress: true, showPhone: true, showHours: true, style: 'card' } },
  { type: 'MEMBER_CARD', label: '会员卡片', icon: CreditCard, category: '业务', description: '会员信息展示',
    defaultProps: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', showAvatar: true, showLevel: true, showPoints: true, showBalance: true, style: 'card' } },

  // 营销组件
  { type: 'NOTICE', label: '公告栏', icon: Megaphone, category: '营销', description: '滚动公告',
    defaultProps: { text: '欢迎光临！新用户首单立减10元~', speed: 50, background: '#fef3c7', textColor: '#d97706', showIcon: true } },
  { type: 'COUPON', label: '优惠券', icon: Tag, category: '营销', description: '优惠券领取',
    defaultProps: { title: '限时优惠', mode: 'scroll', source: 'available', limit: 5 } },
  { type: 'COUNTDOWN', label: '倒计时', icon: Clock, category: '营销', description: '活动倒计时',
    defaultProps: { title: '限时特惠', endTime: '', background: '#ef4444', textColor: '#ffffff', style: 'card' } },
  { type: 'FLASH_SALE', label: '限时秒杀', icon: Sparkles, category: '营销', description: '秒杀活动',
    defaultProps: { title: '限时秒杀', endTime: '', products: [], style: 'scroll' } },
];

const CATEGORIES = ['基础', '媒体', '导航', '业务', '营销'];

const PAGE_TYPES = [
  { type: 'home', label: '首页', icon: Home },
  { type: 'user', label: '会员中心', icon: User },
  { type: 'order', label: '订单页', icon: ClipboardList },
  { type: 'category', label: '分类页', icon: Grid },
];

// ==================== 主组件 ====================

const ConfigInterfaceSettings: React.FC = () => {
  // 状态管理
  const [currentPageType, setCurrentPageType] = useState<string>('home');
  const [page, setPage] = useState<InterfacePage | null>(null);
  const [widgets, setWidgets] = useState<InterfaceWidget[]>([]);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 面板状态
  const [activePanel, setActivePanel] = useState<'components' | 'templates' | 'theme' | 'history'>('components');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(CATEGORIES);

  // 模板和主题
  const [templates, setTemplates] = useState<InterfaceTemplate[]>([]);
  const [themes, setThemes] = useState<InterfaceTheme[]>([]);
  const [activeTheme, setActiveTheme] = useState<InterfaceTheme | null>(null);
  const [histories, setHistories] = useState<InterfaceHistory[]>([]);

  // 弹窗状态
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [showThemeEditor, setShowThemeEditor] = useState(false);
  const [templateName, setTemplateName] = useState('');

  // 操作历史（用于撤销/重做）
  const [undoStack, setUndoStack] = useState<InterfaceWidget[][]>([]);
  const [redoStack, setRedoStack] = useState<InterfaceWidget[][]>([]);

  // 拖拽状态
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const { success: showSuccess, error: showError } = useNotification();

  const selectedWidget = widgets.find(w => w.id === selectedWidgetId);

  // ==================== 数据加载 ====================

  const loadPage = useCallback(async (pageType: string) => {
    setLoading(true);
    try {
      const pageData = await interfaceApi.getPageByType(pageType);
      setPage(pageData);
      setWidgets(pageData.widgets || []);
      setSelectedWidgetId(null);
    } catch (e) {
      showError('错误', '加载页面配置失败');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const loadTemplates = useCallback(async () => {
    try {
      const data = await interfaceApi.listTemplates({ pageType: currentPageType });
      setTemplates(data);
    } catch (e) {
      console.error('加载模板失败', e);
    }
  }, [currentPageType]);

  const loadThemes = useCallback(async () => {
    try {
      const [themesData, activeThemeData] = await Promise.all([
        interfaceApi.listThemes(),
        interfaceApi.getActiveTheme()
      ]);
      setThemes(themesData);
      setActiveTheme(activeThemeData);
    } catch (e) {
      console.error('加载主题失败', e);
    }
  }, []);

  const loadHistory = useCallback(async () => {
    if (!page?.id) return;
    try {
      const data = await interfaceApi.getPageHistory(page.id);
      setHistories(data);
    } catch (e) {
      console.error('加载历史失败', e);
    }
  }, [page?.id]);

  useEffect(() => {
    loadPage(currentPageType);
  }, [currentPageType, loadPage]);

  useEffect(() => {
    loadTemplates();
    loadThemes();
  }, [loadTemplates, loadThemes]);

  useEffect(() => {
    if (activePanel === 'history') {
      loadHistory();
    }
  }, [activePanel, loadHistory]);

  // ==================== 操作处理 ====================

  const saveToUndoStack = () => {
    setUndoStack(prev => [...prev.slice(-19), [...widgets]]);
    setRedoStack([]);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const prevState = undoStack[undoStack.length - 1];
    setRedoStack(prev => [...prev, [...widgets]]);
    setUndoStack(prev => prev.slice(0, -1));
    setWidgets(prevState);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const nextState = redoStack[redoStack.length - 1];
    setUndoStack(prev => [...prev, [...widgets]]);
    setRedoStack(prev => prev.slice(0, -1));
    setWidgets(nextState);
  };

  const handleAddWidget = async (componentDef: ComponentDef) => {
    if (!page) return;
    saveToUndoStack();

    try {
      const newWidget = await interfaceApi.addWidget(page.id, {
        widgetType: componentDef.type,
        name: componentDef.label,
        props: componentDef.defaultProps,
        sortOrder: widgets.length
      });
      setWidgets(prev => [...prev, newWidget]);
      setSelectedWidgetId(newWidget.id);
      showSuccess('添加成功', `已添加${componentDef.label}`);
    } catch (e) {
      showError('错误', '添加组件失败');
    }
  };

  const handleRemoveWidget = async (widgetId: string) => {
    saveToUndoStack();
    try {
      await interfaceApi.deleteWidget(widgetId);
      setWidgets(prev => prev.filter(w => w.id !== widgetId));
      if (selectedWidgetId === widgetId) setSelectedWidgetId(null);
      showSuccess('删除成功', '组件已删除');
    } catch (e) {
      showError('错误', '删除组件失败');
    }
  };

  const handleUpdateWidgetProps = async (key: string, value: unknown) => {
    if (!selectedWidgetId || !selectedWidget) return;

    const newProps = { ...selectedWidget.props, [key]: value };
    setWidgets(prev => prev.map(w =>
      w.id === selectedWidgetId ? { ...w, props: newProps } : w
    ));

    // 防抖保存到后端
    try {
      await interfaceApi.updateWidget(selectedWidgetId, { props: newProps });
    } catch (e) {
      console.error('更新组件失败', e);
    }
  };

  const handleUpdatePageSettings = async (key: string, value: string) => {
    if (!page) return;

    const updatedPage = { ...page, [key]: value };
    setPage(updatedPage);

    try {
      await interfaceApi.updatePage(page.id, { [key]: value });
    } catch (e) {
      showError('错误', '更新页面设置失败');
    }
  };

  // 拖拽排序
  const handleDragStart = (e: React.DragEvent, widgetId: string) => {
    setDraggedWidget(widgetId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragEnd = async () => {
    if (draggedWidget && dragOverIndex !== null) {
      const draggedIndex = widgets.findIndex(w => w.id === draggedWidget);
      if (draggedIndex !== dragOverIndex) {
        saveToUndoStack();
        const newWidgets = [...widgets];
        const [removed] = newWidgets.splice(draggedIndex, 1);
        newWidgets.splice(dragOverIndex, 0, removed);
        setWidgets(newWidgets);

        // 保存新顺序
        try {
          await interfaceApi.reorderWidgets(page!.id, newWidgets.map(w => w.id));
        } catch (e) {
          showError('错误', '保存排序失败');
        }
      }
    }
    setDraggedWidget(null);
    setDragOverIndex(null);
  };

  // 发布页面
  const handlePublish = async () => {
    if (!page) return;
    setSaving(true);
    try {
      await interfaceApi.publishPage(page.id);
      showSuccess('发布成功', '页面已发布上线');
      loadPage(currentPageType);
    } catch (e) {
      showError('错误', '发布失败');
    } finally {
      setSaving(false);
    }
  };

  // 保存为模板
  const handleSaveAsTemplate = async () => {
    if (!page || !templateName.trim()) {
      showError('错误', '请输入模板名称');
      return;
    }
    try {
      await interfaceApi.createTemplate({
        name: templateName,
        pageType: currentPageType,
        config: {
          backgroundColor: page.backgroundColor,
          backgroundImage: page.backgroundImage,
          widgets: widgets.map(w => ({
            widgetType: w.widgetType as WidgetType,
            name: w.name,
            props: w.props,
            style: w.style,
            sortOrder: w.sortOrder,
            isVisible: w.isVisible
          }))
        }
      });
      showSuccess('保存成功', '模板已保存');
      setShowSaveTemplate(false);
      setTemplateName('');
      loadTemplates();
    } catch (e) {
      showError('错误', '保存模板失败');
    }
  };

  // 应用模板
  const handleApplyTemplate = async (templateId: string) => {
    if (!page) return;
    if (!confirm('应用模板将覆盖当前页面配置，确定继续吗？')) return;

    try {
      await interfaceApi.applyTemplate(page.id, templateId);
      showSuccess('应用成功', '模板已应用');
      loadPage(currentPageType);
    } catch (e) {
      showError('错误', '应用模板失败');
    }
  };

  // 恢复历史版本
  const handleRestoreHistory = async (historyId: string) => {
    if (!page) return;
    if (!confirm('恢复将覆盖当前配置，确定继续吗？')) return;

    try {
      await interfaceApi.restorePageVersion(page.id, historyId);
      showSuccess('恢复成功', '已恢复到该版本');
      loadPage(currentPageType);
    } catch (e) {
      showError('错误', '恢复失败');
    }
  };

  // ==================== 渲染函数 ====================

  const renderMobileWidget = (widget: InterfaceWidget, index: number) => {
    const isSelected = selectedWidgetId === widget.id;
    const isDragOver = dragOverIndex === index;
    const { widgetType, props } = widget;

    let content = null;
    switch (widgetType) {
      case 'SEARCH':
        content = (
          <div className="p-3" style={{ backgroundColor: props.background as string }}>
            <div className={`bg-slate-100 text-slate-400 px-4 py-2 text-sm flex items-center gap-2 ${props.style === 'ROUNDED' ? 'rounded-full' : 'rounded-md'}`}>
              {props.showIcon && <Search size={14} />} {props.placeholder as string}
            </div>
          </div>
        );
        break;

      case 'BANNER':
        const images = (props.images as Array<{ url: string }>) || [];
        content = (
          <div className="w-full bg-slate-200 relative overflow-hidden" style={{ height: props.height as number }}>
            {images[0]?.url && <img src={images[0].url} alt="Banner" className="w-full h-full object-cover" />}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-white w-4' : 'bg-white/50'}`} />
              ))}
            </div>
          </div>
        );
        break;

      case 'GRID_NAV':
        const items = (props.items as Array<{ icon: string; label: string; color: string }>) || [];
        content = (
          <div className="p-4 bg-white grid gap-4" style={{ gridTemplateColumns: `repeat(${props.cols || 5}, 1fr)` }}>
            {items.map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-xl">
                  {item.icon}
                </div>
                <span className="text-xs text-slate-600">{item.label}</span>
              </div>
            ))}
          </div>
        );
        break;

      case 'NOTICE':
        content = (
          <div className="px-3 py-2 flex items-center gap-2 text-xs" style={{ backgroundColor: props.background as string, color: props.textColor as string }}>
            {props.showIcon && <Megaphone size={14} />}
            <span className="truncate">{props.text as string}</span>
          </div>
        );
        break;

      case 'PRODUCT_FEED':
        content = (
          <div className="p-3">
            {props.title && <h3 className="font-bold text-slate-800 mb-3 text-sm">{props.title as string}</h3>}
            <div className={`grid gap-3 ${props.mode === 'DOUBLE' ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm">
                  <div className="aspect-square bg-slate-100" />
                  <div className="p-2">
                    <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-red-500 font-bold">¥ 9.9</span>
                      {props.showCart && <div className="w-5 h-5 bg-emerald-500 rounded-full text-white flex items-center justify-center text-xs">+</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case 'TITLE':
        content = (
          <div className="px-4 py-3 bg-transparent flex items-center justify-between">
            <span style={{ fontSize: props.size as string, fontWeight: props.bold ? 'bold' : 'normal', color: props.color as string }}>
              {props.text as string}
            </span>
            {props.showMore && <span className="text-xs text-slate-400">更多 &gt;</span>}
          </div>
        );
        break;

      case 'SPACER':
        content = <div style={{ height: props.height as number, backgroundColor: props.background as string }} />;
        break;

      case 'DIVIDER':
        content = (
          <div style={{ margin: `${props.margin}px 16px` }}>
            <div style={{ borderTop: `1px ${props.style} ${props.color}` }} />
          </div>
        );
        break;

      case 'MEMBER_CARD':
        content = (
          <div className="mx-3 my-2 p-4 rounded-xl text-white" style={{ background: props.background as string }}>
            <div className="flex items-center gap-3 mb-3">
              {props.showAvatar && <div className="w-12 h-12 bg-white/20 rounded-full" />}
              <div>
                <div className="font-bold">会员用户</div>
                {props.showLevel && <div className="text-xs opacity-80">黄金会员</div>}
              </div>
            </div>
            <div className="flex gap-6 text-sm">
              {props.showPoints && <div><span className="opacity-70">积分</span> <span className="font-bold">1,280</span></div>}
              {props.showBalance && <div><span className="opacity-70">余额</span> <span className="font-bold">¥ 388.00</span></div>}
            </div>
          </div>
        );
        break;

      case 'STORE_INFO':
        content = (
          <div className="mx-3 my-2 p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              {props.showLogo && <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-500"><MapPin size={20} /></div>}
              {props.showName && <div className="font-bold text-slate-800">美味餐厅</div>}
            </div>
            {props.showAddress && <div className="text-xs text-slate-500 mb-1">📍 北京市朝阳区xxx路xxx号</div>}
            {props.showPhone && <div className="text-xs text-slate-500 mb-1">📞 400-888-8888</div>}
            {props.showHours && <div className="text-xs text-slate-500">🕐 营业时间: 10:00 - 22:00</div>}
          </div>
        );
        break;

      case 'COUPON':
        content = (
          <div className="p-3">
            {props.title && <h3 className="font-bold text-slate-800 mb-3 text-sm">{props.title as string}</h3>}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex-shrink-0 w-32 bg-gradient-to-r from-red-500 to-red-400 rounded-lg p-3 text-white">
                  <div className="text-xl font-bold">¥10</div>
                  <div className="text-xs opacity-80">满50可用</div>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case 'COUNTDOWN':
        content = (
          <div className="mx-3 my-2 p-4 rounded-lg text-center" style={{ backgroundColor: props.background as string, color: props.textColor as string }}>
            <div className="text-sm mb-2">{props.title as string}</div>
            <div className="flex justify-center gap-2 text-xl font-bold">
              <span className="bg-black/20 px-2 py-1 rounded">00</span>:
              <span className="bg-black/20 px-2 py-1 rounded">00</span>:
              <span className="bg-black/20 px-2 py-1 rounded">00</span>
            </div>
          </div>
        );
        break;

      default:
        content = (
          <div className="p-4 text-center text-slate-400 border border-dashed m-2 rounded">
            {widgetType} 组件
          </div>
        );
    }

    return (
      <div
        key={widget.id}
        draggable
        onDragStart={(e) => handleDragStart(e, widget.id)}
        onDragOver={(e) => handleDragOver(e, index)}
        onDragEnd={handleDragEnd}
        onClick={(e) => { e.stopPropagation(); setSelectedWidgetId(widget.id); }}
        className={`relative cursor-pointer transition-all group ${isSelected ? 'ring-2 ring-emerald-500 z-10' : 'hover:ring-1 hover:ring-slate-300'} ${isDragOver ? 'border-t-2 border-emerald-500' : ''}`}
      >
        {/* 拖拽手柄 */}
        <div className={`absolute left-0 top-0 bottom-0 w-6 bg-slate-100/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-move z-20`}>
          <GripVertical size={14} className="text-slate-400" />
        </div>

        {content}

        {/* 删除按钮 */}
        {isSelected && (
          <button
            onClick={(e) => { e.stopPropagation(); handleRemoveWidget(widget.id); }}
            className="absolute -right-2 -top-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-sm z-20 hover:scale-110 transition-transform"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>
    );
  };

  const renderPropertyPanel = () => {
    if (!selectedWidget) {
      // 页面设置
      return (
        <div className="p-6">
          <div className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Layout size={16} /> 页面设置
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">页面标题</label>
              <input
                type="text"
                value={page?.name || ''}
                onChange={(e) => handleUpdatePageSettings('name', e.target.value)}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">背景颜色</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={page?.backgroundColor || '#f8fafc'}
                  onChange={(e) => handleUpdatePageSettings('backgroundColor', e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border border-slate-200"
                />
                <span className="text-xs text-slate-600 font-mono">{page?.backgroundColor}</span>
              </div>
            </div>
            <div className="pt-4 border-t">
              <div className="text-xs text-slate-500 mb-2">页面状态</div>
              <div className="flex items-center gap-2">
                {page?.isPublished ? (
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs">已发布</span>
                ) : (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">草稿</span>
                )}
                <span className="text-xs text-slate-400">版本 {page?.version}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 组件属性编辑
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
          <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Palette size={16} /> 组件属性
          </div>
          <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{selectedWidget.widgetType}</span>
        </div>

        <div className="space-y-5 max-h-[60vh] overflow-y-auto">
          {/* 根据组件类型渲染不同的属性编辑器 */}
          {renderWidgetPropertyEditor(selectedWidget)}
        </div>
      </div>
    );
  };

  const renderWidgetPropertyEditor = (widget: InterfaceWidget) => {
    const { widgetType, props } = widget;

    switch (widgetType) {
      case 'SEARCH':
        return (
          <>
            <PropertyInput label="提示文字" value={props.placeholder as string} onChange={(v) => handleUpdateWidgetProps('placeholder', v)} />
            <PropertySelect label="框体样式" value={props.style as string} options={[{ value: 'ROUNDED', label: '圆角' }, { value: 'SQUARE', label: '方形' }]} onChange={(v) => handleUpdateWidgetProps('style', v)} />
            <PropertyColor label="背景颜色" value={props.background as string} onChange={(v) => handleUpdateWidgetProps('background', v)} />
            <PropertySwitch label="显示图标" checked={props.showIcon as boolean} onChange={(v) => handleUpdateWidgetProps('showIcon', v)} />
          </>
        );

      case 'BANNER':
        return (
          <>
            <PropertySlider label="高度 (px)" value={props.height as number} min={100} max={400} onChange={(v) => handleUpdateWidgetProps('height', v)} />
            <PropertySwitch label="自动播放" checked={props.autoPlay as boolean} onChange={(v) => handleUpdateWidgetProps('autoPlay', v)} />
            <PropertySlider label="切换间隔 (ms)" value={props.interval as number} min={1000} max={10000} step={500} onChange={(v) => handleUpdateWidgetProps('interval', v)} />
            <div>
              <label className="text-xs text-slate-500 mb-2 block">轮播图片</label>
              <div className="space-y-2">
                {((props.images as Array<{ url: string }>) || []).map((img, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <div className="w-12 h-12 bg-slate-100 rounded bg-cover bg-center flex-shrink-0" style={{ backgroundImage: `url(${img.url})` }} />
                    <input type="text" value={img.url} className="flex-1 border border-slate-200 rounded px-2 py-1 text-xs" readOnly />
                  </div>
                ))}
                <button className="w-full py-2 border border-dashed border-slate-300 rounded text-slate-400 text-xs hover:border-emerald-500 hover:text-emerald-500">
                  + 添加图片
                </button>
              </div>
            </div>
          </>
        );

      case 'GRID_NAV':
        return (
          <>
            <PropertySelect label="列数" value={String(props.cols)} options={[{ value: '3', label: '3列' }, { value: '4', label: '4列' }, { value: '5', label: '5列' }]} onChange={(v) => handleUpdateWidgetProps('cols', parseInt(v))} />
            <div>
              <label className="text-xs text-slate-500 mb-2 block">导航项</label>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {((props.items as Array<{ icon: string; label: string; color: string }>) || []).map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-slate-50 p-2 rounded">
                    <span className="text-xl">{item.icon}</span>
                    <input
                      className="flex-1 bg-transparent border-none text-xs focus:ring-0 px-0"
                      value={item.label}
                      onChange={(e) => {
                        const newItems = [...(props.items as Array<{ icon: string; label: string; color: string }>)];
                        newItems[i].label = e.target.value;
                        handleUpdateWidgetProps('items', newItems);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        );

      case 'NOTICE':
        return (
          <>
            <PropertyInput label="公告内容" value={props.text as string} onChange={(v) => handleUpdateWidgetProps('text', v)} multiline />
            <PropertyColor label="背景颜色" value={props.background as string} onChange={(v) => handleUpdateWidgetProps('background', v)} />
            <PropertyColor label="文字颜色" value={props.textColor as string} onChange={(v) => handleUpdateWidgetProps('textColor', v)} />
            <PropertySwitch label="显示图标" checked={props.showIcon as boolean} onChange={(v) => handleUpdateWidgetProps('showIcon', v)} />
          </>
        );

      case 'PRODUCT_FEED':
        return (
          <>
            <PropertyInput label="标题" value={props.title as string} onChange={(v) => handleUpdateWidgetProps('title', v)} />
            <PropertySelect label="显示模式" value={props.mode as string} options={[
              { value: 'SINGLE', label: '单列' },
              { value: 'DOUBLE', label: '双列' },
              { value: 'LIST', label: '列表' },
              { value: 'SCROLL', label: '横向滚动' }
            ]} onChange={(v) => handleUpdateWidgetProps('mode', v)} />
            <PropertySelect label="商品来源" value={props.source as string} options={[
              { value: 'recommend', label: '推荐商品' },
              { value: 'hot', label: '热销商品' },
              { value: 'new', label: '新品' },
              { value: 'category', label: '指定分类' }
            ]} onChange={(v) => handleUpdateWidgetProps('source', v)} />
            <PropertySlider label="显示数量" value={props.limit as number} min={4} max={20} onChange={(v) => handleUpdateWidgetProps('limit', v)} />
            <PropertySwitch label="显示价格" checked={props.showPrice as boolean} onChange={(v) => handleUpdateWidgetProps('showPrice', v)} />
            <PropertySwitch label="显示销量" checked={props.showSales as boolean} onChange={(v) => handleUpdateWidgetProps('showSales', v)} />
            <PropertySwitch label="显示购物车" checked={props.showCart as boolean} onChange={(v) => handleUpdateWidgetProps('showCart', v)} />
          </>
        );

      case 'TITLE':
        return (
          <>
            <PropertyInput label="标题内容" value={props.text as string} onChange={(v) => handleUpdateWidgetProps('text', v)} />
            <PropertySelect label="对齐方式" value={props.align as string} options={[
              { value: 'left', label: '左对齐' },
              { value: 'center', label: '居中' },
              { value: 'right', label: '右对齐' }
            ]} onChange={(v) => handleUpdateWidgetProps('align', v)} />
            <PropertyColor label="文字颜色" value={props.color as string} onChange={(v) => handleUpdateWidgetProps('color', v)} />
            <PropertySwitch label="加粗" checked={props.bold as boolean} onChange={(v) => handleUpdateWidgetProps('bold', v)} />
            <PropertySwitch label="显示更多" checked={props.showMore as boolean} onChange={(v) => handleUpdateWidgetProps('showMore', v)} />
          </>
        );

      case 'SPACER':
        return (
          <>
            <PropertySlider label="高度 (px)" value={props.height as number} min={5} max={100} onChange={(v) => handleUpdateWidgetProps('height', v)} />
            <PropertyColor label="背景颜色" value={props.background as string} onChange={(v) => handleUpdateWidgetProps('background', v)} />
          </>
        );

      case 'MEMBER_CARD':
        return (
          <>
            <PropertyInput label="背景" value={props.background as string} onChange={(v) => handleUpdateWidgetProps('background', v)} />
            <PropertySwitch label="显示头像" checked={props.showAvatar as boolean} onChange={(v) => handleUpdateWidgetProps('showAvatar', v)} />
            <PropertySwitch label="显示等级" checked={props.showLevel as boolean} onChange={(v) => handleUpdateWidgetProps('showLevel', v)} />
            <PropertySwitch label="显示积分" checked={props.showPoints as boolean} onChange={(v) => handleUpdateWidgetProps('showPoints', v)} />
            <PropertySwitch label="显示余额" checked={props.showBalance as boolean} onChange={(v) => handleUpdateWidgetProps('showBalance', v)} />
          </>
        );

      case 'STORE_INFO':
        return (
          <>
            <PropertySwitch label="显示Logo" checked={props.showLogo as boolean} onChange={(v) => handleUpdateWidgetProps('showLogo', v)} />
            <PropertySwitch label="显示店名" checked={props.showName as boolean} onChange={(v) => handleUpdateWidgetProps('showName', v)} />
            <PropertySwitch label="显示地址" checked={props.showAddress as boolean} onChange={(v) => handleUpdateWidgetProps('showAddress', v)} />
            <PropertySwitch label="显示电话" checked={props.showPhone as boolean} onChange={(v) => handleUpdateWidgetProps('showPhone', v)} />
            <PropertySwitch label="显示营业时间" checked={props.showHours as boolean} onChange={(v) => handleUpdateWidgetProps('showHours', v)} />
          </>
        );

      case 'COUNTDOWN':
        return (
          <>
            <PropertyInput label="标题" value={props.title as string} onChange={(v) => handleUpdateWidgetProps('title', v)} />
            <PropertyInput label="结束时间" value={props.endTime as string} onChange={(v) => handleUpdateWidgetProps('endTime', v)} type="datetime-local" />
            <PropertyColor label="背景颜色" value={props.background as string} onChange={(v) => handleUpdateWidgetProps('background', v)} />
            <PropertyColor label="文字颜色" value={props.textColor as string} onChange={(v) => handleUpdateWidgetProps('textColor', v)} />
          </>
        );

      default:
        return <div className="text-slate-400 text-sm">该组件暂无可配置属性</div>;
    }
  };

  // ==================== 属性编辑器组件 ====================

  const PropertyInput: React.FC<{ label: string; value: string; onChange: (v: string) => void; multiline?: boolean; type?: string }> = ({ label, value, onChange, multiline, type = 'text' }) => (
    <div>
      <label className="text-xs text-slate-500 mb-1 block">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} className="w-full border border-slate-200 rounded px-3 py-2 text-sm h-20 resize-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
      )}
    </div>
  );

  const PropertySelect: React.FC<{ label: string; value: string; options: { value: string; label: string }[]; onChange: (v: string) => void }> = ({ label, value, options, onChange }) => (
    <div>
      <label className="text-xs text-slate-500 mb-1 block">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  );

  const PropertyColor: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => (
    <div>
      <label className="text-xs text-slate-500 mb-1 block">{label}</label>
      <div className="flex items-center gap-2">
        <input type="color" value={value || '#ffffff'} onChange={(e) => onChange(e.target.value)} className="w-8 h-8 rounded cursor-pointer border border-slate-200" />
        <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} className="flex-1 border border-slate-200 rounded px-2 py-1 text-xs font-mono" />
      </div>
    </div>
  );

  const PropertySlider: React.FC<{ label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void }> = ({ label, value, min, max, step = 1, onChange }) => (
    <div>
      <label className="text-xs text-slate-500 mb-1 block">{label}</label>
      <div className="flex items-center gap-2">
        <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseInt(e.target.value))} className="flex-1 accent-emerald-500" />
        <span className="text-xs text-slate-600 w-10 text-right">{value}</span>
      </div>
    </div>
  );

  const PropertySwitch: React.FC<{ label: string; checked: boolean; onChange: (v: boolean) => void }> = ({ label, checked, onChange }) => (
    <div className="flex items-center justify-between">
      <label className="text-xs text-slate-600">{label}</label>
      <button
        onClick={() => onChange(!checked)}
        className={`w-10 h-5 rounded-full transition-colors ${checked ? 'bg-emerald-500' : 'bg-slate-200'}`}
      >
        <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );

  // ==================== 主渲染 ====================

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-slate-50 -m-6 rounded-none">
      {/* 顶部工具栏 */}
      <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/config/system" className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-sm">
            <ChevronLeft size={16} /> 返回
          </Link>
          <div className="h-4 w-px bg-slate-200" />

          {/* 页面切换 */}
          <div className="flex bg-slate-100 rounded-lg p-1">
            {PAGE_TYPES.map(pt => (
              <button
                key={pt.type}
                onClick={() => setCurrentPageType(pt.type)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${currentPageType === pt.type ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <pt.icon size={14} />
                {pt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* 撤销/重做 */}
          <div className="flex items-center gap-1 mr-2">
            <button onClick={handleUndo} disabled={undoStack.length === 0} className="p-2 hover:bg-slate-100 rounded disabled:opacity-30" title="撤销">
              <Undo2 size={16} />
            </button>
            <button onClick={handleRedo} disabled={redoStack.length === 0} className="p-2 hover:bg-slate-100 rounded disabled:opacity-30" title="重做">
              <Redo2 size={16} />
            </button>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-1 mr-2">
            <CheckCircle2 size={12} className="text-emerald-500" /> 自动保存
          </div>

          <button onClick={() => setShowSaveTemplate(true)} className="px-3 py-2 border border-slate-200 text-slate-600 rounded text-sm hover:bg-slate-50 flex items-center gap-1">
            <Download size={14} /> 存为模板
          </button>

          <button className="px-3 py-2 border border-slate-200 text-slate-600 rounded text-sm hover:bg-slate-50 flex items-center gap-1">
            <Eye size={14} /> 预览
          </button>

          <button onClick={handlePublish} disabled={saving} className="px-5 py-2 bg-emerald-500 text-white rounded text-sm font-medium hover:bg-emerald-600 flex items-center gap-2 shadow-sm shadow-emerald-200 disabled:opacity-50">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            发布
          </button>
        </div>
      </div>

      {/* 主工作区 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧面板 */}
        <div className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 z-10">
          {/* 面板切换 */}
          <div className="flex border-b border-slate-100">
            {[
              { key: 'components', label: '组件', icon: Layers },
              { key: 'templates', label: '模板', icon: LayoutTemplate },
              { key: 'theme', label: '主题', icon: Palette },
              { key: 'history', label: '历史', icon: History }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActivePanel(tab.key as typeof activePanel)}
                className={`flex-1 py-3 text-xs font-medium flex flex-col items-center gap-1 transition-colors ${activePanel === tab.key ? 'text-emerald-600 border-b-2 border-emerald-500' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* 面板内容 */}
          <div className="flex-1 overflow-y-auto">
            {activePanel === 'components' && (
              <div className="p-4 space-y-4">
                {CATEGORIES.map(cat => (
                  <div key={cat}>
                    <button
                      onClick={() => setExpandedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])}
                      className="w-full flex items-center justify-between text-xs font-medium text-slate-500 mb-2 hover:text-slate-700"
                    >
                      <span>{cat}组件</span>
                      {expandedCategories.includes(cat) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                    {expandedCategories.includes(cat) && (
                      <div className="grid grid-cols-2 gap-2">
                        {COMPONENT_LIBRARY.filter(c => c.category === cat).map(comp => (
                          <div
                            key={comp.type}
                            onClick={() => handleAddWidget(comp)}
                            className="flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-100 rounded hover:border-emerald-500 hover:bg-emerald-50 cursor-pointer transition-all group"
                            title={comp.description}
                          >
                            <comp.icon size={20} className="mb-1 text-slate-400 group-hover:text-emerald-500" strokeWidth={1.5} />
                            <span className="text-xs text-slate-600 group-hover:text-emerald-700">{comp.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activePanel === 'templates' && (
              <div className="p-4 space-y-3">
                {templates.length > 0 ? templates.map(template => (
                  <div key={template.id} className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-24 bg-slate-100" style={{ backgroundImage: template.thumbnail ? `url(${template.thumbnail})` : undefined, backgroundSize: 'cover' }} />
                    <div className="p-3">
                      <div className="font-medium text-sm text-slate-800 mb-1">{template.name}</div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400">使用 {template.useCount} 次</span>
                        <button onClick={() => handleApplyTemplate(template.id)} className="text-xs text-emerald-600 hover:text-emerald-700">
                          应用
                        </button>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-slate-400 text-sm">暂无模板</div>
                )}
              </div>
            )}

            {activePanel === 'theme' && (
              <div className="p-4 space-y-4">
                {activeTheme && (
                  <div className="p-4 border border-emerald-200 bg-emerald-50 rounded-lg">
                    <div className="text-xs text-emerald-600 mb-2">当前主题</div>
                    <div className="font-medium text-slate-800">{activeTheme.name}</div>
                    <div className="flex gap-2 mt-2">
                      {[activeTheme.primaryColor, activeTheme.secondaryColor, activeTheme.accentColor].map((color, i) => (
                        <div key={i} className="w-6 h-6 rounded-full border border-white shadow" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                  </div>
                )}
                {themes.filter(t => !t.isActive).map(theme => (
                  <div key={theme.id} className="p-4 border border-slate-200 rounded-lg hover:border-slate-300">
                    <div className="font-medium text-sm text-slate-800 mb-2">{theme.name}</div>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-1">
                        {[theme.primaryColor, theme.secondaryColor, theme.accentColor].map((color, i) => (
                          <div key={i} className="w-5 h-5 rounded-full border border-slate-200" style={{ backgroundColor: color }} />
                        ))}
                      </div>
                      <button className="text-xs text-emerald-600 hover:text-emerald-700">应用</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activePanel === 'history' && (
              <div className="p-4 space-y-2">
                {histories.length > 0 ? histories.map(history => (
                  <div key={history.id} className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-slate-800">版本 {history.version}</span>
                      <span className="text-xs text-slate-400">{history.operationType}</span>
                    </div>
                    <div className="text-xs text-slate-500 mb-2">{history.description}</div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">{history.createdAt ? new Date(history.createdAt).toLocaleString() : ''}</span>
                      <button onClick={() => handleRestoreHistory(history.id)} className="text-xs text-emerald-600 hover:text-emerald-700">
                        恢复
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-slate-400 text-sm">暂无历史记录</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 中间画布 */}
        <div className="flex-1 bg-slate-100 flex justify-center pt-8 pb-8 overflow-y-auto relative">
          <div
            className="w-[375px] bg-white shadow-2xl rounded-none min-h-[750px] flex flex-col relative transition-all"
            style={{ backgroundColor: page?.backgroundColor || '#f8fafc' }}
            onClick={() => setSelectedWidgetId(null)}
          >
            {/* 手机顶部状态栏 */}
            <div className="h-6 bg-black/5 flex items-center justify-between px-4 text-xs text-slate-500">
              <span>9:41</span>
              <div className="flex gap-1">
                <span>📶</span>
                <span>🔋</span>
              </div>
            </div>

            {/* 页面标题栏 */}
            <div className="h-11 bg-white sticky top-0 z-30 flex items-center justify-center border-b border-slate-100/50 backdrop-blur-sm bg-white/80" onClick={(e) => e.stopPropagation()}>
              <span className="font-bold text-slate-800">{page?.name || '页面标题'}</span>
            </div>

            {/* 组件列表 */}
            <div className="flex-1 pb-16">
              {widgets.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-300">
                  <Plus size={48} strokeWidth={1} />
                  <p className="text-sm mt-4">点击左侧组件添加到页面</p>
                </div>
              ) : (
                widgets.map((widget, index) => renderMobileWidget(widget, index))
              )}
            </div>

            {/* 底部导航栏预览 */}
            <div className="absolute bottom-0 left-0 right-0 h-14 bg-white border-t border-slate-100 flex items-center justify-around px-4">
              {['首页', '分类', '购物车', '我的'].map((label, i) => (
                <div key={i} className={`flex flex-col items-center ${i === 0 ? 'text-emerald-500' : 'text-slate-400'}`}>
                  <div className="w-5 h-5 bg-current opacity-30 rounded" />
                  <span className="text-xs mt-1">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 画布底部提示 */}
          <div className="absolute bottom-6 flex gap-4">
            <div className="bg-white px-4 py-2 rounded-full shadow-lg text-xs font-medium text-slate-500 flex items-center gap-2">
              <Move size={14} /> 拖拽组件可调整顺序
            </div>
          </div>
        </div>

        {/* 右侧属性面板 */}
        <div className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 z-10 overflow-y-auto">
          {renderPropertyPanel()}
        </div>
      </div>

      {/* 保存模板弹窗 */}
      {showSaveTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-bold text-lg text-slate-800">保存为模板</h3>
              <button onClick={() => setShowSaveTemplate(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-slate-700 mb-1">模板名称</label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="输入模板名称"
              />
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-slate-50 rounded-b-lg">
              <button onClick={() => setShowSaveTemplate(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                取消
              </button>
              <button onClick={handleSaveAsTemplate} className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigInterfaceSettings;
