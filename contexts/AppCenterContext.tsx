import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { appApi, integrationApi } from '../services/api';
import { useNotification } from './NotificationContext';
import type { App, AppInstallation, ThirdPartyIntegration } from '../types';

// ==================== 状态类型定义 ====================

interface AppCenterState {
  apps: App[];
  installations: AppInstallation[];
  integrations: ThirdPartyIntegration[];
  loading: {
    apps: boolean;
    installations: boolean;
    integrations: boolean;
  };
  errors: {
    apps: string | null;
    installations: string | null;
    integrations: string | null;
  };
  initialized: boolean;
}

// ==================== Action类型定义 ====================

type ActionType =
  | { type: 'SET_LOADING'; payload: { key: keyof AppCenterState['loading']; value: boolean } }
  | { type: 'SET_ERROR'; payload: { key: keyof AppCenterState['errors']; value: string | null } }
  | { type: 'SET_APPS'; payload: App[] }
  | { type: 'SET_INSTALLATIONS'; payload: AppInstallation[] }
  | { type: 'ADD_INSTALLATION'; payload: AppInstallation }
  | { type: 'UPDATE_INSTALLATION'; payload: AppInstallation }
  | { type: 'REMOVE_INSTALLATION'; payload: string }
  | { type: 'SET_INTEGRATIONS'; payload: ThirdPartyIntegration[] }
  | { type: 'UPDATE_INTEGRATION'; payload: ThirdPartyIntegration }
  | { type: 'SET_INITIALIZED'; payload: boolean }
  | { type: 'RESET_STATE' };

// ==================== 初始状态 ====================

const initialState: AppCenterState = {
  apps: [],
  installations: [],
  integrations: [],
  loading: {
    apps: false,
    installations: false,
    integrations: false,
  },
  errors: {
    apps: null,
    installations: null,
    integrations: null,
  },
  initialized: false,
};

// ==================== Reducer ====================

function appCenterReducer(state: AppCenterState, action: ActionType): AppCenterState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: { ...state.loading, [action.payload.key]: action.payload.value },
      };

    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.payload.key]: action.payload.value },
      };

    case 'SET_APPS':
      return { ...state, apps: action.payload };

    case 'SET_INSTALLATIONS':
      return { ...state, installations: action.payload };

    case 'ADD_INSTALLATION':
      return { ...state, installations: [...state.installations, action.payload] };

    case 'UPDATE_INSTALLATION':
      return {
        ...state,
        installations: state.installations.map(inst =>
          inst.id === action.payload.id ? action.payload : inst
        ),
      };

    case 'REMOVE_INSTALLATION':
      return {
        ...state,
        installations: state.installations.filter(inst => inst.id !== action.payload),
      };

    case 'SET_INTEGRATIONS':
      return { ...state, integrations: action.payload };

    case 'UPDATE_INTEGRATION':
      return {
        ...state,
        integrations: state.integrations.map(int =>
          int.id === action.payload.id ? action.payload : int
        ),
      };

    case 'SET_INITIALIZED':
      return { ...state, initialized: action.payload };

    case 'RESET_STATE':
      return initialState;

    default:
      return state;
  }
}

// ==================== Context类型 ====================

interface AppCenterContextType extends AppCenterState {
  // 数据获取
  fetchApps: () => Promise<void>;
  fetchInstallations: () => Promise<void>;
  fetchIntegrations: () => Promise<void>;
  initializeAppCenter: () => Promise<void>;

  // 应用管理
  installApp: (appId: string, config?: Record<string, unknown>) => Promise<void>;
  uninstallApp: (installationId: string) => Promise<void>;
  updateAppConfig: (installationId: string, config: Record<string, unknown>) => Promise<void>;
  toggleApp: (installationId: string, status: 'active' | 'disabled') => Promise<void>;

  // 第三方集成
  connectIntegration: (platform: string) => Promise<void>;
  disconnectIntegration: (platform: string) => Promise<void>;
  syncIntegration: (platform: string) => Promise<void>;

  // 辅助方法
  isAppInstalled: (appId: string) => boolean;
  getAppInstallation: (appId: string) => AppInstallation | undefined;
  getAppConfig: (appId: string) => Record<string, unknown> | null;
  isAppActive: (appId: string) => boolean;
}

// ==================== Context ====================

const AppCenterContext = createContext<AppCenterContextType | undefined>(undefined);

// ==================== Provider ====================

export const AppCenterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appCenterReducer, initialState);
  const { success: showSuccess, error: showError } = useNotification();

  // 错误处理
  const handleError = useCallback((key: keyof AppCenterState['errors'], error: unknown) => {
    const message = error instanceof Error ? error.message : '操作失败';
    dispatch({ type: 'SET_ERROR', payload: { key, value: message } });
    showError('错误', message);
  }, [showError]);

  // 获取应用列表
  const fetchApps = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'apps', value: true } });
    dispatch({ type: 'SET_ERROR', payload: { key: 'apps', value: null } });

    try {
      const apps = await appApi.listApps();
      dispatch({ type: 'SET_APPS', payload: apps });
    } catch (error) {
      handleError('apps', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'apps', value: false } });
    }
  }, [handleError]);

  // 获取已安装应用
  const fetchInstallations = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'installations', value: true } });
    dispatch({ type: 'SET_ERROR', payload: { key: 'installations', value: null } });

    try {
      const installations = await appApi.listInstalled();
      dispatch({ type: 'SET_INSTALLATIONS', payload: installations });
    } catch (error) {
      handleError('installations', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'installations', value: false } });
    }
  }, [handleError]);

  // 获取第三方集成
  const fetchIntegrations = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'integrations', value: true } });
    dispatch({ type: 'SET_ERROR', payload: { key: 'integrations', value: null } });

    try {
      const integrations = await integrationApi.list();
      dispatch({ type: 'SET_INTEGRATIONS', payload: integrations as ThirdPartyIntegration[] });
    } catch (error) {
      handleError('integrations', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'integrations', value: false } });
    }
  }, [handleError]);

  // 初始化应用中心
  const initializeAppCenter = useCallback(async () => {
    if (state.initialized) return;

    try {
      await Promise.all([fetchApps(), fetchInstallations(), fetchIntegrations()]);
      dispatch({ type: 'SET_INITIALIZED', payload: true });
    } catch (error) {
      console.error('初始化应用中心失败:', error);
    }
  }, [state.initialized, fetchApps, fetchInstallations, fetchIntegrations]);

  // 安装应用
  const installApp = useCallback(async (appId: string, config?: Record<string, unknown>) => {
    try {
      const installation = await appApi.install(appId, config);
      // 重新获取已安装应用列表以获取完整的app信息
      await fetchInstallations();
      showSuccess('成功', '应用安装成功');
    } catch (error) {
      handleError('installations', error);
      throw error;
    }
  }, [fetchInstallations, showSuccess, handleError]);

  // 卸载应用
  const uninstallApp = useCallback(async (installationId: string) => {
    try {
      await appApi.uninstall(installationId);
      dispatch({ type: 'REMOVE_INSTALLATION', payload: installationId });
      showSuccess('成功', '应用已卸载');
    } catch (error) {
      handleError('installations', error);
      throw error;
    }
  }, [showSuccess, handleError]);

  // 更新应用配置
  const updateAppConfig = useCallback(async (installationId: string, config: Record<string, unknown>) => {
    try {
      const updated = await appApi.updateConfig(installationId, config);
      dispatch({ type: 'UPDATE_INSTALLATION', payload: updated });
      showSuccess('成功', '配置已更新');
    } catch (error) {
      handleError('installations', error);
      throw error;
    }
  }, [showSuccess, handleError]);

  // 启用/禁用应用
  const toggleApp = useCallback(async (installationId: string, status: 'active' | 'disabled') => {
    try {
      const updated = await appApi.toggle(installationId, status);
      dispatch({ type: 'UPDATE_INSTALLATION', payload: updated });
      showSuccess('成功', status === 'active' ? '应用已启用' : '应用已禁用');
    } catch (error) {
      handleError('installations', error);
      throw error;
    }
  }, [showSuccess, handleError]);

  // 连接第三方平台
  const connectIntegration = useCallback(async (platform: string) => {
    try {
      await integrationApi.connect(platform);
      await fetchIntegrations();
      showSuccess('成功', `已连接到${platform}平台`);
    } catch (error) {
      handleError('integrations', error);
      throw error;
    }
  }, [fetchIntegrations, showSuccess, handleError]);

  // 断开第三方平台
  const disconnectIntegration = useCallback(async (platform: string) => {
    try {
      await integrationApi.disconnect(platform);
      await fetchIntegrations();
      showSuccess('成功', `已断开${platform}平台连接`);
    } catch (error) {
      handleError('integrations', error);
      throw error;
    }
  }, [fetchIntegrations, showSuccess, handleError]);

  // 同步第三方平台数据
  const syncIntegration = useCallback(async (platform: string) => {
    try {
      await integrationApi.sync(platform);
      await fetchIntegrations();
      showSuccess('成功', `${platform}平台数据同步完成`);
    } catch (error) {
      handleError('integrations', error);
      throw error;
    }
  }, [fetchIntegrations, showSuccess, handleError]);

  // 检查应用是否已安装
  const isAppInstalled = useCallback((appId: string): boolean => {
    return state.installations.some(inst => inst.appId === appId);
  }, [state.installations]);

  // 获取应用安装记录
  const getAppInstallation = useCallback((appId: string): AppInstallation | undefined => {
    return state.installations.find(inst => inst.appId === appId);
  }, [state.installations]);

  // 获取应用配置
  const getAppConfig = useCallback((appId: string): Record<string, unknown> | null => {
    const installation = state.installations.find(inst => inst.appId === appId);
    if (!installation?.config) return null;
    try {
      return JSON.parse(installation.config);
    } catch {
      return null;
    }
  }, [state.installations]);

  // 检查应用是否激活
  const isAppActive = useCallback((appId: string): boolean => {
    const installation = state.installations.find(inst => inst.appId === appId);
    return installation?.status === 'active';
  }, [state.installations]);

  const value: AppCenterContextType = {
    ...state,
    fetchApps,
    fetchInstallations,
    fetchIntegrations,
    initializeAppCenter,
    installApp,
    uninstallApp,
    updateAppConfig,
    toggleApp,
    connectIntegration,
    disconnectIntegration,
    syncIntegration,
    isAppInstalled,
    getAppInstallation,
    getAppConfig,
    isAppActive,
  };

  return (
    <AppCenterContext.Provider value={value}>
      {children}
    </AppCenterContext.Provider>
  );
};

// ==================== Hook ====================

export const useAppCenter = (): AppCenterContextType => {
  const context = useContext(AppCenterContext);
  if (context === undefined) {
    throw new Error('useAppCenter must be used within an AppCenterProvider');
  }
  return context;
};

export default AppCenterContext;
