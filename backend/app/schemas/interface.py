# -*- coding: utf- -*-
"""
Interface related Pydantic models
"""

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class InterfaceBase(BaseModel):
    """Interface base model"""
    name: str
    path: Optional[str] = None
    component: Optional[str] = None
    redirect: Optional[str] = None
    parent_id: Optional[int] = None
    order: Optional[int] = None
    icon: Optional[str] = None
    is_visible: Optional[bool] = None
    is_keep_alive: Optional[bool] = None
    is_affix: Optional[bool] = None
    is_fullscreen: Optional[bool] = None
    is_iframe: Optional[bool] = None
    is_cache: Optional[bool] = None
    is_breadcrumb: Optional[bool] = None
    is_tab: Optional[bool] = None
    is_router: Optional[bool] = None
    is_menu: Optional[bool] = None
    is_button: Optional[bool] = None
    is_page: Optional[bool] = None
    is_permission: Optional[bool] = None


class InterfaceCreate(InterfaceBase):
    """Interface create model"""
    pass


class InterfacePageCreate(InterfaceCreate):
    """Interface page create alias for backward compatibility"""
    pass


class InterfaceUpdate(BaseModel):
    """Interface update model"""
    name: Optional[str] = None
    path: Optional[str] = None
    component: Optional[str] = None
    redirect: Optional[str] = None
    parent_id: Optional[int] = None
    order: Optional[int] = None
    icon: Optional[str] = None
    is_visible: Optional[bool] = None
    is_keep_alive: Optional[bool] = None
    is_affix: Optional[bool] = None
    is_fullscreen: Optional[bool] = None
    is_iframe: Optional[bool] = None
    is_cache: Optional[bool] = None
    is_breadcrumb: Optional[bool] = None
    is_tab: Optional[bool] = None
    is_router: Optional[bool] = None
    is_menu: Optional[bool] = None
    is_button: Optional[bool] = None
    is_page: Optional[bool] = None
    is_permission: Optional[bool] = None


class InterfacePageUpdate(InterfaceUpdate):
    """Interface page update alias for backward compatibility"""
    pass


class InterfaceResponse(InterfaceBase):
    """Interface response model"""
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class InterfacePage(InterfaceResponse):
    """Interface page alias for backward compatibility"""
    pass


# Widget models
class InterfaceWidgetBase(BaseModel):
    """Interface widget base model"""
    name: str
    type: str
    config: Optional[dict] = None
    order: Optional[int] = None
    is_visible: Optional[bool] = None
    page_id: Optional[int] = None


class InterfaceWidgetCreate(InterfaceWidgetBase):
    """Interface widget create model"""
    pass


class InterfaceWidgetUpdate(BaseModel):
    """Interface widget update model"""
    name: Optional[str] = None
    type: Optional[str] = None
    config: Optional[dict] = None
    order: Optional[int] = None
    is_visible: Optional[bool] = None
    page_id: Optional[int] = None


class InterfaceWidgetResponse(InterfaceWidgetBase):
    """Interface widget response model"""
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class InterfaceWidget(InterfaceWidgetResponse):
    """Interface widget alias for backward compatibility"""
    pass


# Reorder request model
class WidgetReorderRequest(BaseModel):
    """Widget reorder request model"""
    widget_ids: List[int]
    page_id: int


# Template models
class InterfaceTemplateBase(BaseModel):
    """Interface template base model"""
    name: str
    description: Optional[str] = None
    config: Optional[dict] = None
    is_default: Optional[bool] = None


class InterfaceTemplateCreate(InterfaceTemplateBase):
    """Interface template create model"""
    pass


class InterfaceTemplateUpdate(BaseModel):
    """Interface template update model"""
    name: Optional[str] = None
    description: Optional[str] = None
    config: Optional[dict] = None
    is_default: Optional[bool] = None


class InterfaceTemplateResponse(InterfaceTemplateBase):
    """Interface template response model"""
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class InterfaceTemplate(InterfaceTemplateResponse):
    """Interface template alias for backward compatibility"""
    pass


# Theme models
class InterfaceThemeBase(BaseModel):
    """Interface theme base model"""
    name: str
    description: Optional[str] = None
    config: Optional[dict] = None
    is_default: Optional[bool] = None


class InterfaceThemeCreate(InterfaceThemeBase):
    """Interface theme create model"""
    pass


class InterfaceThemeUpdate(BaseModel):
    """Interface theme update model"""
    name: Optional[str] = None
    description: Optional[str] = None
    config: Optional[dict] = None
    is_default: Optional[bool] = None


class InterfaceThemeResponse(InterfaceThemeBase):
    """Interface theme response model"""
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class InterfaceTheme(InterfaceThemeResponse):
    """Interface theme alias for backward compatibility"""
    pass


# History models
class InterfaceHistoryBase(BaseModel):
    """Interface history base model"""
    page_id: int
    action: str
    changes: Optional[dict] = None
    user_id: Optional[int] = None


class InterfaceHistoryCreate(InterfaceHistoryBase):
    """Interface history create model"""
    pass


class InterfaceHistoryResponse(InterfaceHistoryBase):
    """Interface history response model"""
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class InterfaceHistory(InterfaceHistoryResponse):
    """Interface history alias for backward compatibility"""
    pass


# NavBar models
class InterfaceNavBarBase(BaseModel):
    """Interface NavBar base model"""
    name: str
    config: Optional[dict] = None
    is_default: Optional[bool] = None


class InterfaceNavBarCreate(InterfaceNavBarBase):
    """Interface NavBar create model"""
    pass


class InterfaceNavBarUpdate(BaseModel):
    """Interface NavBar update model"""
    name: Optional[str] = None
    config: Optional[dict] = None
    is_default: Optional[bool] = None


class InterfaceNavBarResponse(InterfaceNavBarBase):
    """Interface NavBar response model"""
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class InterfaceNavBar(InterfaceNavBarResponse):
    """Interface NavBar alias for backward compatibility"""
    pass


# Popup models
class InterfacePopupBase(BaseModel):
    """Interface popup base model"""
    name: str
    config: Optional[dict] = None
    is_default: Optional[bool] = None


class InterfacePopupCreate(InterfacePopupBase):
    """Interface popup create model"""
    pass


class InterfacePopupUpdate(BaseModel):
    """Interface popup update model"""
    name: Optional[str] = None
    config: Optional[dict] = None
    is_default: Optional[bool] = None


class InterfacePopupResponse(InterfacePopupBase):
    """Interface popup response model"""
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class InterfacePopup(InterfacePopupResponse):
    """Interface popup alias for backward compatibility"""
    pass
