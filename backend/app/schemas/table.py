# -*- coding: utf- -*-
"""
Table related Pydantic models
"""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TableBase(BaseModel):
    """Table base model"""
    name: str
    number: Optional[int] = None
    capacity: Optional[int] = None
    status: str = "available"
    description: Optional[str] = None


class TableCreate(TableBase):
    """Table create model"""
    pass


class TableUpdate(BaseModel):
    """Table update model"""
    name: Optional[str] = None
    number: Optional[int] = None
    capacity: Optional[int] = None
    status: Optional[str] = None
    description: Optional[str] = None


class TableResponse(TableBase):
    """Table response model"""
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class Table(TableResponse):
    """Table alias for backward compatibility"""
    pass
