"""
应用中心 API 路由
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app import crud, schemas
from backend.app.database import SessionLocal

router = APIRouter(prefix="/api/apps", tags=["apps"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ==================== 应用管理 ====================

@router.get("/", response_model=List[schemas.App])
def list_apps(db: Session = Depends(get_db)):
    """获取所有可用应用"""
    return crud.list_apps(db)


@router.get("/installed", response_model=List[schemas.AppInstallationWithApp])
def list_installed_apps(db: Session = Depends(get_db)):
    """获取已安装的应用"""
    installations = crud.list_app_installations(db)
    result = []
    for inst in installations:
        app = crud.get_app(db, inst.appId)
        result.append({
            "id": inst.id,
            "appId": inst.appId,
            "status": inst.status,
            "config": inst.config,
            "createdAt": inst.createdAt,
            "updatedAt": inst.updatedAt,
            "app": app
        })
    return result


@router.get("/{app_id}", response_model=schemas.App)
def get_app(app_id: str, db: Session = Depends(get_db)):
    """获取应用详情"""
    app = crud.get_app(db, app_id)
    if not app:
        raise HTTPException(status_code=404, detail="应用不存在")
    return app


@router.post("/install", response_model=schemas.AppInstallation)
def install_app(payload: schemas.AppInstallRequest, db: Session = Depends(get_db)):
    """安装应用"""
    # 检查应用是否存在
    app = crud.get_app(db, payload.appId)
    if not app:
        raise HTTPException(status_code=404, detail="应用不存在")

    # 检查是否已安装
    existing = crud.get_app_installation_by_app_id(db, payload.appId)
    if existing:
        raise HTTPException(status_code=400, detail="应用已安装")

    return crud.install_app(db, payload.appId, payload.config)


@router.delete("/{installation_id}")
def uninstall_app(installation_id: str, db: Session = Depends(get_db)):
    """卸载应用"""
    success = crud.uninstall_app(db, installation_id)
    if not success:
        raise HTTPException(status_code=404, detail="安装记录不存在")
    return {"ok": True}


@router.put("/{installation_id}/config", response_model=schemas.AppInstallation)
def update_app_config(installation_id: str, payload: schemas.AppConfigUpdate, db: Session = Depends(get_db)):
    """更新应用配置"""
    result = crud.update_app_config(db, installation_id, payload.config)
    if not result:
        raise HTTPException(status_code=404, detail="安装记录不存在")
    return result


@router.put("/{installation_id}/toggle", response_model=schemas.AppInstallation)
def toggle_app_status(installation_id: str, payload: schemas.AppToggleRequest, db: Session = Depends(get_db)):
    """启用/禁用应用"""
    if payload.status not in ['active', 'disabled']:
        raise HTTPException(status_code=400, detail="无效的状态值")
    result = crud.toggle_app_status(db, installation_id, payload.status)
    if not result:
        raise HTTPException(status_code=404, detail="安装记录不存在")
    return result


# ==================== 存酒管理 ====================

@router.get("/wine-storage/list", response_model=List[schemas.WineStorage])
def list_wine_storage(status: Optional[str] = None, db: Session = Depends(get_db)):
    """获取存酒记录列表"""
    return crud.list_wine_storage(db, status)


@router.get("/wine-storage/{wine_id}", response_model=schemas.WineStorage)
def get_wine_storage(wine_id: str, db: Session = Depends(get_db)):
    """获取存酒记录详情"""
    wine = crud.get_wine_storage(db, wine_id)
    if not wine:
        raise HTTPException(status_code=404, detail="存酒记录不存在")
    return wine


@router.post("/wine-storage", response_model=schemas.WineStorage)
def create_wine_storage(payload: schemas.WineStorageCreate, db: Session = Depends(get_db)):
    """创建存酒记录"""
    return crud.create_wine_storage(db, payload.model_dump())


@router.post("/wine-storage/{wine_id}/retrieve", response_model=schemas.WineStorage)
def retrieve_wine(wine_id: str, payload: schemas.WineStorageRetrieve, db: Session = Depends(get_db)):
    """取酒"""
    result = crud.retrieve_wine(db, wine_id, payload.quantity, payload.notes)
    if not result:
        raise HTTPException(status_code=400, detail="无法取酒，请检查存酒状态")
    return result


# ==================== 评价管理 ====================

@router.get("/reviews/list", response_model=List[schemas.Review])
def list_reviews(status: Optional[str] = None, db: Session = Depends(get_db)):
    """获取评价列表"""
    return crud.list_reviews(db, status)


@router.get("/reviews/{review_id}", response_model=schemas.Review)
def get_review(review_id: str, db: Session = Depends(get_db)):
    """获取评价详情"""
    review = crud.get_review(db, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="评价不存在")
    return review


@router.post("/reviews", response_model=schemas.Review)
def create_review(payload: schemas.ReviewCreate, db: Session = Depends(get_db)):
    """创建评价"""
    return crud.create_review(db, payload.model_dump())


@router.post("/reviews/{review_id}/reply", response_model=schemas.Review)
def reply_review(review_id: str, payload: schemas.ReviewReply, db: Session = Depends(get_db)):
    """回复评价"""
    result = crud.reply_review(db, review_id, payload.reply)
    if not result:
        raise HTTPException(status_code=404, detail="评价不存在")
    return result


@router.put("/reviews/{review_id}/visibility")
def toggle_review_visibility(review_id: str, status: str, db: Session = Depends(get_db)):
    """切换评价可见性"""
    if status not in ['visible', 'hidden']:
        raise HTTPException(status_code=400, detail="无效的状态值")
    result = crud.toggle_review_visibility(db, review_id, status)
    if not result:
        raise HTTPException(status_code=404, detail="评价不存在")
    return {"ok": True}


# ==================== 排队管理 ====================

@router.get("/queue/list", response_model=List[schemas.QueueTicket])
def list_queue_tickets(status: Optional[str] = None, db: Session = Depends(get_db)):
    """获取排队列表"""
    return crud.list_queue_tickets(db, status)


@router.get("/queue/{ticket_id}", response_model=schemas.QueueTicket)
def get_queue_ticket(ticket_id: str, db: Session = Depends(get_db)):
    """获取排队详情"""
    ticket = crud.get_queue_ticket(db, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="排队记录不存在")
    return ticket


@router.post("/queue", response_model=schemas.QueueTicket)
def create_queue_ticket(payload: schemas.QueueTicketCreate, db: Session = Depends(get_db)):
    """取号"""
    return crud.create_queue_ticket(db, payload.model_dump())


@router.post("/queue/{ticket_id}/call", response_model=schemas.QueueTicket)
def call_queue_ticket(ticket_id: str, db: Session = Depends(get_db)):
    """叫号"""
    result = crud.call_queue_ticket(db, ticket_id)
    if not result:
        raise HTTPException(status_code=400, detail="无法叫号，请检查排队状态")
    return result


@router.post("/queue/{ticket_id}/seat")
def seat_queue_ticket(ticket_id: str, table_id: str, db: Session = Depends(get_db)):
    """入座"""
    result = crud.seat_queue_ticket(db, ticket_id, table_id)
    if not result:
        raise HTTPException(status_code=400, detail="无法入座，请检查排队状态")
    return {"ok": True}


@router.post("/queue/{ticket_id}/cancel")
def cancel_queue_ticket(ticket_id: str, db: Session = Depends(get_db)):
    """取消排队"""
    result = crud.cancel_queue_ticket(db, ticket_id)
    if not result:
        raise HTTPException(status_code=400, detail="无法取消，请检查排队状态")
    return {"ok": True}


# ==================== 发票管理 ====================

@router.get("/invoices/list", response_model=List[schemas.Invoice])
def list_invoices(status: Optional[str] = None, db: Session = Depends(get_db)):
    """获取发票列表"""
    return crud.list_invoices(db, status)


@router.get("/invoices/{invoice_id}", response_model=schemas.Invoice)
def get_invoice(invoice_id: str, db: Session = Depends(get_db)):
    """获取发票详情"""
    invoice = crud.get_invoice(db, invoice_id)
    if not invoice:
        raise HTTPException(status_code=404, detail="发票不存在")
    return invoice


@router.post("/invoices", response_model=schemas.Invoice)
def create_invoice(payload: schemas.InvoiceCreate, db: Session = Depends(get_db)):
    """申请发票"""
    return crud.create_invoice(db, payload.model_dump())


@router.post("/invoices/{invoice_id}/issue", response_model=schemas.Invoice)
def issue_invoice(invoice_id: str, payload: schemas.InvoiceIssue, db: Session = Depends(get_db)):
    """开具发票"""
    result = crud.issue_invoice(db, invoice_id, payload.invoiceNo, payload.invoiceUrl)
    if not result:
        raise HTTPException(status_code=400, detail="无法开具发票，请检查状态")
    return result


@router.post("/invoices/{invoice_id}/reject", response_model=schemas.Invoice)
def reject_invoice(invoice_id: str, payload: schemas.InvoiceReject, db: Session = Depends(get_db)):
    """拒绝发票申请"""
    result = crud.reject_invoice(db, invoice_id, payload.reason)
    if not result:
        raise HTTPException(status_code=400, detail="无法拒绝，请检查状态")
    return result


# ==================== WiFi配置 ====================

@router.get("/wifi/list", response_model=List[schemas.StoreWifiConfig])
def list_wifi_configs(db: Session = Depends(get_db)):
    """获取WiFi配置列表"""
    return crud.list_wifi_configs(db)


@router.post("/wifi", response_model=schemas.StoreWifiConfig)
def create_wifi_config(payload: schemas.StoreWifiConfigCreate, db: Session = Depends(get_db)):
    """创建WiFi配置"""
    return crud.create_wifi_config(db, payload.model_dump())


@router.put("/wifi/{wifi_id}", response_model=schemas.StoreWifiConfig)
def update_wifi_config(wifi_id: str, payload: schemas.StoreWifiConfigCreate, db: Session = Depends(get_db)):
    """更新WiFi配置"""
    result = crud.update_wifi_config(db, wifi_id, payload.model_dump())
    if not result:
        raise HTTPException(status_code=404, detail="WiFi配置不存在")
    return result


@router.delete("/wifi/{wifi_id}")
def delete_wifi_config(wifi_id: str, db: Session = Depends(get_db)):
    """删除WiFi配置"""
    success = crud.delete_wifi_config(db, wifi_id)
    if not success:
        raise HTTPException(status_code=404, detail="WiFi配置不存在")
    return {"ok": True}


# ==================== 表单工具 ====================

@router.get("/forms/templates", response_model=List[schemas.FormTemplate])
def list_form_templates(db: Session = Depends(get_db)):
    """获取表单模板列表"""
    return crud.list_form_templates(db)


@router.get("/forms/templates/{template_id}", response_model=schemas.FormTemplate)
def get_form_template(template_id: str, db: Session = Depends(get_db)):
    """获取表单模板详情"""
    template = crud.get_form_template(db, template_id)
    if not template:
        raise HTTPException(status_code=404, detail="表单模板不存在")
    return template


@router.post("/forms/templates", response_model=schemas.FormTemplate)
def create_form_template(payload: schemas.FormTemplateCreate, db: Session = Depends(get_db)):
    """创建表单模板"""
    return crud.create_form_template(db, payload.model_dump())


@router.put("/forms/templates/{template_id}", response_model=schemas.FormTemplate)
def update_form_template(template_id: str, payload: schemas.FormTemplateCreate, db: Session = Depends(get_db)):
    """更新表单模板"""
    result = crud.update_form_template(db, template_id, payload.model_dump())
    if not result:
        raise HTTPException(status_code=404, detail="表单模板不存在")
    return result


@router.delete("/forms/templates/{template_id}")
def delete_form_template(template_id: str, db: Session = Depends(get_db)):
    """删除表单模板"""
    success = crud.delete_form_template(db, template_id)
    if not success:
        raise HTTPException(status_code=404, detail="表单模板不存在")
    return {"ok": True}


@router.get("/forms/templates/{template_id}/submissions", response_model=List[schemas.FormSubmission])
def list_form_submissions(template_id: str, db: Session = Depends(get_db)):
    """获取表单提交列表"""
    return crud.list_form_submissions(db, template_id)


@router.post("/forms/submit", response_model=schemas.FormSubmission)
def submit_form(payload: schemas.FormSubmissionCreate, db: Session = Depends(get_db)):
    """提交表单"""
    return crud.create_form_submission(db, payload.model_dump())
