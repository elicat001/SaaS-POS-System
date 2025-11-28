/**
 * Loading组件集合 - 各种加载状态指示器
 */

import React from 'react';
import { Loader2, RefreshCw } from 'lucide-react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'white' | 'gray';
  className?: string;
}

/**
 * 基础旋转加载器
 */
export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colorClasses = {
    primary: 'text-blue-600',
    white: 'text-white',
    gray: 'text-gray-400',
  };

  return (
    <Loader2
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
    />
  );
};

/**
 * 页面级加载指示器
 */
interface PageLoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export const PageLoading: React.FC<PageLoadingProps> = ({
  message = '加载中...',
  fullScreen = false
}) => {
  const containerClasses = fullScreen
    ? 'fixed inset-0 bg-white bg-opacity-90 z-50'
    : 'w-full h-64';

  return (
    <div className={`${containerClasses} flex flex-col items-center justify-center`}>
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-pulse"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
      </div>
      {message && (
        <p className="mt-4 text-gray-600 text-sm">{message}</p>
      )}
    </div>
  );
};

/**
 * 内联加载指示器
 */
interface InlineLoadingProps {
  text?: string;
  size?: 'sm' | 'md';
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({
  text = '加载中',
  size = 'md'
}) => {
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  const spinnerSize = size === 'sm' ? 'sm' : 'md';

  return (
    <span className={`inline-flex items-center ${textSize} text-gray-500`}>
      <Spinner size={spinnerSize} color="gray" className="mr-2" />
      {text}
    </span>
  );
};

/**
 * 按钮加载状态
 */
interface ButtonLoadingProps {
  loading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
}

export const LoadingButton: React.FC<ButtonLoadingProps> = ({
  loading,
  children,
  loadingText = '处理中...',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  variant = 'primary'
}) => {
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`
        inline-flex items-center justify-center px-4 py-2 rounded-lg
        font-medium transition-all
        ${variantClasses[variant]}
        ${(loading || disabled) ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {loading ? (
        <>
          <Spinner size="sm" color={variant === 'secondary' ? 'gray' : 'white'} className="mr-2" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
};

/**
 * 数据刷新加载器
 */
interface RefreshLoadingProps {
  loading: boolean;
  onRefresh: () => void;
  text?: string;
}

export const RefreshLoading: React.FC<RefreshLoadingProps> = ({
  loading,
  onRefresh,
  text = '刷新'
}) => (
  <button
    onClick={onRefresh}
    disabled={loading}
    className={`
      inline-flex items-center text-sm text-gray-600 hover:text-gray-900
      ${loading ? 'cursor-not-allowed opacity-50' : ''}
    `}
  >
    <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
    {loading ? '刷新中...' : text}
  </button>
);

/**
 * 列表加载更多
 */
interface LoadMoreProps {
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  loadingText?: string;
  loadMoreText?: string;
  noMoreText?: string;
}

export const LoadMore: React.FC<LoadMoreProps> = ({
  loading,
  hasMore,
  onLoadMore,
  loadingText = '加载中...',
  loadMoreText = '加载更多',
  noMoreText = '没有更多了'
}) => (
  <div className="py-4 text-center">
    {loading ? (
      <InlineLoading text={loadingText} />
    ) : hasMore ? (
      <button
        onClick={onLoadMore}
        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
      >
        {loadMoreText}
      </button>
    ) : (
      <span className="text-gray-400 text-sm">{noMoreText}</span>
    )}
  </div>
);

/**
 * 骨架屏包装器
 */
interface LoadingWrapperProps {
  loading: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
  error?: string | null;
  onRetry?: () => void;
}

export const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
  loading,
  skeleton,
  children,
  error,
  onRetry
}) => {
  if (loading) {
    return <>{skeleton}</>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-gray-600 mb-4">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            重试
          </button>
        )}
      </div>
    );
  }

  return <>{children}</>;
};

/**
 * 进度条
 */
interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
  color?: 'blue' | 'green' | 'yellow' | 'red';
  size?: 'sm' | 'md' | 'lg';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showLabel = true,
  color = 'blue',
  size = 'md'
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    yellow: 'bg-yellow-500',
    red: 'bg-red-600',
  };

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]} overflow-hidden`}>
        <div
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full transition-all duration-300`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-right text-xs text-gray-500 mt-1">
          {clampedProgress.toFixed(0)}%
        </p>
      )}
    </div>
  );
};

/**
 * 脉冲点加载器
 */
export const PulseDots: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex space-x-1 ${className}`}>
    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
  </div>
);

export default {
  Spinner,
  PageLoading,
  InlineLoading,
  LoadingButton,
  RefreshLoading,
  LoadMore,
  LoadingWrapper,
  ProgressBar,
  PulseDots,
};
