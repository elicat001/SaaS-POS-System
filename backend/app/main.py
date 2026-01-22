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
    orders, reservations, inventory, analytics, auth, ai_proxy,
    apps, integrations
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

    # 初始化默认应用
    init_default_apps()

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


def init_default_apps():
    """初始化默认应用"""
    db = SessionLocal()
    try:
        # 默认应用列表
        default_apps = [
            {
                "id": "wine-storage",
                "name": "存酒",
                "description": "用户未喝完的酒可暂存在店里，方便下次继续享用",
                "icon": "🍺",
                "category": "builtin",
                "route": "/apps/wine-storage"
            },
            {
                "id": "reviews",
                "name": "评价",
                "description": "用户订单评价管理，收集顾客反馈提升服务质量",
                "icon": "💬",
                "category": "builtin",
                "route": "/apps/reviews"
            },
            {
                "id": "store-wifi",
                "name": "门店WIFI",
                "description": "设置各个门店WIFI信息，方便顾客连接",
                "icon": "📶",
                "category": "builtin",
                "route": "/apps/wifi"
            },
            {
                "id": "queue-system",
                "name": "排队取号",
                "description": "门店在线排队取号，顾客可远程取号等位",
                "icon": "🔢",
                "category": "builtin",
                "route": "/apps/queue"
            },
            {
                "id": "reservations",
                "name": "预约订座",
                "description": "方便预约消费，可设置不同时段的预约规则",
                "icon": "📅",
                "category": "builtin",
                "route": "/reservations"
            },
            {
                "id": "form-builder",
                "name": "表单工具",
                "description": "可制作各类报名表、数据收集、商务调查表单",
                "icon": "📊",
                "category": "builtin",
                "route": "/apps/forms"
            },
            {
                "id": "phone-verify",
                "name": "手机号验证组件",
                "description": "可管理快速获取手机号码验证的功能",
                "icon": "📱",
                "category": "builtin",
                "route": "/apps/phone-verify"
            },
            {
                "id": "expiry-print",
                "name": "有效期打印",
                "description": "管理打印有效期标签小票，适用于食品保鲜",
                "icon": "🖨",
                "category": "builtin",
                "route": "/apps/expiry-print"
            },
            {
                "id": "logistics",
                "name": "实时快递查询",
                "description": "可实时查询物流动态，跟踪配送状态",
                "icon": "🚚",
                "category": "builtin",
                "route": "/apps/logistics"
            },
            {
                "id": "kds",
                "name": "后厨显示系统(KDS)",
                "description": "后厨可实时接收并展示来自各渠道的订单",
                "icon": "🖥",
                "category": "builtin",
                "route": "/apps/kds"
            },
            {
                "id": "invoice",
                "name": "开发票管理",
                "description": "方便用户可直接在订单里申请开发票",
                "icon": "🧾",
                "category": "builtin",
                "route": "/apps/invoice"
            },
            {
                "id": "jd-delivery",
                "name": "京东秒送",
                "description": "直连京东秒送平台，实现商品、库存、订单同步",
                "icon": "JD",
                "category": "integration",
                "route": "/apps/integration/jd"
            },
            {
                "id": "eleme",
                "name": "饿了么（淘宝闪购）",
                "description": "直连饿了么渠道，实现商品、库存、订单同步",
                "icon": "饿",
                "category": "integration",
                "route": "/apps/integration/eleme"
            },
            {
                "id": "meituan",
                "name": "美团外卖",
                "description": "直连美团外卖，实现商品、库存、订单同步",
                "icon": "美",
                "category": "integration",
                "route": "/apps/integration/meituan"
            }
        ]

        for app_data in default_apps:
            existing = db.query(models.App).filter(models.App.id == app_data["id"]).first()
            if not existing:
                app = models.App(
                    id=app_data["id"],
                    name=app_data["name"],
                    description=app_data["description"],
                    icon=app_data["icon"],
                    category=app_data["category"],
                    version="1.0.0",
                    isActive=True,
                    route=app_data["route"],
                    createdAt=datetime.utcnow().isoformat()
                )
                db.add(app)

        db.commit()
        print("✓ 默认应用已初始化")
    except Exception as e:
        print(f"初始化默认应用失败: {e}")
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

# 应用中心路由
app.include_router(apps.router)
app.include_router(integrations.router)


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
