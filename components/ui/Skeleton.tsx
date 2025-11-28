/**
 * 骨架屏组件 - 用于数据加载时的占位显示
 */

import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  animation?: 'pulse' | 'wave' | 'none';
}

/**
 * 基础骨架屏组件
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
  variant = 'rectangular',
  animation = 'pulse'
}) => {
  const baseClasses = 'bg-gray-200';

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  const style: React.CSSProperties = {
    width: width,
    height: height,
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
};

/**
 * 文本骨架屏
 */
export const SkeletonText: React.FC<{
  lines?: number;
  className?: string;
}> = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton
        key={index}
        variant="text"
        height={16}
        width={index === lines - 1 ? '60%' : '100%'}
      />
    ))}
  </div>
);

/**
 * 头像骨架屏
 */
export const SkeletonAvatar: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <Skeleton
      variant="circular"
      className={`${sizeClasses[size]} ${className}`}
    />
  );
};

/**
 * 卡片骨架屏
 */
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
    <div className="flex items-center space-x-4 mb-4">
      <SkeletonAvatar />
      <div className="flex-1">
        <Skeleton variant="text" height={16} width="40%" className="mb-2" />
        <Skeleton variant="text" height={12} width="60%" />
      </div>
    </div>
    <SkeletonText lines={3} />
  </div>
);

/**
 * 表格行骨架屏
 */
export const SkeletonTableRow: React.FC<{
  columns?: number;
  className?: string;
}> = ({ columns = 5, className = '' }) => (
  <tr className={className}>
    {Array.from({ length: columns }).map((_, index) => (
      <td key={index} className="px-4 py-3">
        <Skeleton variant="text" height={16} width={index === 0 ? '80%' : '60%'} />
      </td>
    ))}
  </tr>
);

/**
 * 表格骨架屏
 */
export const SkeletonTable: React.FC<{
  rows?: number;
  columns?: number;
  className?: string;
}> = ({ rows = 5, columns = 5, className = '' }) => (
  <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          {Array.from({ length: columns }).map((_, index) => (
            <th key={index} className="px-4 py-3 text-left">
              <Skeleton variant="text" height={14} width="70%" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, index) => (
          <SkeletonTableRow key={index} columns={columns} />
        ))}
      </tbody>
    </table>
  </div>
);

/**
 * 列表项骨架屏
 */
export const SkeletonListItem: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center space-x-4 p-4 ${className}`}>
    <SkeletonAvatar />
    <div className="flex-1">
      <Skeleton variant="text" height={16} width="30%" className="mb-2" />
      <Skeleton variant="text" height={12} width="50%" />
    </div>
    <Skeleton variant="rounded" width={60} height={24} />
  </div>
);

/**
 * 列表骨架屏
 */
export const SkeletonList: React.FC<{
  items?: number;
  className?: string;
}> = ({ items = 5, className = '' }) => (
  <div className={`bg-white rounded-lg shadow divide-y divide-gray-200 ${className}`}>
    {Array.from({ length: items }).map((_, index) => (
      <SkeletonListItem key={index} />
    ))}
  </div>
);

/**
 * 统计卡片骨架屏
 */
export const SkeletonStatCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
    <div className="flex items-center justify-between mb-4">
      <Skeleton variant="text" height={14} width="40%" />
      <Skeleton variant="circular" width={40} height={40} />
    </div>
    <Skeleton variant="text" height={32} width="60%" className="mb-2" />
    <Skeleton variant="text" height={12} width="30%" />
  </div>
);

/**
 * 仪表盘骨架屏
 */
export const SkeletonDashboard: React.FC = () => (
  <div className="space-y-6">
    {/* 统计卡片 */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <SkeletonStatCard key={index} />
      ))}
    </div>

    {/* 图表区域 */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <Skeleton variant="text" height={20} width="30%" className="mb-4" />
        <Skeleton variant="rounded" height={250} />
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <Skeleton variant="text" height={20} width="30%" className="mb-4" />
        <Skeleton variant="rounded" height={250} />
      </div>
    </div>

    {/* 列表 */}
    <div className="bg-white rounded-lg shadow p-6">
      <Skeleton variant="text" height={20} width="20%" className="mb-4" />
      <SkeletonTable rows={5} columns={4} />
    </div>
  </div>
);

/**
 * 商品网格骨架屏
 */
export const SkeletonProductGrid: React.FC<{
  items?: number;
  className?: string;
}> = ({ items = 8, className = '' }) => (
  <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
        <Skeleton variant="rectangular" height={150} />
        <div className="p-4">
          <Skeleton variant="text" height={16} width="70%" className="mb-2" />
          <Skeleton variant="text" height={14} width="40%" className="mb-3" />
          <div className="flex justify-between items-center">
            <Skeleton variant="text" height={20} width="30%" />
            <Skeleton variant="rounded" width={32} height={32} />
          </div>
        </div>
      </div>
    ))}
  </div>
);

/**
 * 表单骨架屏
 */
export const SkeletonForm: React.FC<{
  fields?: number;
  className?: string;
}> = ({ fields = 4, className = '' }) => (
  <div className={`space-y-6 ${className}`}>
    {Array.from({ length: fields }).map((_, index) => (
      <div key={index}>
        <Skeleton variant="text" height={14} width="20%" className="mb-2" />
        <Skeleton variant="rounded" height={40} />
      </div>
    ))}
    <div className="flex justify-end space-x-3 pt-4">
      <Skeleton variant="rounded" width={80} height={40} />
      <Skeleton variant="rounded" width={80} height={40} />
    </div>
  </div>
);

export default Skeleton;
