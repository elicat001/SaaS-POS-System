# -*- coding: utf-8 -*-
"""
App Center 相关的 Pydantic 模型
"""

from pydantic import BaseModel
from typing import Optional


class AppCenterBase(BaseModel):
    """App Center 基础模型"""
    submitterPhone: Optional[str] = None
    
    class Config:
        from_attributes = True


class AppCenterCreate(AppCenterBase):
    """创建 App Center 模型"""
    pass


class AppCenterResponse(AppCenterBase):
    """App Center 响应模型"""
    id: int
    
    class Config:
        from_attributes = True
