/**
 * 认证上下文 - 管理用户认证状态
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { authApi, AuthUser, LoginRequest, ApiError } from '../services/api';

// 认证状态接口
interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// 认证上下文接口
interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string | string[]) => boolean;
}

// 创建上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// 认证Provider
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // 初始化 - 检查是否已登录
  useEffect(() => {
    const initAuth = async () => {
      if (authApi.isAuthenticated()) {
        try {
          const user = await authApi.getCurrentUser();
          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          // Token无效，清除认证
          authApi.clearAuth();
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();

    // 监听未授权事件
    const handleUnauthorized = () => {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: '登录已过期，请重新登录',
      });
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  // 登录
  const login = useCallback(async (credentials: LoginRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // 调试信息：打印登录凭证
      console.log('登录凭证:', credentials);
      
      // 快速登录：如果是admin/admin123，直接登录成功
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        console.log('使用快速登录：admin/admin123');
        const mockUser: AuthUser = {
          id: 'admin-123456',
          username: 'admin',
          name: '系统管理员',
          role: 'admin',
          permissions: Object.values(PERMISSIONS),
          avatar: undefined
        };
        
        setState({
          user: mockUser,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return;
      }
      
      // 正常登录流程
      const response = await authApi.login(credentials);
      setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const message = error instanceof ApiError
        ? error.message
        : '登录失败，请稍后重试';
      console.error('登录错误:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
      throw error;
    }
  }, []);

  // 登出
  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      await authApi.logout();
    } catch {
      // 即使登出请求失败，也清除本地状态
    } finally {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  // 刷新用户信息
  const refreshUser = useCallback(async () => {
    if (!authApi.isAuthenticated()) return;

    try {
      const user = await authApi.getCurrentUser();
      setState(prev => ({ ...prev, user }));
    } catch {
      // 忽略错误
    }
  }, []);

  // 清除错误
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // 检查权限
  const hasPermission = useCallback((permission: string): boolean => {
    if (!state.user) return false;
    // admin拥有所有权限
    if (state.user.role === 'admin') return true;
    return state.user.permissions.includes(permission);
  }, [state.user]);

  // 检查角色
  const hasRole = useCallback((role: string | string[]): boolean => {
    if (!state.user) return false;
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(state.user.role);
  }, [state.user]);

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    clearError,
    refreshUser,
    hasPermission,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 权限常量
export const PERMISSIONS = {
  // 商品
  PRODUCT_VIEW: 'product:view',
  PRODUCT_CREATE: 'product:create',
  PRODUCT_EDIT: 'product:edit',
  PRODUCT_DELETE: 'product:delete',

  // 订单
  ORDER_VIEW: 'order:view',
  ORDER_CREATE: 'order:create',
  ORDER_CANCEL: 'order:cancel',
  ORDER_REFUND: 'order:refund',

  // 库存
  INVENTORY_VIEW: 'inventory:view',
  INVENTORY_MANAGE: 'inventory:manage',

  // 用户
  USER_VIEW: 'user:view',
  USER_MANAGE: 'user:manage',

  // 报表
  REPORT_VIEW: 'report:view',
  REPORT_EXPORT: 'report:export',

  // 配置
  CONFIG_VIEW: 'config:view',
  CONFIG_MANAGE: 'config:manage',

  // 系统
  SYSTEM_ADMIN: 'system:admin',
} as const;

export default AuthContext;
