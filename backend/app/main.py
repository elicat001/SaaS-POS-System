"""
FastAPI 应用主入口
"""

import hashlib
import uuid
from datetime import datetime
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.app.database import Base, engine, SessionLocal
from backend.app.routers import (
    products, categories, suppliers, tables, users,
    orders, reservations, inventory, analytics, auth, ai_proxy
)
from backend.app import models


# ==================== 应用生命周期管理 ====================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用启动和关闭时的处理"""
    # 启动时：创建数据库表
    Base.metadata.create_all(bind=engine)

    # 创建默认管理员账户
    create_default_admin()

    yield

    # 关闭时的清理工作（如果需要）
    pass


def create_default_admin():
    """创建默认管理员账户"""
    db = SessionLocal()
    try:
        # 检查是否已存在管理员
        admin = db.query(models.SystemUser).filter(
            models.SystemUser.username == "admin"
        ).first()

        if not admin:
            admin = models.SystemUser(
                id=str(uuid.uuid4()),
                username="admin",
                passwordHash=hashlib.sha256("admin123".encode()).hexdigest(),
                name="系统管理员",
                role="admin",
                isActive=True,
                createdAt=datetime.utcnow().isoformat()
            )
            db.add(admin)
            db.commit()
            print("✓ 默认管理员账户已创建 (用户名: admin, 密码: admin123)")
    except Exception as e:
        print(f"创建默认管理员失败: {e}")
        db.rollback()
    finally:
        db.close()


# ==================== 创建FastAPI应用 ====================

app = FastAPI(
    title="SaaS POS API",
    description="餐饮SaaS POS系统后端API",
    version="1.0.0",
    lifespan=lifespan
)


# ==================== CORS中间件配置 ====================

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================== 全局异常处理 ====================

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """全局异常处理器"""
    # 记录错误（生产环境应使用日志系统）
    print(f"[ERROR] {request.method} {request.url}: {exc}")

    return JSONResponse(
        status_code=500,
        content={
            "detail": "服务器内部错误，请稍后重试",
            "code": "INTERNAL_ERROR"
        }
    )


# ==================== 请求日志中间件 ====================

@app.middleware("http")
async def log_requests(request: Request, call_next):
    """请求日志中间件"""
    # 记录请求（开发环境）
    print(f"→ {request.method} {request.url.path}")

    response = await call_next(request)

    # 记录响应状态
    print(f"← {request.method} {request.url.path} [{response.status_code}]")

    return response


# ==================== 注册路由 ====================

# 认证路由（不需要前缀，已在路由中定义）
app.include_router(auth.router)

# AI代理路由
app.include_router(ai_proxy.router)

# 业务路由
app.include_router(categories.router)
app.include_router(suppliers.router)
app.include_router(products.router)
app.include_router(tables.router)
app.include_router(users.router)
app.include_router(orders.router)
app.include_router(reservations.router)
app.include_router(inventory.router)
app.include_router(analytics.router)


# ==================== 健康检查端点 ====================

@app.get("/health")
async def health_check():
    """健康检查"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }


@app.get("/")
async def root():
    """根路径"""
    return {
        "message": "SaaS POS API",
        "docs": "/docs",
        "health": "/health"
    }
