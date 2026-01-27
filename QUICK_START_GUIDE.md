# SaaS POS System - 快速开始指南

## 🎯 快速开始

### 1. 启动服务器

#### 后端服务器 (FastAPI)
```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### 前端服务器 (Vue 3)
```bash
cd saas-pos-vue
npm run dev
```

### 2. 访问应用

打开浏览器访问：
- **前端应用**: http://localhost:5173/
- **API文档**: http://localhost:8000/docs

---

## 📱 界面预览

### 登录页面
- 访问 http://localhost:5173/
- 点击"注册"创建新账户
- 或使用测试账户登录

### 仪表板
- 销售统计数据
- 订单数量统计
- 库存预警信息
- 销售趋势图表

### 功能模块
- **产品管理**: 添加、编辑、删除产品
- **订单管理**: 创建订单、处理支付
- **库存管理**: 跟踪库存数量、设置预警
- **桌台管理**: 管理桌台状态、生成QR码
- **预订管理**: 创建和管理预订
- **用户管理**: 管理用户账户和权限
- **系统设置**: 配置界面和主题

---

## 🔧 常见操作

### 创建产品
1. 点击左侧菜单"产品管理"
2. 点击"添加产品"按钮
3. 填写产品信息（名称、价格、分类等）
4. 点击"保存"

### 创建订单
1. 点击左侧菜单"订单管理"
2. 点击"创建订单"
3. 选择桌台
4. 添加产品到订单
5. 选择支付方式
6. 点击"提交订单"

### 管理库存
1. 点击左侧菜单"库存管理"
2. 查看库存列表
3. 点击"入库"或"出库"按钮
4. 填写数量和备注
5. 点击"确认"

### 创建预订
1. 点击左侧菜单"预订管理"
2. 点击"添加预订"
3. 选择日期和时间
4. 填写客户信息
5. 选择桌台
6. 点击"保存"

---

## 📊 数据统计

### 销售统计
- 每日销售金额
- 订单数量
- 畅销产品排行
- 支付方式统计

### 库存统计
- 库存总价值
- 低库存预警
- 库存周转率
- 入库/出库统计

### 桌台统计
- 桌台使用率
- 平均消费金额
- 翻台率
- 高峰时段统计

---

## ⚙️ 系统设置

### 界面配置
- 主题切换（浅色/深色）
- 界面布局调整
- 组件配置
- 模板管理

### 用户管理
- 创建用户账户
- 分配角色和权限
- 重置密码
- 查看用户活动

### 系统参数
- 货币设置
- 时间格式
- 语言设置
- 通知设置

---

## 🛠️ 开发指南

### 添加新功能

#### 1. 后端开发

##### 创建新模型
```python
# app/models/new_model.py
from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base
from datetime import datetime

class NewModel(Base):
    __tablename__ = 'new_model'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

##### 创建新Schema
```python
# app/schemas/new_schema.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class NewModelBase(BaseModel):
    name: str

class NewModelCreate(NewModelBase):
    pass

class NewModelResponse(NewModelBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
```

##### 创建新路由
```python
# app/routers/new_router.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import crud
from app.schemas import NewModelResponse, NewModelCreate

router = APIRouter(prefix="/api/new-model", tags=["new-model"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[NewModelResponse])
def list_items(db: Session = Depends(get_db)):
    return crud.list_items(db)
```

#### 2. 前端开发

##### 创建新页面
```vue
<!-- src/views/NewPage.vue -->
<template>
  <div class="new-page">
    <h1>新页面</h1>
    <!-- 页面内容 -->
  </div>
</template>

<script setup lang="ts">
// 页面逻辑
</script>

<style scoped>
/* 页面样式 */
</style>
```

##### 添加路由
```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import NewPage from '@/views/NewPage.vue'

const routes = [
  {
    path: '/new-page',
    name: 'NewPage',
    component: NewPage,
    meta: { requiresAuth: true }
  }
]
```

---

## 🐛 故障排除

### 问题1: 服务器无法启动
**解决方案**:
- 检查端口是否被占用（5173, 8000）
- 确保已安装所有依赖（npm install, pip install -r requirements.txt）
- 检查Node.js和Python版本

### 问题2: 页面显示空白
**解决方案**:
- 等待几秒钟，应用正在加载
- 刷新页面
- 检查浏览器控制台是否有错误

### 问题3: API请求失败
**解决方案**:
- 检查后端服务器是否运行
- 检查API端点是否正确
- 检查网络连接
- 查看后端日志

### 问题4: 数据库连接失败
**解决方案**:
- 检查数据库文件是否存在（backend/saas.db）
- 检查数据库配置
- 尝试删除数据库文件，应用会自动重新创建

---

## 📚 学习资源

### 官方文档
- Vue 3: https://vuejs.org/
- FastAPI: https://fastapi.tiangolo.com/
- TypeScript: https://www.typescriptlang.org/
- Tailwind CSS: https://tailwindcss.com/

### 教程推荐
- Vue 3 + TypeScript 教程
- FastAPI 快速入门
- 前后端分离开发实践

---

## 🤝 贡献指南

### 提交代码
1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

### 代码规范
- 遵循PEP 8 (Python)
- 遵循ESLint规则 (TypeScript)
- 使用TypeScript类型注解
- 添加适当的注释

---

## 📄 许可证

MIT License

---

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- GitHub Issues
- 邮件

---

**最后更新**: 2026-01-27
**版本**: 1.0.0

---

🎉 **祝您使用愉快！** 🎉
