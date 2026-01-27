# -*- coding: utf- -*-
"""
User related Pydantic models
"""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    """User base model"""
    username: str
    email: Optional[str] = None
    phone: Optional[str] = None
    role: str = "user"
    notes: Optional[str] = None


class UserCreate(UserBase):
    """User create model"""
    password: str


class UserUpdate(BaseModel):
    """User update model"""
    email: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[str] = None
    notes: Optional[str] = None


class UserResponse(UserBase):
    """User response model"""
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class User(UserResponse):
    """User alias for backward compatibility"""
    pass
