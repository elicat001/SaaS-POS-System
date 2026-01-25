# DateRangePicker 组件使用指南

## 📋 概述

DateRangePicker 是一个功能完整的日期范围选择组件，用于在 SaaS POS System 中选择日期范围。该组件提供了丰富的功能和良好的用户体验。

## ✨ 特性

### 核心功能
- ✅ **日期范围选择**: 支持选择开始日期和结束日期
- ✅ **快捷预设**: 提供6种常用的日期范围预设（今天、昨天、近7天、近30天、本月、今年）
- ✅ **输入验证**: 完整的日期验证逻辑，确保选择的日期范围有效
- ✅ **响应式设计**: 适配不同屏幕尺寸
- ✅ **无障碍支持**: 符合无障碍设计标准
- ✅ **键盘导航**: 支持键盘操作

### 用户体验
- ✅ **流畅动画**: 平滑的展开/收起动画
- ✅ **视觉反馈**: 清晰的选中状态和错误提示
- ✅ **智能限制**: 自动限制日期选择范围
- ✅ **一键清除**: 快速清除选择的日期
- ✅ **点击外部关闭**: 点击组件外部自动关闭下拉面板

### 技术特性
- ✅ **TypeScript**: 完整的类型定义
- ✅ **React Hooks**: 使用现代 React Hooks
- ✅ **可复用性**: 高度可复用的组件设计
- ✅ **可定制性**: 支持自定义样式和属性
- ✅ **无依赖**: 仅依赖 React 和 lucide-react 图标库

## 📦 安装

该组件已集成到项目中，无需额外安装。直接导入即可使用：

```typescript
import DateRangePicker from './DateRangePicker';
```

## 🚀 快速开始

### 基本用法

```typescript
import React, { useState } from 'react';
import DateRangePicker from './DateRangePicker';

const MyComponent: React.FC = () => {
  const [dateRange, setDateRange] = useState('');

  return (
    <DateRangePicker
      value={dateRange}
      onChange={setDateRange}
      placeholder="选择日期范围"
    />
  );
};
```

### 带初始值

```typescript
const MyComponent: React.FC = () => {
  const [dateRange, setDateRange] = useState('2025-01-01 ~ 2025-01-31');

  return (
    <DateRangePicker
      value={dateRange}
      onChange={setDateRange}
      placeholder="选择日期范围"
    />
  );
};
```

## 📖 API 文档

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| **value** | `string` | `''` | 当前选中的日期范围，格式为 `"YYYY-MM-DD ~ YYYY-MM-DD"` |
| **onChange** | `(value: string) => void` | - | 当日期范围改变时的回调函数 |
| **className** | `string` | `''` | 自定义 CSS 类名 |
| **placeholder** | `string` | `'选择日期范围'` | 占位符文本 |
| **disabled** | `boolean` | `false` | 是否禁用组件 |
| **minDate** | `string` | - | 最小可选日期，格式为 `"YYYY-MM-DD"` |
| **maxDate** | `string` | - | 最大可选日期，格式为 `"YYYY-MM-DD"` |

### Value 格式

组件的 `value` 属性采用以下格式：

```typescript
"YYYY-MM-DD ~ YYYY-MM-DD"
```

例如：
- `"2025-01-01 ~ 2025-01-31"`
- `"2025-11-13 ~ 2025-11-19"`

### onChange 回调

当用户选择日期范围后，`onChange` 回调会被调用，参数为格式化的日期范围字符串：

```typescript
const handleChange = (value: string) => {
  console.log('选中的日期范围:', value);
  // 输出: "2025-01-01 ~ 2025-01-31"
};
```

## 💡 使用示例

### 示例 1: 基础使用

```typescript
import React, { useState } from 'react';
import DateRangePicker from './DateRangePicker';

const SalesReport: React.FC = () => {
  const [dateRange, setDateRange] = useState('');

  const handleSearch = () => {
    if (dateRange) {
      // 解析日期范围
      const [startDate, endDate] = dateRange.split('~').map(d => d.trim());
      console.log('开始日期:', startDate);
      console.log('结束日期:', endDate);
      
      // 执行搜索逻辑
      // fetchData(startDate, endDate);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
          placeholder="请选择报表日期范围"
        />
      </div>
      <button
        onClick={handleSearch}
        disabled={!dateRange}
        className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed"
      >
        生成报表
      </button>
    </div>
  );
};
```

### 示例 2: 带日期限制

```typescript
const DateLimitedPicker: React.FC = () => {
  const [dateRange, setDateRange] = useState('');

  return (
    <DateRangePicker
      value={dateRange}
      onChange={setDateRange}
      placeholder="选择2025年的日期范围"
      minDate="2025-01-01"
      maxDate="2025-12-31"
    />
  );
};
```

### 示例 3: 禁用状态

```typescript
const DisabledPicker: React.FC = () => {
  const [dateRange, setDateRange] = useState('2025-01-01 ~ 2025-01-31');

  return (
    <DateRangePicker
      value={dateRange}
      onChange={setDateRange}
      disabled={true}
      placeholder="日期范围已锁定"
    />
  );
};
```

### 示例 4: 自定义样式

```typescript
const StyledPicker: React.FC = () => {
  const [dateRange, setDateRange] = useState('');

  return (
    <DateRangePicker
      value={dateRange}
      onChange={setDateRange}
      className="w-80"
      placeholder="选择日期范围"
    />
  );
};
```

## 🎨 样式定制

### 基础样式

组件使用 Tailwind CSS 进行样式设计，您可以通过 `className` 属性添加自定义样式：

```typescript
<DateRangePicker
  value={dateRange}
  onChange={setDateRange}
  className="w-96"
/>
```

### CSS 类名

组件的主要 CSS 类名：

- `.date-range-picker`: 容器类
- `.date-range-picker input`: 输入框
- `.date-range-picker button`: 按钮
- `.date-range-picker .dropdown`: 下拉面板

### 覆盖默认样式

您可以使用 CSS 覆盖组件的默认样式：

```css
.date-range-picker {
  /* 自定义容器样式 */
}

.date-range-picker button {
  /* 自定义按钮样式 */
  background-color: #your-color;
}
```

## ✅ 验证规则

组件会自动验证以下规则：

### 1. 必填验证
- ✅ 开始日期和结束日期都必须填写
- ✅ 如果任一日期为空，显示错误提示

### 2. 日期顺序验证
- ✅ 开始日期不能晚于结束日期
- ✅ 如果开始日期 > 结束日期，自动调整结束日期为开始日期

### 3. 范围限制验证
- ✅ 开始日期不能早于 `minDate`
- ✅ 结束日期不能晚于 `maxDate`
- ✅ 如果超出范围，显示错误提示

### 4. 格式验证
- ✅ 确保日期格式为 `YYYY-MM-DD`
- ✅ 自动处理浏览器的日期输入格式差异

## 🔧 键盘导航

组件支持以下键盘操作：

| 按键 | 操作 |
|------|------|
| `Enter` | 确认选择并关闭下拉面板 |
| `Escape` | 取消选择并关闭下拉面板 |
| `Tab` | 切换到下一个输入框 |
| `Shift + Tab` | 切换到上一个输入框 |
| `↑ / ↓` | 在日期输入框中调整日期 |

## 🌐 浏览器兼容性

组件支持所有现代浏览器：

| 浏览器 | 版本 | 支持状态 |
|--------|------|----------|
| Chrome | 90+ | ✅ 完全支持 |
| Firefox | 88+ | ✅ 完全支持 |
| Safari | 14+ | ✅ 完全支持 |
| Edge | 90+ | ✅ 完全支持 |
| IE | 11 | ❌ 不支持 |

## 📊 实际应用场景

### 场景 1: 销售报表

在销售汇总页面中，用户需要选择日期范围来查看特定时间段的销售数据：

```typescript
const SalesSummary: React.FC = () => {
  const [dateRange, setDateRange] = useState('2025-11-13 ~ 2025-11-19');
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    if (dateRange) {
      const [start, end] = dateRange.split('~').map(d => d.trim());
      // fetchSalesData(start, end).then(setSalesData);
    }
  }, [dateRange]);

  return (
    <div>
      <DateRangePicker
        value={dateRange}
        onChange={setDateRange}
        placeholder="选择报表日期范围"
      />
      {/* 渲染销售数据 */}
    </div>
  );
};
```

### 场景 2: 余额统计

在余额统计页面中，用户需要选择日期范围来查看资金流动情况：

```typescript
const BalanceStatistics: React.FC = () => {
  const [dateRange, setDateRange] = useState('2025-11-13 ~ 2025-11-19');

  return (
    <div>
      <DateRangePicker
        value={dateRange}
        onChange={setDateRange}
        placeholder="选择统计日期范围"
      />
      {/* 渲染余额统计数据 */}
    </div>
  );
};
```

### 场景 3: 数据导出

在数据导出功能中，用户需要选择日期范围来导出特定时间段的数据：

```typescript
const DataExport: React.FC = () => {
  const [dateRange, setDateRange] = useState('');

  const handleExport = () => {
    if (dateRange) {
      const [start, end] = dateRange.split('~').map(d => d.trim());
      // exportData(start, end);
    }
  };

  return (
    <div>
      <DateRangePicker
        value={dateRange}
        onChange={setDateRange}
        placeholder="选择导出日期范围"
      />
      <button
        onClick={handleExport}
        disabled={!dateRange}
      >
        导出数据
      </button>
    </div>
  );
};
```

## 🔍 故障排除

### 常见问题

#### 问题 1: 组件不显示

**可能原因**:
- 组件未正确导入
- 样式未正确加载

**解决方案**:
```typescript
// 确保导入路径正确
import DateRangePicker from './DateRangePicker'; // 注意路径
```

#### 问题 2: 日期选择后不更新

**可能原因**:
- 未正确使用 `onChange` 回调
- 状态未正确更新

**解决方案**:
```typescript
// 确保正确处理 onChange
const [dateRange, setDateRange] = useState('');

<DateRangePicker
  value={dateRange}
  onChange={setDateRange} // 确保传递正确的回调
/>
```

#### 问题 3: 验证错误提示不消失

**可能原因**:
- 组件状态未正确重置

**解决方案**:
```typescript
// 组件会自动处理验证状态
// 如果问题持续，尝试清除选择后重新选择
```

#### 问题 4: 快捷预设不工作

**可能原因**:
- JavaScript 日期处理问题

**解决方案**:
```typescript
// 确保浏览器支持 Date 对象
// 检查系统时间是否正确
```

## 📈 性能优化

### 1. 减少不必要的渲染

使用 `React.memo` 优化组件：

```typescript
import { memo } from 'react';

const OptimizedComponent = memo(() => {
  const [dateRange, setDateRange] = useState('');
  
  return (
    <DateRangePicker
      value={dateRange}
      onChange={setDateRange}
    />
  );
});
```

### 2. 延迟加载

对于大型应用，可以使用 React.lazy 延迟加载组件：

```typescript
const DateRangePicker = React.lazy(() => import('./DateRangePicker'));

const MyComponent = () => {
  const [dateRange, setDateRange] = useState('');
  
  return (
    <React.Suspense fallback={<div>加载中...</div>}>
      <DateRangePicker
        value={dateRange}
        onChange={setDateRange}
      />
    </React.Suspense>
  );
};
```

## 🤝 贡献指南

如果您想改进这个组件，请遵循以下步骤：

### 1. Fork 项目

```bash
git clone https://github.com/your-repo/your-project.git
```

### 2. 创建分支

```bash
git checkout -b feature/your-feature
```

### 3. 实现功能

修改 `DateRangePicker.tsx` 文件，添加新功能或修复问题。

### 4. 测试功能

在实际应用中测试组件的功能和性能。

### 5. 提交 PR

```bash
git add .
git commit -m "Add your feature"
git push origin feature/your-feature
```

## 📄 许可证

MIT License

## 📞 支持

如果您在使用过程中遇到问题，请：

1. 查看本文档的「故障排除」部分
2. 检查组件的 TypeScript 类型定义
3. 查看组件的源代码注释
4. 在项目的 Issues 中提问

## 🎉 总结

DateRangePicker 组件是一个功能完整、易于使用的日期范围选择器，具有以下优势：

### 优点
- ✅ 功能完整，满足大多数日期选择需求
- ✅ 用户体验良好，交互流畅
- ✅ 代码质量高，易于维护
- ✅ 文档完善，易于上手
- ✅ 高度可定制，适应不同场景

### 适用场景
- 📊 报表系统
- 📈 数据分析
- 📅 日程安排
- 📤 数据导出
- 📥 数据导入

### 未来改进方向
- 🔄 支持时间选择（不仅仅是日期）
- 🌍 国际化支持
- 🎨 更多主题选项
- 📱 移动端优化
- 🚀 性能进一步优化

---

**感谢使用 DateRangePicker 组件！** 🎉

*本文档基于 2026-01-25 的组件版本生成*

