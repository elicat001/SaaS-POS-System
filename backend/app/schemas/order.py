# -*- coding: utf- -*-
"""
Order related Pydantic models
"""

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class OrderItemBase(BaseModel):
    """Order item base model"""
    product_id: int
    quantity: int
    price: float
    type: str = "product"


class OrderItemCreate(OrderItemBase):
    """Order item create model"""
    pass


class OrderItemResponse(OrderItemBase):
    """Order item response model"""
    id: int
    product_name: str
    
    class Config:
        from_attributes = True


class OrderBase(BaseModel):
    """Order base model"""
    table_id: Optional[int] = None
    customer_name: Optional[str] = None
    total_amount: float
    status: str = "pending"


class OrderCreate(OrderBase):
    """Order create model"""
    items: List[OrderItemCreate]


class OrderResponse(OrderBase):
    """Order response model"""
    id: int
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemResponse]
    
    class Config:
        from_attributes = True


class Order(OrderResponse):
    """Order alias for backward compatibility"""
    pass


class OrderCreate(OrderBase):
    """Order create model"""
    items: List[OrderItemCreate]
