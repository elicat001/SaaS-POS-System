# -*- coding: utf- -*-
"""
Reservation related Pydantic models
"""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ReservationBase(BaseModel):
    """Reservation base model"""
    customer_name: str
    phone: Optional[str] = None
    table_id: Optional[int] = None
    date: datetime
    party_size: Optional[int] = None
    status: str = "pending"
    notes: Optional[str] = None


class ReservationCreate(ReservationBase):
    """Reservation create model"""
    pass


class ReservationUpdate(BaseModel):
    """Reservation update model"""
    customer_name: Optional[str] = None
    phone: Optional[str] = None
    table_id: Optional[int] = None
    date: Optional[datetime] = None
    party_size: Optional[int] = None
    status: Optional[str] = None
    notes: Optional[str] = None


class ReservationResponse(ReservationBase):
    """Reservation response model"""
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class Reservation(ReservationResponse):
    """Reservation alias for backward compatibility"""
    pass
