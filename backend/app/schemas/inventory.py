# -*- coding: utf- -*-
"""
Inventory related Pydantic models
"""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class InventoryBase(BaseModel):
    """Inventory base model"""
    product_id: int
    quantity: int
    note: Optional[str] = None


class InventoryCreate(InventoryBase):
    """Inventory create model"""
    pass


class InventoryUpdate(BaseModel):
    """Inventory update model"""
    quantity: Optional[int] = None
    note: Optional[str] = None


class InventoryResponse(InventoryBase):
    """Inventory response model"""
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class StockLogBase(BaseModel):
    """Stock log base model"""
    product_id: int
    quantity_change: int
    reason: str
    notes: Optional[str] = None


class StockLogCreate(StockLogBase):
    """Stock log create model"""
    pass


class StockLogResponse(StockLogBase):
    """Stock log response model"""
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class StockLog(StockLogResponse):
    """Stock log alias for backward compatibility"""
    pass
