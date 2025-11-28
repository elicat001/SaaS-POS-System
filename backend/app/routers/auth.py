"""
认证路由 - 处理用户登录、注册、令牌刷新等
"""

from datetime import datetime, timedelta
from typing import Optional
import uuid
import hashlib
import secrets

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app import models

router = APIRouter(prefix="/api/auth", tags=["auth"])
security = HTTPBearer()

# 配置
SECRET_KEY = secrets.token_hex(32)  # 生产环境应从环境变量获取
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24小时
REFRESH_TOKEN_EXPIRE_DAYS = 7

# 简单的token存储（生产环境应使用Redis）
active_tokens: dict[str, dict] = {}


# ==================== 数据模型 ====================

class LoginRequest(BaseModel):
    username: str
    password: str


class RegisterRequest(BaseModel):
    username: str
    password: str
    name: str
    phone: Optional[str] = None
    role: str = "staff"


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: dict


class UserResponse(BaseModel):
    id: str
    username: str
    name: str
    role: str
    permissions: list[str]
    avatar: Optional[str] = None


class ChangePasswordRequest(BaseModel):
    oldPassword: str
    newPassword: str


class RefreshTokenRequest(BaseModel):
    refresh_token: str


# ==================== 辅助函数 ====================

def hash_password(password: str) -> str:
    """密码哈希"""
    return hashlib.sha256(password.encode()).hexdigest()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """验证密码"""
    return hash_password(plain_password) == hashed_password


def generate_token() -> str:
    """生成随机token"""
    return secrets.token_urlsafe(32)


def get_permissions_for_role(role: str) -> list[str]:
    """根据角色获取权限列表"""
    permissions_map = {
        "admin": [
            "product:view", "product:create", "product:edit", "product:delete",
            "order:view", "order:create", "order:cancel", "order:refund",
            "inventory:view", "inventory:manage",
            "user:view", "user:manage",
            "report:view", "report:export",
            "config:view", "config:manage",
            "system:admin"
        ],
        "manager": [
            "product:view", "product:create", "product:edit",
            "order:view", "order:create", "order:cancel", "order:refund",
            "inventory:view", "inventory:manage",
            "user:view",
            "report:view", "report:export",
            "config:view"
        ],
        "cashier": [
            "product:view",
            "order:view", "order:create",
            "inventory:view",
            "user:view"
        ],
        "staff": [
            "product:view",
            "order:view",
            "inventory:view"
        ]
    }
    return permissions_map.get(role, permissions_map["staff"])


def create_tokens(user: models.SystemUser) -> tuple[str, str]:
    """创建访问令牌和刷新令牌"""
    access_token = generate_token()
    refresh_token = generate_token()

    # 存储token信息
    active_tokens[access_token] = {
        "user_id": user.id,
        "type": "access",
        "expires": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    active_tokens[refresh_token] = {
        "user_id": user.id,
        "type": "refresh",
        "expires": datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    }

    return access_token, refresh_token


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> models.SystemUser:
    """获取当前用户（依赖注入）"""
    token = credentials.credentials

    token_data = active_tokens.get(token)
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无效的访问令牌"
        )

    if datetime.utcnow() > token_data["expires"]:
        del active_tokens[token]
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="访问令牌已过期"
        )

    if token_data["type"] != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无效的令牌类型"
        )

    user = db.get(models.SystemUser, token_data["user_id"])
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户不存在"
        )

    if not user.isActive:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="用户已被禁用"
        )

    return user


# ==================== API端点 ====================

@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """用户登录"""
    # 查找用户
    user = db.query(models.SystemUser).filter(
        models.SystemUser.username == request.username
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户名或密码错误"
        )

    if not verify_password(request.password, user.passwordHash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户名或密码错误"
        )

    if not user.isActive:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="用户已被禁用"
        )

    # 生成令牌
    access_token, refresh_token = create_tokens(user)

    # 更新最后登录时间
    user.lastLogin = datetime.utcnow().isoformat()
    db.commit()

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user={
            "id": user.id,
            "username": user.username,
            "name": user.name,
            "role": user.role,
            "permissions": get_permissions_for_role(user.role),
            "avatar": user.avatar
        }
    )


@router.post("/register")
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    """用户注册"""
    # 检查用户名是否存在
    existing_user = db.query(models.SystemUser).filter(
        models.SystemUser.username == request.username
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="用户名已存在"
        )

    # 创建用户
    user = models.SystemUser(
        id=str(uuid.uuid4()),
        username=request.username,
        passwordHash=hash_password(request.password),
        name=request.name,
        phone=request.phone,
        role=request.role,
        isActive=True,
        createdAt=datetime.utcnow().isoformat()
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {"id": user.id, "username": user.username}


@router.post("/logout")
def logout(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """用户登出"""
    token = credentials.credentials

    # 删除token
    if token in active_tokens:
        del active_tokens[token]

    return {"message": "登出成功"}


@router.get("/me", response_model=UserResponse)
def get_me(current_user: models.SystemUser = Depends(get_current_user)):
    """获取当前用户信息"""
    return UserResponse(
        id=current_user.id,
        username=current_user.username,
        name=current_user.name,
        role=current_user.role,
        permissions=get_permissions_for_role(current_user.role),
        avatar=current_user.avatar
    )


@router.post("/refresh")
def refresh_token(request: RefreshTokenRequest, db: Session = Depends(get_db)):
    """刷新访问令牌"""
    token_data = active_tokens.get(request.refresh_token)

    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无效的刷新令牌"
        )

    if datetime.utcnow() > token_data["expires"]:
        del active_tokens[request.refresh_token]
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="刷新令牌已过期"
        )

    if token_data["type"] != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无效的令牌类型"
        )

    user = db.get(models.SystemUser, token_data["user_id"])
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户不存在"
        )

    # 生成新的访问令牌
    new_access_token = generate_token()
    active_tokens[new_access_token] = {
        "user_id": user.id,
        "type": "access",
        "expires": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }

    return {"access_token": new_access_token}


@router.post("/change-password")
def change_password(
    request: ChangePasswordRequest,
    current_user: models.SystemUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """修改密码"""
    if not verify_password(request.oldPassword, current_user.passwordHash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="原密码错误"
        )

    current_user.passwordHash = hash_password(request.newPassword)
    current_user.updatedAt = datetime.utcnow().isoformat()
    db.commit()

    return {"message": "密码修改成功"}
