# SaaS POS System

一个功能完整的餐饮SaaS POS系统，包含前端(React)和后端(FastAPI)。

## 功能特性

- **POS收银系统** - 完整的点餐、下单、支付流程
- **库存管理** - 商品库存追踪、低库存预警、出入库记录
- **桌台管理** - 餐桌状态管理、预订系统
- **数据分析** - 销售报表、利润分析、趋势图表
- **用户管理** - 会员系统、积分余额
- **AI智能分析** - 基于Gemini的业务洞察（可选）
- **系统配置** - 小程序、打印机、支付等配置

## 技术栈

### 前端
- React 19 + TypeScript
- Vite (构建工具)
- React Router DOM (路由)
- Tailwind CSS (样式)
- Recharts (图表)
- Lucide React (图标)

### 后端
- FastAPI (Web框架)
- SQLAlchemy + SQLite (ORM/数据库)
- Pydantic (数据验证)
- Uvicorn (ASGI服务器)

## 快速开始

### 前提条件
- Node.js >= 18
- Python >= 3.10

### 安装依赖

```bash
# 前端依赖
npm install

# 后端依赖
pip install -r requirements.txt
```

### 启动服务

**方式一：同时启动前后端**

```bash
# 终端1 - 启动后端
npm run backend
# 或者
cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 终端2 - 启动前端
npm run dev
```

**方式二：仅前端（使用Mock数据）**

```bash
npm run dev
```

### 访问应用

- 前端: http://localhost:3000
- 后端API: http://localhost:8000
- API文档: http://localhost:8000/docs

### 默认登录账户

- 用户名: `admin`
- 密码: `admin123`

## 项目结构

```
├── App.tsx                 # 应用主入口
├── types.ts                # TypeScript类型定义
├── constants.ts            # 常量和Mock数据
├── vite.config.ts          # Vite配置
│
├── components/             # React组件
│   ├── Login.tsx          # 登录页
│   ├── Dashboard.tsx      # 数据仪表板
│   ├── POS.tsx            # POS收银
│   ├── InventoryManagement.tsx  # 库存管理
│   ├── TableManagement.tsx      # 桌台管理
│   ├── ProtectedRoute.tsx # 路由保护
│   ├── ui/                # UI组件
│   │   ├── Loading.tsx    # 加载组件
│   │   └── Skeleton.tsx   # 骨架屏
│   └── Config*.tsx        # 配置页面
│
├── contexts/               # React Context
│   ├── AuthContext.tsx    # 认证状态
│   ├── AppContext.tsx     # 应用状态
│   └── NotificationContext.tsx  # 通知系统
│
├── services/               # 服务层
│   └── api.ts             # API调用封装
│
├── tests/                  # 测试文件
│   ├── setup.ts           # 测试配置
│   ├── services/          # 服务测试
│   └── contexts/          # Context测试
│
└── backend/               # 后端代码
    └── app/
        ├── main.py        # FastAPI入口
        ├── models.py      # 数据库模型
        ├── schemas.py     # Pydantic模式
        ├── crud.py        # CRUD操作
        ├── database.py    # 数据库配置
        └── routers/       # API路由
            ├── auth.py    # 认证API
            ├── products.py
            ├── orders.py
            └── ...
```

## 主要优化

### 1. 前后端集成
- 创建了统一的API服务层 (`services/api.ts`)
- 支持请求/响应拦截、错误处理、自动重试
- Token自动管理和刷新

### 2. 认证授权
- JWT Token认证系统
- 基于角色的权限控制 (RBAC)
- 路由保护组件

### 3. 状态管理
- 使用React Context API替代props drilling
- AuthContext - 认证状态
- AppContext - 业务数据
- NotificationContext - 通知系统

### 4. 安全优化
- API密钥移至后端，不在前端暴露
- 密码哈希存储
- 请求验证和清理

### 5. 数据库优化
- 添加审计字段 (createdAt, updatedAt)
- 软删除支持
- 数据库索引优化
- 系统配置表和审计日志表

### 6. UI/UX改进
- 全局Loading状态
- 骨架屏占位
- 通知提示系统
- 错误边界处理

### 7. 测试框架
- Jest + React Testing Library
- API服务测试
- Context测试
- 组件测试

## 环境变量

创建 `.env.local` 文件：

```env
# 可选：API服务器地址
VITE_API_URL=http://localhost:8000/api
```

后端环境变量（在启动时设置）：

```bash
# Gemini API密钥（可选，用于AI功能）
export GEMINI_API_KEY=your_api_key
```

## 脚本命令

```bash
# 开发
npm run dev          # 启动前端开发服务器
npm run backend      # 启动后端服务器

# 构建
npm run build        # 构建生产版本
npm run preview      # 预览构建结果

# 测试
npm run test         # 运行测试
npm run test:watch   # 监视模式
npm run test:coverage # 覆盖率报告

# 其他
npm run type-check   # TypeScript类型检查
npm run lint         # 代码检查
```

## API端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/auth/login` | POST | 用户登录 |
| `/api/auth/logout` | POST | 用户登出 |
| `/api/auth/me` | GET | 获取当前用户 |
| `/api/products/` | GET/POST | 商品列表/创建 |
| `/api/products/{id}` | GET/PUT/DELETE | 商品操作 |
| `/api/orders/` | GET/POST | 订单列表/创建 |
| `/api/tables/` | GET/POST | 桌台列表/创建 |
| `/api/inventory/logs` | GET/POST | 库存日志 |
| `/api/analytics/sales-summary` | GET | 销售汇总 |
| `/api/ai/insight` | POST | AI业务洞察 |

## 许可证

MIT License
