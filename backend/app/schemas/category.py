# -*- coding: utf- -*-
"""
Category related Pydantic models
"""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CategoryBase(BaseModel):
    """Category base model"""
    name: str
    description: Optional[str] = None
    parent_id: Optional[int] = None


class CategoryCreate(CategoryBase):
    """Category create model"""
    pass


class CategoryUpdate(BaseModel):
    """Category update model"""
    name: Optional[str] = None
    description: Optional[str] = None
    parent_id: Optional[int] = None


class CategoryResponse(CategoryBase):
    """Category response model"""
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class Category(CategoryResponse):
    """Category alias for backward compatibility"""
    pass
