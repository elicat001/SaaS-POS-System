/**
 * 通知上下文 - 全局消息提示系统
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

// 通知类型
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

// 通知接口
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number; // 毫秒，0表示不自动关闭
  action?: {
    label: string;
    onClick: () => void;
  };
}

// 通知选项
export interface NotificationOptions {
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// 上下文接口
interface NotificationContextType {
  notifications: Notification[];
  addNotification: (type: NotificationType, options: NotificationOptions) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  success: (title: string, message?: string) => string;
  error: (title: string, message?: string) => string;
  warning: (title: string, message?: string) => string;
  info: (title: string, message?: string) => string;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// 默认持续时间
const DEFAULT_DURATION: Record<NotificationType, number> = {
  success: 3000,
  error: 5000,
  warning: 4000,
  info: 3000,
};

interface NotificationProviderProps {
  children: ReactNode;
  maxNotifications?: number;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  maxNotifications = 5
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // 生成唯一ID
  const generateId = () => `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // 添加通知
  const addNotification = useCallback((type: NotificationType, options: NotificationOptions): string => {
    const id = generateId();
    const duration = options.duration ?? DEFAULT_DURATION[type];

    const notification: Notification = {
      id,
      type,
      ...options,
      duration,
    };

    setNotifications(prev => {
      const newNotifications = [notification, ...prev];
      // 限制最大数量
      return newNotifications.slice(0, maxNotifications);
    });

    // 自动移除
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, [maxNotifications]);

  // 移除通知
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // 清除所有
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // 快捷方法
  const success = useCallback((title: string, message?: string) =>
    addNotification('success', { title, message }), [addNotification]);

  const error = useCallback((title: string, message?: string) =>
    addNotification('error', { title, message }), [addNotification]);

  const warning = useCallback((title: string, message?: string) =>
    addNotification('warning', { title, message }), [addNotification]);

  const info = useCallback((title: string, message?: string) =>
    addNotification('info', { title, message }), [addNotification]);

  const value: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />
    </NotificationContext.Provider>
  );
};

// 通知容器组件
interface NotificationContainerProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  onRemove
}) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

// 单个通知项组件
interface NotificationItemProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onRemove
}) => {
  const { id, type, title, message, action } = notification;

  // 样式配置
  const styles: Record<NotificationType, { bg: string; icon: React.ReactNode; border: string }> = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: <XCircle className="w-5 h-5 text-red-500" />,
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: <Info className="w-5 h-5 text-blue-500" />,
    },
  };

  const style = styles[type];

  return (
    <div
      className={`
        ${style.bg} ${style.border} border rounded-lg shadow-lg p-4
        pointer-events-auto animate-slide-in-right
        transform transition-all duration-300 ease-out
      `}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">{style.icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{title}</p>
          {message && (
            <p className="mt-1 text-sm text-gray-600">{message}</p>
          )}
          {action && (
            <button
              onClick={action.onClick}
              className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              {action.label}
            </button>
          )}
        </div>
        <button
          onClick={() => onRemove(id)}
          className="flex-shrink-0 p-1 rounded hover:bg-gray-200 transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  );
};

// Hook
export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;
