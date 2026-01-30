/**
 * 路由保护组件 - 实现认证和权限控制
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, PERMISSIONS } from '../contexts/AuthContext';
import { Lock, AlertTriangle } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: string | string[];
  fallback?: React.ReactNode;
}

/**
 * 受保护的路由组件
 * 检查用户是否已认证，以及是否有访问权限
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  requiredRole,
  fallback
}) => {
  const { isAuthenticated, isLoading, hasPermission, hasRole } = useAuth();
  const location = useLocation();

  // 加载中状态
  if (isLoading) {
    return fallback || <LoadingScreen />;
  }

  // 未认证 - 重定向到登录页
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 检查权限
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <AccessDenied type="permission" />;
  }

  // 检查角色
  if (requiredRole && !hasRole(requiredRole)) {
    return <AccessDenied type="role" />;
  }

  return <>{children}</>;
};

/**
 * 加载中屏幕
 */
const LoadingScreen: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">加载中...</p>
    </div>
  </div>
);

/**
 * 访问拒绝页面
 */
interface AccessDeniedProps {
  type: 'permission' | 'role';
}

const AccessDenied: React.FC<AccessDeniedProps> = ({ type }) => (
  <div className="min-h-[400px] flex items-center justify-center">
    <div className="text-center max-w-md p-8">
      <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <Lock className="w-8 h-8 text-red-600" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        访问被拒绝
      </h2>
      <p className="text-gray-600 mb-6">
        {type === 'permission'
          ? '您没有访问此页面的权限。请联系管理员获取相应权限。'
          : '您的角色无法访问此页面。请联系管理员。'}
      </p>
      <button
        onClick={() => window.history.back()}
        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
      >
        返回上一页
      </button>
    </div>
  </div>
);

/**
 * 权限检查组件 - 用于条件渲染
 */
interface PermissionGateProps {
  children: React.ReactNode;
  permission?: string;
  role?: string | string[];
  fallback?: React.ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  permission,
  role,
  fallback = null
}) => {
  const { hasPermission, hasRole, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  if (role && !hasRole(role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

/**
 * 需要管理员权限的路由
 */
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole="admin">
    {children}
  </ProtectedRoute>
);

/**
 * 需要管理员或经理权限的路由
 */
export const ManagerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole={['admin', 'manager']}>
    {children}
  </ProtectedRoute>
);

/**
 * 预定义的权限路由
 */
export const ProductManageRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredPermission={PERMISSIONS.PRODUCT_EDIT}>
    {children}
  </ProtectedRoute>
);

export const OrderManageRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredPermission={PERMISSIONS.ORDER_CREATE}>
    {children}
  </ProtectedRoute>
);

export const ReportViewRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredPermission={PERMISSIONS.REPORT_VIEW}>
    {children}
  </ProtectedRoute>
);

export const ConfigManageRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredPermission={PERMISSIONS.CONFIG_MANAGE}>
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute;
