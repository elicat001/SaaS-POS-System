
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Briefcase, 
  ShoppingBag, 
  FileText, 
  Users, 
  Settings, 
  Image, 
  Megaphone, 
  Grid,
  ChevronDown,
  ChevronRight,
  UserCog,
  Wrench
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = useState<string>('配置管理');

  const menuItems = [
    {
      title: '运营数据',
      icon: BarChart3,
      subItems: [
        { label: '数据分析', path: '/' },
        { label: '销售汇总', path: '/sales-summary' },
        { label: '营业报表', path: '/reports' },
        { label: '桌台统计', path: '/table-stats' },
        { label: '余额统计', path: '/balance-stats' },
        { label: '提成统计', path: '/commission-stats' },
      ]
    },
    {
      title: '经营工具',
      icon: Briefcase,
      subItems: [
        { label: '收银管理', path: '/cashier' },
        { label: '桌台管理', path: '/table-mgmt' },
        { label: '代客下单', path: '/pos' },
      ]
    },
    { 
      title: '商品管理', 
      icon: ShoppingBag, 
      subItems: [
        { label: '分类设置', path: '/categories' },
        { label: '商品列表', path: '/products' },
        { label: '进销存', path: '/inventory' },
      ] 
    },
    { title: '订单列表', icon: FileText, path: '/orders' },
    { title: '用户列表', icon: Users, path: '/users' },
    { 
      title: '配置管理', 
      icon: Settings, 
      subItems: [
        { label: '小程序管理', path: '/config/miniprogram' },
        { label: '门店设置', path: '/config/store' },
        { label: '订单提醒', path: '/config/notify' },
        { label: '小程序助手', path: '/config/helper' },
        { label: '界面设置', path: '/config/interface' },
        { label: '行业模板', path: '/config/templates' },
        { label: '系统设置', path: '/config/system' },
        { label: '第三方配送', path: '/config/delivery' },
        { label: '打印机设置', path: '/config/printer' },
        { label: '桌码生成', path: '/config/tablecode' },
        { label: '开发配置', path: '/config/dev' },
      ] 
    },

    { title: '营销管理', icon: Megaphone, path: '/marketing' },
    { title: '应用中心', icon: Grid, path: '/apps' },
  ];

  const toggleMenu = (title: string) => {
    setExpandedMenu(expandedMenu === title ? '' : title);
  };

  return (
    <div className="w-56 bg-white h-[calc(100vh-3.5rem)] fixed left-0 top-14 shadow-[2px_0_8px_rgba(0,0,0,0.04)] flex flex-col overflow-y-auto z-40 pb-10">
      <div className="py-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isExpanded = expandedMenu === item.title;
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isDirectLink = !hasSubItems && item.path;
          const isActiveDirect = isDirectLink && location.pathname === item.path;

          const isChildActive = hasSubItems && item.subItems?.some(sub => location.pathname === sub.path);

          return (
            <div key={item.title}>
              {isDirectLink ? (
                <Link 
                  to={item.path!}
                  className={`
                    w-full flex items-center justify-between px-5 py-3.5 text-[14px] font-medium transition-all
                    ${isActiveDirect 
                      ? 'text-emerald-500 bg-emerald-50/50 border-r-[3px] border-emerald-500' 
                      : 'text-slate-600 hover:text-emerald-500 hover:bg-slate-50'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} strokeWidth={2} />
                    <span>{item.title}</span>
                  </div>
                </Link>
              ) : (
                <button
                  onClick={() => toggleMenu(item.title)}
                  className={`
                    w-full flex items-center justify-between px-5 py-3.5 text-[14px] font-medium transition-all
                    ${isExpanded || isChildActive ? 'text-emerald-500' : 'text-slate-600 hover:text-emerald-500 hover:bg-slate-50'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} strokeWidth={2} />
                    <span>{item.title}</span>
                  </div>
                  {hasSubItems && (
                    isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                  )}
                </button>
              )}

              {/* Submenu */}
              {hasSubItems && isExpanded && (
                <div className="bg-white py-1">
                  {item.subItems!.map((sub, idx) => {
                    const isSubActive = location.pathname === sub.path;
                    return (
                      <Link
                        key={idx}
                        to={sub.path!}
                        className={`
                          block pl-[3.25rem] pr-4 py-2.5 text-[13px] transition-colors
                          ${isSubActive 
                            ? 'text-white bg-emerald-500' 
                            : 'text-slate-500 hover:text-emerald-500 hover:bg-slate-50'}
                        `}
                      >
                        {sub.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
