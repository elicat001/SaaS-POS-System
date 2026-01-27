# -*- coding: utf- -*-
"""
Product related Pydantic models
"""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ProductBase(BaseModel):
    """Product base model"""
    name: str
    description: Optional[str] = None
    price: float
    category_id: Optional[int] = None
    supplier_id: Optional[int] = None
    supplierId: Optional[str] = None
    sku: Optional[str] = None
    image_url: Optional[str] = None


class ProductCreate(ProductBase):
    """Product create model"""
    pass


class ProductUpdate(BaseModel):
    """Product update model"""
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category_id: Optional[int] = None
    supplier_id: Optional[int] = None
    supplierId: Optional[str] = None
    sku: Optional[str] = None
    image_url: Optional[str] = None


class ProductResponse(ProductBase):
    """Product response model"""
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
