# SaaS POS System

一个现代化的餐饮 SaaS POS 系统，采用 React + FastAPI 全栈架构，提供完整的收银、库存、会员、数据分析等功能。

## 功能概览

### 核心功能

| 模块 | 功能描述 |
|------|----------|
| **POS 收银** | 点餐下单、多种支付方式、订单管理、小票打印 |
| **商品管理** | 分类管理、商品 CRUD、批量操作、图片上传 |
| **库存管理** | 库存追踪、出入库记录、低库存预警、供应商管理 |
| **桌台管理** | 餐桌状态、二维码桌码、预约订座 |
| **会员系统** | 会员管理、积分余额、等级体系 |
| **数据分析** | 销售报表、利润分析、趋势图表、TOP 商品 |
| **系统配置** | 小程序设置、打印机配置、第三方配送对接 |

### 界面装修系统

可视化拖拽式小程序界面配置：

- **18 种组件类型** - 搜索框、轮播图、金刚区、商品列表、会员卡片等
- **多页面支持** - 首页、会员中心、订单页、分类页独立配置
- **拖拽排序** - 直观的组件顺序调整
- **实时预览** - 375px 手机端预览效果
- **模板系统** - 保存/应用页面模板
- **主题管理** - 全局配色方案
- **版本历史** - 配置回滚、撤销/重做

## 技术栈

### 前端

```
React 19 + TypeScript
├── Vite          # 构建工具
├── React Router  # 路由管理
├── Tailwind CSS  # 原子化样式
├── Recharts      # 数据可视化
└── Lucide        # 图标库
```

### 后端

```
FastAPI + Python 3.10+
├── SQLAlchemy    # ORM
├── SQLite        # 数据库
├── Pydantic v2   # 数据验证
└── Uvicorn       # ASGI 服务器
```

## 快速开始

### 环境要求

- Node.js >= 18
- Python >= 3.10

### 安装

```bash
# 克隆项目
git clone https://github.com/elicat001/SaaS-POS-System.git
cd SaaS-POS-System

# 安装前端依赖
npm install

# 安装后端依赖
pip install -r requirements.txt
```

### 启动

```bash
# 终端 1 - 启动后端 (端口 8000)
npm run backend
# 或
cd backend && uvicorn app.main:app --reload --port 8000

# 终端 2 - 启动前端 (端口 3000)
npm run dev
```

### 访问

| 服务 | 地址 |
|------|------|
| 前端应用 | http://localhost:3000 |
| 后端 API | http://localhost:8000 |
| API 文档 | http://localhost:8000/docs |

### 默认账户

```
用户名: admin
密码: admin123
```

## 项目结构

```
SaaS-POS-System/
├── App.tsx                    # 应用入口、路由配置
├── types.ts                   # TypeScript 类型定义
├── vite.config.ts             # Vite 配置
│
├── components/                # React 组件
│   ├── Login.tsx              # 登录页
│   ├── Dashboard.tsx          # 数据仪表板
│   ├── POS.tsx                # POS 收银台
│   ├── ProductList.tsx        # 商品列表
│   ├── OrderList.tsx          # 订单列表
│   ├── InventoryManagement.tsx # 库存管理
│   ├── TableManagement.tsx    # 桌台管理
│   ├── UserList.tsx           # 会员管理
│   ├── ConfigInterfaceSettings.tsx  # 界面装修
│   ├── Config*.tsx            # 其他配置页
│   └── ui/                    # 通用 UI 组件
│       ├── Loading.tsx
│       └── Skeleton.tsx
│
├── contexts/                  # React Context
│   ├── AuthContext.tsx        # 认证状态管理
│   ├── AppContext.tsx         # 业务数据管理
│   └── NotificationContext.tsx # 全局通知
│
├── services/
│   └── api.ts                 # API 服务封装
│
└── backend/                   # FastAPI 后端
    └── app/
        ├── main.py            # 应用入口
        ├── models.py          # 数据库模型
        ├── schemas.py         # Pydantic 模式
        ├── crud.py            # CRUD 操作
        ├── database.py        # 数据库配置
        └── routers/           # API 路由
            ├── auth.py        # 认证
            ├── products.py    # 商品
            ├── orders.py      # 订单
            ├── tables.py      # 桌台
            ├── users.py       # 用户
            ├── inventory.py   # 库存
            ├── analytics.py   # 数据分析
            ├── interface.py   # 界面装修
            └── ...
```

## API 接口

### 认证

| 方法 | 端点 | 描述 |
|------|------|------|
| POST | `/api/auth/login` | 用户登录 |
| POST | `/api/auth/logout` | 用户登出 |
| GET | `/api/auth/me` | 获取当前用户 |

### 业务数据

| 方法 | 端点 | 描述 |
|------|------|------|
| GET/POST | `/api/products/` | 商品列表/创建 |
| GET/PUT/DELETE | `/api/products/{id}` | 商品详情/更新/删除 |
| GET/POST | `/api/orders/` | 订单列表/创建 |
| PATCH | `/api/orders/{id}/status` | 更新订单状态 |
| GET/POST | `/api/tables/` | 桌台列表/创建 |
| GET/POST | `/api/categories/` | 分类列表/创建 |
| GET/POST | `/api/users/` | 会员列表/创建 |
| GET | `/api/inventory/logs` | 库存日志 |

### 数据分析

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/api/analytics/dashboard` | 仪表板统计 |
| GET | `/api/analytics/sales-summary` | 销售汇总 |
| GET | `/api/analytics/top-products` | 热销商品 |
| GET | `/api/analytics/hourly-sales` | 时段销售 |

### 界面装修

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/api/interface/pages` | 页面列表 |
| GET | `/api/interface/pages/type/{type}` | 按类型获取页面 |
| POST | `/api/interface/pages/{id}/widgets` | 添加组件 |
| PUT | `/api/interface/widgets/{id}` | 更新组件 |
| POST | `/api/interface/pages/{id}/publish` | 发布页面 |
| GET/POST | `/api/interface/templates` | 模板管理 |
| GET/POST | `/api/interface/themes` | 主题管理 |

## 开发命令

```bash
# 开发
npm run dev          # 启动前端开发服务器
npm run backend      # 启动后端服务器

# 构建
npm run build        # 构建生产版本
npm run preview      # 预览构建结果

# 代码质量
npm run type-check   # TypeScript 类型检查
npm run lint         # ESLint 检查

# 测试
npm run test         # 运行测试
npm run test:watch   # 监视模式
npm run test:coverage # 覆盖率报告
```

## 环境变量

### 前端 (.env.local)

```env
VITE_API_URL=http://localhost:8000/api
```

### 后端

```bash
# 可选：Gemini API 密钥（用于 AI 分析功能）
export GEMINI_API_KEY=your_api_key
```

## 架构特点

### 前端架构

- **Context API** - 轻量级状态管理，避免 props drilling
- **统一 API 层** - 请求拦截、错误处理、自动重试、Token 刷新
- **路由保护** - 基于认证状态的路由守卫
- **组件化设计** - 高复用性 UI 组件库

### 后端架构

- **分层设计** - Router → CRUD → Model 清晰分层
- **数据验证** - Pydantic v2 严格类型校验
- **审计字段** - 自动记录 createdAt/updatedAt
- **软删除** - 支持数据软删除和恢复
- **索引优化** - 关键字段索引加速查询

### 安全特性

- JWT Token 认证
- 密码哈希存储 (SHA-256)
- API 密钥后端管理
- CORS 跨域配置
- 请求日志记录

## 数据库模型

```
SystemUser      # 系统用户（员工）
Category        # 商品分类
Product         # 商品
Supplier        # 供应商
Table           # 餐桌
User            # 会员用户
Order           # 订单
OrderItem       # 订单项
Reservation     # 预订
StockLog        # 库存日志
InterfacePage   # 界面页面
InterfaceWidget # 界面组件
InterfaceTemplate # 界面模板
InterfaceTheme  # 界面主题
SystemConfig    # 系统配置
AuditLog        # 审计日志
```

## 截图预览

> 待补充

## License

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request。
