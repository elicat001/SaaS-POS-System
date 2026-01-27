# -*- coding: utf- -*-
"""
Supplier related Pydantic models
"""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class SupplierBase(BaseModel):
    """Supplier base model"""
    name: str
    contact_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    description: Optional[str] = None


class SupplierCreate(SupplierBase):
    """Supplier create model"""
    pass


class SupplierUpdate(BaseModel):
    """Supplier update model"""
    name: Optional[str] = None
    contact_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    description: Optional[str] = None


class SupplierResponse(SupplierBase):
    """Supplier response model"""
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class Supplier(SupplierResponse):
    """Supplier alias for backward compatibility"""
    pass
