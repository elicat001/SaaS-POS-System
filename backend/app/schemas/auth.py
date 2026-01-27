# -*- coding: utf- -*-
"""
Authentication related Pydantic models
"""

from pydantic import BaseModel
from typing import Optional


class Token(BaseModel):
    """Token response model"""
    access_token: str
    token_type: str
    refresh_token: Optional[str] = None


class TokenData(BaseModel):
    """Token data model"""
    username: Optional[str] = None
    user_id: Optional[int] = None
    role: Optional[str] = None


class LoginCredentials(BaseModel):
    """Login credentials model"""
    username: str
    password: str


class RegisterCredentials(BaseModel):
    """Register credentials model"""
    username: str
    password: str
    email: Optional[str] = None
    phone: Optional[str] = None
    role: str = "user"


class RefreshToken(BaseModel):
    """Refresh token model"""
    refresh_token: str
