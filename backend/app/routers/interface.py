"""
界面装修API路由
"""

import json
import uuid
from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/api/interface", tags=["interface"])


# ==================== 页面管理 ====================

@router.get("/pages", response_model=List[schemas.InterfacePage])
def list_pages(db: Session = Depends(get_db)):
    """获取所有页面配置"""
    pages = db.query(models.InterfacePage).all()
    result = []
    for page in pages:
        page_dict = {
            "id": page.id,
            "pageType": page.pageType,
            "name": page.name,
            "description": page.description,
            "backgroundColor": page.backgroundColor,
            "backgroundImage": page.backgroundImage,
            "isPublished": page.isPublished,
            "publishedAt": page.publishedAt,
            "version": page.version,
            "createdAt": page.createdAt,
            "updatedAt": page.updatedAt,
            "widgets": []
        }
        for widget in page.widgets:
            widget_dict = {
                "id": widget.id,
                "pageId": widget.pageId,
                "widgetType": widget.widgetType,
                "name": widget.name,
                "props": json.loads(widget.props) if widget.props else {},
                "style": json.loads(widget.style) if widget.style else None,
                "sortOrder": widget.sortOrder,
                "isVisible": widget.isVisible,
                "createdAt": widget.createdAt,
                "updatedAt": widget.updatedAt
            }
            page_dict["widgets"].append(widget_dict)
        result.append(page_dict)
    return result


@router.get("/pages/{page_id}", response_model=schemas.InterfacePage)
def get_page(page_id: str, db: Session = Depends(get_db)):
    """获取单个页面配置"""
    page = db.query(models.InterfacePage).filter(models.InterfacePage.id == page_id).first()
    if not page:
        raise HTTPException(status_code=404, detail="页面不存在")

    widgets = []
    for widget in page.widgets:
        widgets.append({
            "id": widget.id,
            "pageId": widget.pageId,
            "widgetType": widget.widgetType,
            "name": widget.name,
            "props": json.loads(widget.props) if widget.props else {},
            "style": json.loads(widget.style) if widget.style else None,
            "sortOrder": widget.sortOrder,
            "isVisible": widget.isVisible,
            "createdAt": widget.createdAt,
            "updatedAt": widget.updatedAt
        })

    return {
        "id": page.id,
        "pageType": page.pageType,
        "name": page.name,
        "description": page.description,
        "backgroundColor": page.backgroundColor,
        "backgroundImage": page.backgroundImage,
        "isPublished": page.isPublished,
        "publishedAt": page.publishedAt,
        "version": page.version,
        "createdAt": page.createdAt,
        "updatedAt": page.updatedAt,
        "widgets": widgets
    }


@router.get("/pages/type/{page_type}", response_model=schemas.InterfacePage)
def get_page_by_type(page_type: str, db: Session = Depends(get_db)):
    """根据页面类型获取配置"""
    page = db.query(models.InterfacePage).filter(models.InterfacePage.pageType == page_type).first()
    if not page:
        # 创建默认页面
        page = models.InterfacePage(
            id=str(uuid.uuid4()),
            pageType=page_type,
            name=get_default_page_name(page_type),
            backgroundColor='#f8fafc',
            isPublished=False,
            version=1,
            createdAt=datetime.utcnow().isoformat()
        )
        db.add(page)
        db.commit()
        db.refresh(page)

    widgets = []
    for widget in page.widgets:
        widgets.append({
            "id": widget.id,
            "pageId": widget.pageId,
            "widgetType": widget.widgetType,
            "name": widget.name,
            "props": json.loads(widget.props) if widget.props else {},
            "style": json.loads(widget.style) if widget.style else None,
            "sortOrder": widget.sortOrder,
            "isVisible": widget.isVisible,
            "createdAt": widget.createdAt,
            "updatedAt": widget.updatedAt
        })

    return {
        "id": page.id,
        "pageType": page.pageType,
        "name": page.name,
        "description": page.description,
        "backgroundColor": page.backgroundColor,
        "backgroundImage": page.backgroundImage,
        "isPublished": page.isPublished,
        "publishedAt": page.publishedAt,
        "version": page.version,
        "createdAt": page.createdAt,
        "updatedAt": page.updatedAt,
        "widgets": widgets
    }


def get_default_page_name(page_type: str) -> str:
    names = {
        'home': '首页',
        'user': '会员中心',
        'order': '订单页',
        'category': '分类页',
        'product_detail': '商品详情页'
    }
    return names.get(page_type, '未命名页面')


@router.post("/pages", response_model=schemas.InterfacePage)
def create_page(page_data: schemas.InterfacePageCreate, db: Session = Depends(get_db)):
    """创建页面"""
    page = models.InterfacePage(
        id=str(uuid.uuid4()),
        pageType=page_data.pageType,
        name=page_data.name,
        description=page_data.description,
        backgroundColor=page_data.backgroundColor,
        backgroundImage=page_data.backgroundImage,
        isPublished=False,
        version=1,
        createdAt=datetime.utcnow().isoformat()
    )
    db.add(page)
    db.commit()
    db.refresh(page)
    return {
        "id": page.id,
        "pageType": page.pageType,
        "name": page.name,
        "description": page.description,
        "backgroundColor": page.backgroundColor,
        "backgroundImage": page.backgroundImage,
        "isPublished": page.isPublished,
        "publishedAt": page.publishedAt,
        "version": page.version,
        "createdAt": page.createdAt,
        "updatedAt": page.updatedAt,
        "widgets": []
    }


@router.put("/pages/{page_id}", response_model=schemas.InterfacePage)
def update_page(page_id: str, page_data: schemas.InterfacePageUpdate, db: Session = Depends(get_db)):
    """更新页面基本信息"""
    page = db.query(models.InterfacePage).filter(models.InterfacePage.id == page_id).first()
    if not page:
        raise HTTPException(status_code=404, detail="页面不存在")

    if page_data.name is not None:
        page.name = page_data.name
    if page_data.description is not None:
        page.description = page_data.description
    if page_data.backgroundColor is not None:
        page.backgroundColor = page_data.backgroundColor
    if page_data.backgroundImage is not None:
        page.backgroundImage = page_data.backgroundImage

    page.updatedAt = datetime.utcnow().isoformat()
    db.commit()
    db.refresh(page)

    widgets = []
    for widget in page.widgets:
        widgets.append({
            "id": widget.id,
            "pageId": widget.pageId,
            "widgetType": widget.widgetType,
            "name": widget.name,
            "props": json.loads(widget.props) if widget.props else {},
            "style": json.loads(widget.style) if widget.style else None,
            "sortOrder": widget.sortOrder,
            "isVisible": widget.isVisible,
            "createdAt": widget.createdAt,
            "updatedAt": widget.updatedAt
        })

    return {
        "id": page.id,
        "pageType": page.pageType,
        "name": page.name,
        "description": page.description,
        "backgroundColor": page.backgroundColor,
        "backgroundImage": page.backgroundImage,
        "isPublished": page.isPublished,
        "publishedAt": page.publishedAt,
        "version": page.version,
        "createdAt": page.createdAt,
        "updatedAt": page.updatedAt,
        "widgets": widgets
    }


@router.post("/pages/{page_id}/publish")
def publish_page(page_id: str, db: Session = Depends(get_db)):
    """发布页面"""
    page = db.query(models.InterfacePage).filter(models.InterfacePage.id == page_id).first()
    if not page:
        raise HTTPException(status_code=404, detail="页面不存在")

    # 保存历史版本
    widgets_data = []
    for widget in page.widgets:
        widgets_data.append({
            "widgetType": widget.widgetType,
            "name": widget.name,
            "props": json.loads(widget.props) if widget.props else {},
            "style": json.loads(widget.style) if widget.style else None,
            "sortOrder": widget.sortOrder,
            "isVisible": widget.isVisible
        })

    history = models.InterfaceHistory(
        id=str(uuid.uuid4()),
        pageId=page_id,
        version=page.version,
        config=json.dumps({
            "backgroundColor": page.backgroundColor,
            "backgroundImage": page.backgroundImage,
            "widgets": widgets_data
        }),
        operationType='publish',
        description=f'发布版本 {page.version}',
        createdAt=datetime.utcnow().isoformat()
    )
    db.add(history)

    page.isPublished = True
    page.publishedAt = datetime.utcnow().isoformat()
    page.version += 1
    page.updatedAt = datetime.utcnow().isoformat()

    db.commit()
    return {"message": "发布成功", "version": page.version}


# ==================== 组件管理 ====================

@router.post("/pages/{page_id}/widgets", response_model=schemas.InterfaceWidget)
def add_widget(page_id: str, widget_data: schemas.InterfaceWidgetCreate, db: Session = Depends(get_db)):
    """添加组件到页面"""
    page = db.query(models.InterfacePage).filter(models.InterfacePage.id == page_id).first()
    if not page:
        raise HTTPException(status_code=404, detail="页面不存在")

    # 获取最大排序号
    max_order = db.query(models.InterfaceWidget).filter(
        models.InterfaceWidget.pageId == page_id
    ).count()

    widget = models.InterfaceWidget(
        id=str(uuid.uuid4()),
        pageId=page_id,
        widgetType=widget_data.widgetType,
        name=widget_data.name,
        props=json.dumps(widget_data.props),
        style=json.dumps(widget_data.style) if widget_data.style else None,
        sortOrder=widget_data.sortOrder if widget_data.sortOrder > 0 else max_order,
        isVisible=widget_data.isVisible,
        createdAt=datetime.utcnow().isoformat()
    )
    db.add(widget)
    db.commit()
    db.refresh(widget)

    return {
        "id": widget.id,
        "pageId": widget.pageId,
        "widgetType": widget.widgetType,
        "name": widget.name,
        "props": json.loads(widget.props),
        "style": json.loads(widget.style) if widget.style else None,
        "sortOrder": widget.sortOrder,
        "isVisible": widget.isVisible,
        "createdAt": widget.createdAt,
        "updatedAt": widget.updatedAt
    }


@router.put("/widgets/{widget_id}", response_model=schemas.InterfaceWidget)
def update_widget(widget_id: str, widget_data: schemas.InterfaceWidgetUpdate, db: Session = Depends(get_db)):
    """更新组件"""
    widget = db.query(models.InterfaceWidget).filter(models.InterfaceWidget.id == widget_id).first()
    if not widget:
        raise HTTPException(status_code=404, detail="组件不存在")

    if widget_data.name is not None:
        widget.name = widget_data.name
    if widget_data.props is not None:
        widget.props = json.dumps(widget_data.props)
    if widget_data.style is not None:
        widget.style = json.dumps(widget_data.style)
    if widget_data.sortOrder is not None:
        widget.sortOrder = widget_data.sortOrder
    if widget_data.isVisible is not None:
        widget.isVisible = widget_data.isVisible

    widget.updatedAt = datetime.utcnow().isoformat()
    db.commit()
    db.refresh(widget)

    return {
        "id": widget.id,
        "pageId": widget.pageId,
        "widgetType": widget.widgetType,
        "name": widget.name,
        "props": json.loads(widget.props),
        "style": json.loads(widget.style) if widget.style else None,
        "sortOrder": widget.sortOrder,
        "isVisible": widget.isVisible,
        "createdAt": widget.createdAt,
        "updatedAt": widget.updatedAt
    }


@router.delete("/widgets/{widget_id}")
def delete_widget(widget_id: str, db: Session = Depends(get_db)):
    """删除组件"""
    widget = db.query(models.InterfaceWidget).filter(models.InterfaceWidget.id == widget_id).first()
    if not widget:
        raise HTTPException(status_code=404, detail="组件不存在")

    db.delete(widget)
    db.commit()
    return {"message": "删除成功"}


@router.post("/pages/{page_id}/widgets/reorder")
def reorder_widgets(page_id: str, request: schemas.WidgetReorderRequest, db: Session = Depends(get_db)):
    """重新排序组件"""
    for index, widget_id in enumerate(request.widgetIds):
        widget = db.query(models.InterfaceWidget).filter(
            models.InterfaceWidget.id == widget_id,
            models.InterfaceWidget.pageId == page_id
        ).first()
        if widget:
            widget.sortOrder = index
            widget.updatedAt = datetime.utcnow().isoformat()

    db.commit()
    return {"message": "排序更新成功"}


# ==================== 模板管理 ====================

@router.get("/templates", response_model=List[schemas.InterfaceTemplate])
def list_templates(
    category: Optional[str] = None,
    industry: Optional[str] = None,
    page_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """获取模板列表"""
    query = db.query(models.InterfaceTemplate)
    if category:
        query = query.filter(models.InterfaceTemplate.category == category)
    if industry:
        query = query.filter(models.InterfaceTemplate.industry == industry)
    if page_type:
        query = query.filter(models.InterfaceTemplate.pageType == page_type)

    templates = query.order_by(models.InterfaceTemplate.useCount.desc()).all()

    result = []
    for template in templates:
        result.append({
            "id": template.id,
            "name": template.name,
            "description": template.description,
            "thumbnail": template.thumbnail,
            "category": template.category,
            "industry": template.industry,
            "pageType": template.pageType,
            "config": json.loads(template.config) if template.config else {},
            "isSystem": template.isSystem,
            "useCount": template.useCount,
            "createdAt": template.createdAt
        })
    return result


@router.post("/templates", response_model=schemas.InterfaceTemplate)
def create_template(template_data: schemas.InterfaceTemplateCreate, db: Session = Depends(get_db)):
    """保存为模板"""
    template = models.InterfaceTemplate(
        id=str(uuid.uuid4()),
        name=template_data.name,
        description=template_data.description,
        thumbnail=template_data.thumbnail,
        category=template_data.category,
        industry=template_data.industry,
        pageType=template_data.pageType,
        config=json.dumps(template_data.config),
        isSystem=False,
        useCount=0,
        createdAt=datetime.utcnow().isoformat()
    )
    db.add(template)
    db.commit()
    db.refresh(template)

    return {
        "id": template.id,
        "name": template.name,
        "description": template.description,
        "thumbnail": template.thumbnail,
        "category": template.category,
        "industry": template.industry,
        "pageType": template.pageType,
        "config": json.loads(template.config),
        "isSystem": template.isSystem,
        "useCount": template.useCount,
        "createdAt": template.createdAt
    }


@router.post("/pages/{page_id}/apply-template/{template_id}")
def apply_template(page_id: str, template_id: str, db: Session = Depends(get_db)):
    """应用模板到页面"""
    page = db.query(models.InterfacePage).filter(models.InterfacePage.id == page_id).first()
    if not page:
        raise HTTPException(status_code=404, detail="页面不存在")

    template = db.query(models.InterfaceTemplate).filter(models.InterfaceTemplate.id == template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="模板不存在")

    config = json.loads(template.config)

    # 删除现有组件
    db.query(models.InterfaceWidget).filter(models.InterfaceWidget.pageId == page_id).delete()

    # 应用模板配置
    if 'backgroundColor' in config:
        page.backgroundColor = config['backgroundColor']
    if 'backgroundImage' in config:
        page.backgroundImage = config['backgroundImage']

    # 添加模板中的组件
    for index, widget_data in enumerate(config.get('widgets', [])):
        widget = models.InterfaceWidget(
            id=str(uuid.uuid4()),
            pageId=page_id,
            widgetType=widget_data.get('widgetType', 'unknown'),
            name=widget_data.get('name'),
            props=json.dumps(widget_data.get('props', {})),
            style=json.dumps(widget_data.get('style')) if widget_data.get('style') else None,
            sortOrder=index,
            isVisible=widget_data.get('isVisible', True),
            createdAt=datetime.utcnow().isoformat()
        )
        db.add(widget)

    # 更新模板使用次数
    template.useCount += 1

    page.updatedAt = datetime.utcnow().isoformat()
    db.commit()

    return {"message": "模板应用成功"}


@router.delete("/templates/{template_id}")
def delete_template(template_id: str, db: Session = Depends(get_db)):
    """删除模板"""
    template = db.query(models.InterfaceTemplate).filter(models.InterfaceTemplate.id == template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="模板不存在")

    if template.isSystem:
        raise HTTPException(status_code=400, detail="系统模板不能删除")

    db.delete(template)
    db.commit()
    return {"message": "删除成功"}


# ==================== 主题管理 ====================

@router.get("/themes", response_model=List[schemas.InterfaceTheme])
def list_themes(db: Session = Depends(get_db)):
    """获取所有主题"""
    themes = db.query(models.InterfaceTheme).all()
    return themes


@router.get("/themes/active", response_model=schemas.InterfaceTheme)
def get_active_theme(db: Session = Depends(get_db)):
    """获取当前激活的主题"""
    theme = db.query(models.InterfaceTheme).filter(models.InterfaceTheme.isActive == True).first()
    if not theme:
        # 返回默认主题
        return {
            "id": "default",
            "name": "默认主题",
            "description": "系统默认主题",
            "primaryColor": "#10b981",
            "secondaryColor": "#3b82f6",
            "accentColor": "#f59e0b",
            "textColor": "#1e293b",
            "backgroundColor": "#ffffff",
            "borderRadius": "8px",
            "fontFamily": "system-ui",
            "customCss": None,
            "isActive": True,
            "isSystem": True,
            "createdAt": None
        }
    return theme


@router.post("/themes", response_model=schemas.InterfaceTheme)
def create_theme(theme_data: schemas.InterfaceThemeCreate, db: Session = Depends(get_db)):
    """创建主题"""
    theme = models.InterfaceTheme(
        id=str(uuid.uuid4()),
        name=theme_data.name,
        description=theme_data.description,
        primaryColor=theme_data.primaryColor,
        secondaryColor=theme_data.secondaryColor,
        accentColor=theme_data.accentColor,
        textColor=theme_data.textColor,
        backgroundColor=theme_data.backgroundColor,
        borderRadius=theme_data.borderRadius,
        fontFamily=theme_data.fontFamily,
        customCss=theme_data.customCss,
        isActive=False,
        isSystem=False,
        createdAt=datetime.utcnow().isoformat()
    )
    db.add(theme)
    db.commit()
    db.refresh(theme)
    return theme


@router.put("/themes/{theme_id}", response_model=schemas.InterfaceTheme)
def update_theme(theme_id: str, theme_data: schemas.InterfaceThemeUpdate, db: Session = Depends(get_db)):
    """更新主题"""
    theme = db.query(models.InterfaceTheme).filter(models.InterfaceTheme.id == theme_id).first()
    if not theme:
        raise HTTPException(status_code=404, detail="主题不存在")

    update_data = theme_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(theme, key, value)

    theme.updatedAt = datetime.utcnow().isoformat()
    db.commit()
    db.refresh(theme)
    return theme


@router.post("/themes/{theme_id}/activate")
def activate_theme(theme_id: str, db: Session = Depends(get_db)):
    """激活主题"""
    # 先取消所有主题的激活状态
    db.query(models.InterfaceTheme).update({models.InterfaceTheme.isActive: False})

    theme = db.query(models.InterfaceTheme).filter(models.InterfaceTheme.id == theme_id).first()
    if not theme:
        raise HTTPException(status_code=404, detail="主题不存在")

    theme.isActive = True
    theme.updatedAt = datetime.utcnow().isoformat()
    db.commit()

    return {"message": "主题已激活"}


@router.delete("/themes/{theme_id}")
def delete_theme(theme_id: str, db: Session = Depends(get_db)):
    """删除主题"""
    theme = db.query(models.InterfaceTheme).filter(models.InterfaceTheme.id == theme_id).first()
    if not theme:
        raise HTTPException(status_code=404, detail="主题不存在")

    if theme.isSystem:
        raise HTTPException(status_code=400, detail="系统主题不能删除")

    db.delete(theme)
    db.commit()
    return {"message": "删除成功"}


# ==================== 历史版本管理 ====================

@router.get("/pages/{page_id}/history", response_model=List[schemas.InterfaceHistory])
def get_page_history(page_id: str, db: Session = Depends(get_db)):
    """获取页面历史版本"""
    histories = db.query(models.InterfaceHistory).filter(
        models.InterfaceHistory.pageId == page_id
    ).order_by(models.InterfaceHistory.version.desc()).limit(50).all()

    result = []
    for history in histories:
        result.append({
            "id": history.id,
            "pageId": history.pageId,
            "version": history.version,
            "config": json.loads(history.config) if history.config else {},
            "operationType": history.operationType,
            "operatorId": history.operatorId,
            "operatorName": history.operatorName,
            "description": history.description,
            "createdAt": history.createdAt
        })
    return result


@router.post("/pages/{page_id}/restore/{history_id}")
def restore_page_version(page_id: str, history_id: str, db: Session = Depends(get_db)):
    """恢复到历史版本"""
    page = db.query(models.InterfacePage).filter(models.InterfacePage.id == page_id).first()
    if not page:
        raise HTTPException(status_code=404, detail="页面不存在")

    history = db.query(models.InterfaceHistory).filter(
        models.InterfaceHistory.id == history_id,
        models.InterfaceHistory.pageId == page_id
    ).first()
    if not history:
        raise HTTPException(status_code=404, detail="历史版本不存在")

    config = json.loads(history.config)

    # 保存当前状态到历史
    current_widgets = []
    for widget in page.widgets:
        current_widgets.append({
            "widgetType": widget.widgetType,
            "name": widget.name,
            "props": json.loads(widget.props) if widget.props else {},
            "style": json.loads(widget.style) if widget.style else None,
            "sortOrder": widget.sortOrder,
            "isVisible": widget.isVisible
        })

    new_history = models.InterfaceHistory(
        id=str(uuid.uuid4()),
        pageId=page_id,
        version=page.version,
        config=json.dumps({
            "backgroundColor": page.backgroundColor,
            "backgroundImage": page.backgroundImage,
            "widgets": current_widgets
        }),
        operationType='restore',
        description=f'恢复前的版本 {page.version}',
        createdAt=datetime.utcnow().isoformat()
    )
    db.add(new_history)

    # 删除现有组件
    db.query(models.InterfaceWidget).filter(models.InterfaceWidget.pageId == page_id).delete()

    # 恢复配置
    if 'backgroundColor' in config:
        page.backgroundColor = config['backgroundColor']
    if 'backgroundImage' in config:
        page.backgroundImage = config['backgroundImage']

    # 恢复组件
    for index, widget_data in enumerate(config.get('widgets', [])):
        widget = models.InterfaceWidget(
            id=str(uuid.uuid4()),
            pageId=page_id,
            widgetType=widget_data.get('widgetType', 'unknown'),
            name=widget_data.get('name'),
            props=json.dumps(widget_data.get('props', {})),
            style=json.dumps(widget_data.get('style')) if widget_data.get('style') else None,
            sortOrder=index,
            isVisible=widget_data.get('isVisible', True),
            createdAt=datetime.utcnow().isoformat()
        )
        db.add(widget)

    page.version += 1
    page.updatedAt = datetime.utcnow().isoformat()
    db.commit()

    return {"message": f"已恢复到版本 {history.version}"}


# ==================== 导航栏管理 ====================

@router.get("/navbar", response_model=schemas.InterfaceNavBar)
def get_navbar(db: Session = Depends(get_db)):
    """获取导航栏配置"""
    navbar = db.query(models.InterfaceNavBar).filter(models.InterfaceNavBar.isActive == True).first()
    if not navbar:
        # 返回默认导航栏
        return {
            "id": "default",
            "name": "默认导航栏",
            "backgroundColor": "#ffffff",
            "activeColor": "#10b981",
            "inactiveColor": "#94a3b8",
            "items": [
                {"icon": "Home", "label": "首页", "path": "/"},
                {"icon": "Grid", "label": "分类", "path": "/category"},
                {"icon": "ShoppingCart", "label": "购物车", "path": "/cart", "badge": True},
                {"icon": "User", "label": "我的", "path": "/user"}
            ],
            "isActive": True,
            "createdAt": None
        }

    return {
        "id": navbar.id,
        "name": navbar.name,
        "backgroundColor": navbar.backgroundColor,
        "activeColor": navbar.activeColor,
        "inactiveColor": navbar.inactiveColor,
        "items": json.loads(navbar.items) if navbar.items else [],
        "isActive": navbar.isActive,
        "createdAt": navbar.createdAt
    }


@router.put("/navbar", response_model=schemas.InterfaceNavBar)
def update_navbar(navbar_data: schemas.InterfaceNavBarUpdate, db: Session = Depends(get_db)):
    """更新导航栏配置"""
    navbar = db.query(models.InterfaceNavBar).filter(models.InterfaceNavBar.isActive == True).first()

    if not navbar:
        # 创建新的导航栏
        navbar = models.InterfaceNavBar(
            id=str(uuid.uuid4()),
            name=navbar_data.name or '默认导航栏',
            backgroundColor=navbar_data.backgroundColor or '#ffffff',
            activeColor=navbar_data.activeColor or '#10b981',
            inactiveColor=navbar_data.inactiveColor or '#94a3b8',
            items=json.dumps(navbar_data.items or []),
            isActive=True,
            createdAt=datetime.utcnow().isoformat()
        )
        db.add(navbar)
    else:
        if navbar_data.name is not None:
            navbar.name = navbar_data.name
        if navbar_data.backgroundColor is not None:
            navbar.backgroundColor = navbar_data.backgroundColor
        if navbar_data.activeColor is not None:
            navbar.activeColor = navbar_data.activeColor
        if navbar_data.inactiveColor is not None:
            navbar.inactiveColor = navbar_data.inactiveColor
        if navbar_data.items is not None:
            navbar.items = json.dumps(navbar_data.items)
        navbar.updatedAt = datetime.utcnow().isoformat()

    db.commit()
    db.refresh(navbar)

    return {
        "id": navbar.id,
        "name": navbar.name,
        "backgroundColor": navbar.backgroundColor,
        "activeColor": navbar.activeColor,
        "inactiveColor": navbar.inactiveColor,
        "items": json.loads(navbar.items) if navbar.items else [],
        "isActive": navbar.isActive,
        "createdAt": navbar.createdAt
    }


# ==================== 弹窗管理 ====================

@router.get("/popups", response_model=List[schemas.InterfacePopup])
def list_popups(db: Session = Depends(get_db)):
    """获取所有弹窗配置"""
    popups = db.query(models.InterfacePopup).all()
    return popups


@router.post("/popups", response_model=schemas.InterfacePopup)
def create_popup(popup_data: schemas.InterfacePopupCreate, db: Session = Depends(get_db)):
    """创建弹窗"""
    popup = models.InterfacePopup(
        id=str(uuid.uuid4()),
        name=popup_data.name,
        popupType=popup_data.popupType,
        title=popup_data.title,
        content=popup_data.content,
        imageUrl=popup_data.imageUrl,
        linkUrl=popup_data.linkUrl,
        linkType=popup_data.linkType,
        position=popup_data.position,
        showOnce=popup_data.showOnce,
        startTime=popup_data.startTime,
        endTime=popup_data.endTime,
        isActive=True,
        triggerType=popup_data.triggerType,
        triggerValue=popup_data.triggerValue,
        createdAt=datetime.utcnow().isoformat()
    )
    db.add(popup)
    db.commit()
    db.refresh(popup)
    return popup


@router.put("/popups/{popup_id}", response_model=schemas.InterfacePopup)
def update_popup(popup_id: str, popup_data: schemas.InterfacePopupUpdate, db: Session = Depends(get_db)):
    """更新弹窗"""
    popup = db.query(models.InterfacePopup).filter(models.InterfacePopup.id == popup_id).first()
    if not popup:
        raise HTTPException(status_code=404, detail="弹窗不存在")

    update_data = popup_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(popup, key, value)

    popup.updatedAt = datetime.utcnow().isoformat()
    db.commit()
    db.refresh(popup)
    return popup


@router.delete("/popups/{popup_id}")
def delete_popup(popup_id: str, db: Session = Depends(get_db)):
    """删除弹窗"""
    popup = db.query(models.InterfacePopup).filter(models.InterfacePopup.id == popup_id).first()
    if not popup:
        raise HTTPException(status_code=404, detail="弹窗不存在")

    db.delete(popup)
    db.commit()
    return {"message": "删除成功"}
