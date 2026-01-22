import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Download, Trash2, Settings, Power, PowerOff,
  ExternalLink, RefreshCw, CheckCircle, XCircle,
  Loader2, X
} from 'lucide-react';
import { useAppCenter } from '../contexts/AppCenterContext';
import type { App, AppInstallation } from '../types';

// ==================== 应用卡片组件 ====================

interface AppCardProps {
  app: App;
  installation?: AppInstallation;
  onInstall: (appId: string) => void;
  onUninstall: (installationId: string) => void;
  onToggle: (installationId: string, status: 'active' | 'disabled') => void;
  onConfigure: (app: App) => void;
  onOpen: (app: App) => void;
  loading?: boolean;
}

const AppCard: React.FC<AppCardProps> = ({
  app,
  installation,
  onInstall,
  onUninstall,
  onToggle,
  onConfigure,
  onOpen,
  loading
}) => {
  const isInstalled = !!installation;
  const isActive = installation?.status === 'active';
  const isIntegration = app.category === 'integration';

  const getIconBgColor = () => {
    if (!isInstalled) return 'bg-slate-200 text-slate-500';
    if (!isActive) return 'bg-slate-300 text-slate-500';
    if (isIntegration) {
      switch (app.id) {
        case 'jd-delivery': return 'bg-red-500 text-white';
        case 'eleme': return 'bg-blue-400 text-white';
        case 'meituan': return 'bg-yellow-400 text-white';
        default: return 'bg-emerald-400 text-white';
      }
    }
    return 'bg-emerald-400 text-white';
  };

  return (
    <div className={`bg-white p-4 rounded-lg shadow-sm border transition-all ${
      isInstalled && isActive
        ? 'border-emerald-200 hover:shadow-md hover:border-emerald-300'
        : 'border-slate-200 hover:shadow-md'
    }`}>
      <div className="flex gap-4 items-start">
        <div className={`w-12 h-12 ${getIconBgColor()} rounded-lg flex items-center justify-center text-xl font-bold shrink-0`}>
          {app.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-slate-800 text-sm truncate">{app.name}</h3>
            {isInstalled && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
              }`}>
                {isActive ? '已启用' : '已禁用'}
              </span>
            )}
            {!isInstalled && isIntegration && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-100 text-orange-600">
                未开通
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {app.description}
          </p>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="mt-4 flex gap-2 justify-end">
        {loading ? (
          <Loader2 size={16} className="animate-spin text-slate-400" />
        ) : isInstalled ? (
          <>
            <button
              onClick={() => onOpen(app)}
              className="text-xs px-3 py-1.5 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors flex items-center gap-1"
            >
              <ExternalLink size={12} />
              打开
            </button>
            <button
              onClick={() => onToggle(installation!.id, isActive ? 'disabled' : 'active')}
              className={`text-xs px-2 py-1.5 rounded transition-colors flex items-center gap-1 ${
                isActive
                  ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
              }`}
              title={isActive ? '禁用' : '启用'}
            >
              {isActive ? <PowerOff size={12} /> : <Power size={12} />}
            </button>
            <button
              onClick={() => onConfigure(app)}
              className="text-xs px-2 py-1.5 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 transition-colors"
              title="配置"
            >
              <Settings size={12} />
            </button>
            <button
              onClick={() => onUninstall(installation!.id)}
              className="text-xs px-2 py-1.5 bg-red-50 text-red-500 rounded hover:bg-red-100 transition-colors"
              title="卸载"
            >
              <Trash2 size={12} />
            </button>
          </>
        ) : (
          <button
            onClick={() => onInstall(app.id)}
            className="text-xs px-3 py-1.5 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors flex items-center gap-1"
          >
            <Download size={12} />
            安装
          </button>
        )}
      </div>
    </div>
  );
};

// ==================== 配置弹窗组件 ====================

interface ConfigModalProps {
  app: App | null;
  onClose: () => void;
  onSave: (config: Record<string, unknown>) => void;
}

const ConfigModal: React.FC<ConfigModalProps> = ({ app, onClose, onSave }) => {
  const [config, setConfig] = useState<Record<string, string>>({});

  if (!app) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="font-bold text-lg text-slate-800">配置 - {app.name}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <p className="text-sm text-slate-500 mb-4">
            {app.description}
          </p>

          {/* 通用配置表单 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                自定义设置
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="输入配置值..."
                value={config.custom || ''}
                onChange={(e) => setConfig({ ...config, custom: e.target.value })}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-slate-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={() => onSave(config)}
            className="px-4 py-2 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== 主组件 ====================

const AppCenter: React.FC = () => {
  const navigate = useNavigate();
  const {
    apps,
    installations,
    integrations,
    loading,
    initializeAppCenter,
    installApp,
    uninstallApp,
    toggleApp,
    updateAppConfig,
    isAppInstalled,
    getAppInstallation,
  } = useAppCenter();

  const [activeTab, setActiveTab] = useState<'all' | 'installed'>('all');
  const [loadingAppId, setLoadingAppId] = useState<string | null>(null);
  const [configApp, setConfigApp] = useState<App | null>(null);

  useEffect(() => {
    initializeAppCenter();
  }, [initializeAppCenter]);

  // 分类应用
  const builtinApps = apps.filter(app => app.category === 'builtin');
  const integrationApps = apps.filter(app => app.category === 'integration');
  const installedApps = apps.filter(app => isAppInstalled(app.id));

  // 操作处理
  const handleInstall = async (appId: string) => {
    setLoadingAppId(appId);
    try {
      await installApp(appId);
    } finally {
      setLoadingAppId(null);
    }
  };

  const handleUninstall = async (installationId: string) => {
    if (!confirm('确定要卸载此应用吗？')) return;
    try {
      await uninstallApp(installationId);
    } catch (e) {
      // 错误已在context中处理
    }
  };

  const handleToggle = async (installationId: string, status: 'active' | 'disabled') => {
    try {
      await toggleApp(installationId, status);
    } catch (e) {
      // 错误已在context中处理
    }
  };

  const handleConfigure = (app: App) => {
    setConfigApp(app);
  };

  const handleSaveConfig = async (config: Record<string, unknown>) => {
    if (!configApp) return;
    const installation = getAppInstallation(configApp.id);
    if (installation) {
      try {
        await updateAppConfig(installation.id, config);
        setConfigApp(null);
      } catch (e) {
        // 错误已在context中处理
      }
    }
  };

  const handleOpen = (app: App) => {
    if (app.route) {
      navigate(app.route);
    }
  };

  // 渲染应用网格
  const renderAppGrid = (appList: App[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {appList.map(app => (
        <AppCard
          key={app.id}
          app={app}
          installation={getAppInstallation(app.id)}
          onInstall={handleInstall}
          onUninstall={handleUninstall}
          onToggle={handleToggle}
          onConfigure={handleConfigure}
          onOpen={handleOpen}
          loading={loadingAppId === app.id}
        />
      ))}
    </div>
  );

  if (loading.apps) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题和Tab */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">应用中心</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              activeTab === 'all'
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            全部应用
          </button>
          <button
            onClick={() => setActiveTab('installed')}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              activeTab === 'installed'
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            已安装 ({installedApps.length})
          </button>
        </div>
      </div>

      {activeTab === 'all' ? (
        <>
          {/* 内置应用 */}
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-4">内置应用</h2>
            {renderAppGrid(builtinApps)}
          </section>

          {/* 第三方平台 */}
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-4">第三方平台</h2>
            {renderAppGrid(integrationApps)}
          </section>
        </>
      ) : (
        <section>
          {installedApps.length > 0 ? (
            renderAppGrid(installedApps)
          ) : (
            <div className="text-center py-12 text-slate-400">
              <p>暂无已安装的应用</p>
              <button
                onClick={() => setActiveTab('all')}
                className="mt-4 text-emerald-500 hover:text-emerald-600"
              >
                去安装应用
              </button>
            </div>
          )}
        </section>
      )}

      {/* 配置弹窗 */}
      {configApp && (
        <ConfigModal
          app={configApp}
          onClose={() => setConfigApp(null)}
          onSave={handleSaveConfig}
        />
      )}
    </div>
  );
};

export default AppCenter;
