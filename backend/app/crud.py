from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from app import models

def list_categories(db: Session) -> List[models.Category]:
    return db.execute(select(models.Category)).scalars().all()

def create_category(db: Session, name: str, icon: Optional[str] = None) -> models.Category:
    obj = models.Category(name=name, icon=icon)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def list_suppliers(db: Session) -> List[models.Supplier]:
    return db.execute(select(models.Supplier)).scalars().all()

def create_supplier(db: Session, name: str, contactName: str, phone: str, email: Optional[str]) -> models.Supplier:
    obj = models.Supplier(name=name, contactName=contactName, phone=phone, email=email)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def list_products(db: Session) -> List[models.Product]:
    return db.execute(select(models.Product)).scalars().all()

def get_product(db: Session, pid: str) -> Optional[models.Product]:
    return db.get(models.Product, pid)

def create_product(db: Session, data: dict) -> models.Product:
    sales = ",".join(data["salesMode"]) if data.get("salesMode") else None
    obj = models.Product(
        name=data["name"], price=data["price"], categoryId=data["categoryId"], image=data.get("image"),
        stock=data["stock"], minStock=data.get("minStock"), unit=data["unit"], salesMode=sales,
        isOnShelf=1 if data.get("isOnShelf", True) else 0, costPrice=data.get("costPrice"), supplierId=data.get("supplierId")
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def update_product(db: Session, pid: str, data: dict) -> Optional[models.Product]:
    obj = db.get(models.Product, pid)
    if not obj:
        return None
    for k, v in data.items():
        if k == "salesMode":
            setattr(obj, k, ",".join(v) if v else None)
        elif k == "isOnShelf":
            setattr(obj, k, 1 if v else 0)
        else:
            setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj

def delete_product(db: Session, pid: str) -> bool:
    obj = db.get(models.Product, pid)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True

def list_tables(db: Session) -> List[models.Table]:
    return db.execute(select(models.Table)).scalars().all()

def create_table(db: Session, data: dict) -> models.Table:
    obj = models.Table(name=data["name"], status=data["status"], capacity=data["capacity"], area=data.get("area"))
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def update_table(db: Session, tid: str, data: dict) -> Optional[models.Table]:
    obj = db.get(models.Table, tid)
    if not obj:
        return None
    for k, v in data.items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj

def list_users(db: Session) -> List[models.User]:
    return db.execute(select(models.User)).scalars().all()

def create_user(db: Session, data: dict) -> models.User:
    obj = models.User(name=data["name"], phone=data["phone"], type=data["type"], balance=data.get("balance", 0.0), points=data.get("points", 0), level=data.get("level", 0), joinDate=data["joinDate"])
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def list_orders(db: Session, status: Optional[str] = None) -> List[models.Order]:
    stmt = select(models.Order)
    if status:
        stmt = stmt.where(models.Order.status == status)
    return db.execute(stmt).scalars().all()

def create_order(db: Session, data: dict) -> models.Order:
    order = models.Order(orderNo=data["orderNo"], tableId=data["tableId"], total=0.0, totalCost=None, status=data["status"], paymentMethod=data.get("paymentMethod"), timestamp=data["timestamp"], type=data["type"]) 
    db.add(order)
    db.flush()
    total = 0.0
    total_cost = 0.0
    for item in data["items"]:
        oi = models.OrderItem(orderId=order.id, productId=item["productId"], name=item["name"], price=item["price"], costPrice=item.get("costPrice"), image=item.get("image"), unit=item["unit"], quantity=item["quantity"]) 
        total += item["price"] * item["quantity"]
        if item.get("costPrice") is not None:
            total_cost += item["costPrice"] * item["quantity"]
        db.add(oi)
    order.total = total
    order.totalCost = total_cost if total_cost > 0 else None
    db.commit()
    db.refresh(order)
    return order

def add_reservation(db: Session, data: dict) -> models.Reservation:
    obj = models.Reservation(tableId=data["tableId"], customerName=data["customerName"], customerPhone=data["customerPhone"], reservationTime=data["reservationTime"], guests=data["guests"], status=data["status"], notes=data.get("notes"))
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def list_reservations(db: Session) -> List[models.Reservation]:
    return db.execute(select(models.Reservation)).scalars().all()

def create_stock_log(db: Session, data: dict) -> models.StockLog:
    obj = models.StockLog(productId=data["productId"], productName=data["productName"], type=data["type"], delta=data["delta"], currentStock=data["currentStock"], operator=data["operator"], timestamp=data["timestamp"], note=data.get("note"))
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def list_stock_logs(db: Session) -> List[models.StockLog]:
    return db.execute(select(models.StockLog)).scalars().all()

def sales_summary_daily(db: Session, start_ts: int, end_ts: int):
    rows = db.execute(select(func.strftime('%Y-%m-%d', (models.Order.timestamp), 'unixepoch'), func.count(models.Order.id), func.sum(models.Order.total)).where(models.Order.timestamp >= start_ts).where(models.Order.timestamp <= end_ts).group_by(func.strftime('%Y-%m-%d', (models.Order.timestamp), 'unixepoch'))).all()
    return [{"date": r[0], "orders": int(r[1] or 0), "gross": float(r[2] or 0.0)} for r in rows]


# ==================== 应用中心 CRUD ====================

def list_apps(db: Session) -> List[models.App]:
    return db.execute(select(models.App).where(models.App.isActive == True)).scalars().all()


def get_app(db: Session, app_id: str) -> Optional[models.App]:
    return db.get(models.App, app_id)


def create_app(db: Session, data: dict) -> models.App:
    obj = models.App(
        id=data["id"],
        name=data["name"],
        description=data.get("description"),
        icon=data.get("icon"),
        category=data["category"],
        version=data.get("version", "1.0.0"),
        isActive=data.get("isActive", True),
        configSchema=data.get("configSchema"),
        route=data.get("route")
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def list_app_installations(db: Session) -> List[models.AppInstallation]:
    return db.execute(select(models.AppInstallation)).scalars().all()


def get_app_installation(db: Session, installation_id: str) -> Optional[models.AppInstallation]:
    return db.get(models.AppInstallation, installation_id)


def get_app_installation_by_app_id(db: Session, app_id: str) -> Optional[models.AppInstallation]:
    return db.execute(select(models.AppInstallation).where(models.AppInstallation.appId == app_id)).scalars().first()


def install_app(db: Session, app_id: str, config: Optional[dict] = None) -> models.AppInstallation:
    import json
    obj = models.AppInstallation(
        appId=app_id,
        status='active',
        config=json.dumps(config) if config else None
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def uninstall_app(db: Session, installation_id: str) -> bool:
    obj = db.get(models.AppInstallation, installation_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True


def update_app_config(db: Session, installation_id: str, config: dict) -> Optional[models.AppInstallation]:
    import json
    obj = db.get(models.AppInstallation, installation_id)
    if not obj:
        return None
    obj.config = json.dumps(config)
    db.commit()
    db.refresh(obj)
    return obj


def toggle_app_status(db: Session, installation_id: str, status: str) -> Optional[models.AppInstallation]:
    obj = db.get(models.AppInstallation, installation_id)
    if not obj:
        return None
    obj.status = status
    db.commit()
    db.refresh(obj)
    return obj


# ==================== 第三方集成 CRUD ====================

def list_integrations(db: Session) -> List[models.ThirdPartyIntegration]:
    return db.execute(select(models.ThirdPartyIntegration)).scalars().all()


def get_integration(db: Session, integration_id: str) -> Optional[models.ThirdPartyIntegration]:
    return db.get(models.ThirdPartyIntegration, integration_id)


def get_integration_by_platform(db: Session, platform: str) -> Optional[models.ThirdPartyIntegration]:
    return db.execute(select(models.ThirdPartyIntegration).where(models.ThirdPartyIntegration.platform == platform)).scalars().first()


def create_integration(db: Session, data: dict) -> models.ThirdPartyIntegration:
    obj = models.ThirdPartyIntegration(
        platform=data["platform"],
        appKey=data.get("appKey"),
        appSecret=data.get("appSecret"),
        shopId=data.get("shopId"),
        status='disconnected'
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_integration(db: Session, integration_id: str, data: dict) -> Optional[models.ThirdPartyIntegration]:
    obj = db.get(models.ThirdPartyIntegration, integration_id)
    if not obj:
        return None
    for k, v in data.items():
        if v is not None:
            setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj


def delete_integration(db: Session, integration_id: str) -> bool:
    obj = db.get(models.ThirdPartyIntegration, integration_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True


# ==================== 存酒管理 CRUD ====================

def list_wine_storage(db: Session, status: Optional[str] = None) -> List[models.WineStorage]:
    stmt = select(models.WineStorage)
    if status:
        stmt = stmt.where(models.WineStorage.status == status)
    return db.execute(stmt.order_by(models.WineStorage.createdAt.desc())).scalars().all()


def get_wine_storage(db: Session, wine_id: str) -> Optional[models.WineStorage]:
    return db.get(models.WineStorage, wine_id)


def create_wine_storage(db: Session, data: dict) -> models.WineStorage:
    obj = models.WineStorage(
        customerId=data["customerId"],
        customerName=data["customerName"],
        customerPhone=data["customerPhone"],
        wineName=data["wineName"],
        wineType=data.get("wineType"),
        quantity=data["quantity"],
        unit=data.get("unit", "瓶"),
        storageDate=data["storageDate"],
        expiryDate=data.get("expiryDate"),
        notes=data.get("notes"),
        status='stored'
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def retrieve_wine(db: Session, wine_id: str, quantity: float, notes: Optional[str] = None) -> Optional[models.WineStorage]:
    from datetime import datetime
    obj = db.get(models.WineStorage, wine_id)
    if not obj or obj.status != 'stored':
        return None
    obj.retrievedQuantity = (obj.retrievedQuantity or 0) + quantity
    obj.retrievedAt = datetime.utcnow().isoformat()
    if obj.retrievedQuantity >= obj.quantity:
        obj.status = 'retrieved'
    if notes:
        obj.notes = (obj.notes or '') + f'\n取酒备注: {notes}'
    db.commit()
    db.refresh(obj)
    return obj


# ==================== 评价管理 CRUD ====================

def list_reviews(db: Session, status: Optional[str] = None) -> List[models.Review]:
    stmt = select(models.Review)
    if status:
        stmt = stmt.where(models.Review.status == status)
    return db.execute(stmt.order_by(models.Review.createdAt.desc())).scalars().all()


def get_review(db: Session, review_id: str) -> Optional[models.Review]:
    return db.get(models.Review, review_id)


def create_review(db: Session, data: dict) -> models.Review:
    import json
    obj = models.Review(
        orderId=data["orderId"],
        customerId=data.get("customerId"),
        customerName=data.get("customerName"),
        rating=data["rating"],
        tasteRating=data.get("tasteRating"),
        serviceRating=data.get("serviceRating"),
        environmentRating=data.get("environmentRating"),
        content=data.get("content"),
        images=json.dumps(data.get("images")) if data.get("images") else None,
        isAnonymous=data.get("isAnonymous", False),
        status='visible'
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def reply_review(db: Session, review_id: str, reply: str) -> Optional[models.Review]:
    from datetime import datetime
    obj = db.get(models.Review, review_id)
    if not obj:
        return None
    obj.reply = reply
    obj.repliedAt = datetime.utcnow().isoformat()
    db.commit()
    db.refresh(obj)
    return obj


def toggle_review_visibility(db: Session, review_id: str, status: str) -> Optional[models.Review]:
    obj = db.get(models.Review, review_id)
    if not obj:
        return None
    obj.status = status
    db.commit()
    db.refresh(obj)
    return obj


# ==================== 排队管理 CRUD ====================

def list_queue_tickets(db: Session, status: Optional[str] = None) -> List[models.QueueTicket]:
    stmt = select(models.QueueTicket)
    if status:
        stmt = stmt.where(models.QueueTicket.status == status)
    return db.execute(stmt.order_by(models.QueueTicket.createdAt.asc())).scalars().all()


def get_queue_ticket(db: Session, ticket_id: str) -> Optional[models.QueueTicket]:
    return db.get(models.QueueTicket, ticket_id)


def create_queue_ticket(db: Session, data: dict) -> models.QueueTicket:
    # 生成排队号
    prefix = {'small': 'S', 'medium': 'M', 'large': 'L'}.get(data["queueType"], 'A')
    today_count = db.execute(
        select(func.count(models.QueueTicket.id))
        .where(models.QueueTicket.queueType == data["queueType"])
        .where(models.QueueTicket.status.in_(['waiting', 'called']))
    ).scalar() or 0
    ticket_no = f"{prefix}{str(today_count + 1).zfill(3)}"

    obj = models.QueueTicket(
        ticketNo=ticket_no,
        queueType=data["queueType"],
        customerName=data.get("customerName"),
        customerPhone=data["customerPhone"],
        partySize=data["partySize"],
        status='waiting'
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def call_queue_ticket(db: Session, ticket_id: str) -> Optional[models.QueueTicket]:
    from datetime import datetime
    obj = db.get(models.QueueTicket, ticket_id)
    if not obj or obj.status != 'waiting':
        return None
    obj.status = 'called'
    obj.calledAt = datetime.utcnow().isoformat()
    db.commit()
    db.refresh(obj)
    return obj


def seat_queue_ticket(db: Session, ticket_id: str, table_id: str) -> Optional[models.QueueTicket]:
    from datetime import datetime
    obj = db.get(models.QueueTicket, ticket_id)
    if not obj or obj.status not in ['waiting', 'called']:
        return None
    obj.status = 'seated'
    obj.seatedAt = datetime.utcnow().isoformat()
    obj.tableId = table_id
    db.commit()
    db.refresh(obj)
    return obj


def cancel_queue_ticket(db: Session, ticket_id: str) -> Optional[models.QueueTicket]:
    obj = db.get(models.QueueTicket, ticket_id)
    if not obj or obj.status not in ['waiting', 'called']:
        return None
    obj.status = 'cancelled'
    db.commit()
    db.refresh(obj)
    return obj


# ==================== 发票管理 CRUD ====================

def list_invoices(db: Session, status: Optional[str] = None) -> List[models.Invoice]:
    stmt = select(models.Invoice)
    if status:
        stmt = stmt.where(models.Invoice.status == status)
    return db.execute(stmt.order_by(models.Invoice.createdAt.desc())).scalars().all()


def get_invoice(db: Session, invoice_id: str) -> Optional[models.Invoice]:
    return db.get(models.Invoice, invoice_id)


def create_invoice(db: Session, data: dict) -> models.Invoice:
    obj = models.Invoice(
        orderId=data["orderId"],
        invoiceType=data["invoiceType"],
        titleType=data["titleType"],
        title=data["title"],
        taxNumber=data.get("taxNumber"),
        companyAddress=data.get("companyAddress"),
        companyPhone=data.get("companyPhone"),
        bankName=data.get("bankName"),
        bankAccount=data.get("bankAccount"),
        amount=data["amount"],
        email=data.get("email"),
        status='pending'
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def issue_invoice(db: Session, invoice_id: str, invoice_no: str, invoice_url: Optional[str] = None) -> Optional[models.Invoice]:
    from datetime import datetime
    obj = db.get(models.Invoice, invoice_id)
    if not obj or obj.status != 'pending':
        return None
    obj.status = 'issued'
    obj.invoiceNo = invoice_no
    obj.invoiceUrl = invoice_url
    obj.issuedAt = datetime.utcnow().isoformat()
    db.commit()
    db.refresh(obj)
    return obj


def reject_invoice(db: Session, invoice_id: str, reason: str) -> Optional[models.Invoice]:
    obj = db.get(models.Invoice, invoice_id)
    if not obj or obj.status != 'pending':
        return None
    obj.status = 'rejected'
    obj.rejectedReason = reason
    db.commit()
    db.refresh(obj)
    return obj


# ==================== WiFi配置 CRUD ====================

def list_wifi_configs(db: Session) -> List[models.StoreWifiConfig]:
    return db.execute(select(models.StoreWifiConfig)).scalars().all()


def get_wifi_config(db: Session, wifi_id: str) -> Optional[models.StoreWifiConfig]:
    return db.get(models.StoreWifiConfig, wifi_id)


def create_wifi_config(db: Session, data: dict) -> models.StoreWifiConfig:
    obj = models.StoreWifiConfig(
        ssid=data["ssid"],
        password=data.get("password"),
        encryptionType=data.get("encryptionType", "WPA2"),
        isDefault=data.get("isDefault", False),
        description=data.get("description")
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_wifi_config(db: Session, wifi_id: str, data: dict) -> Optional[models.StoreWifiConfig]:
    obj = db.get(models.StoreWifiConfig, wifi_id)
    if not obj:
        return None
    for k, v in data.items():
        if v is not None:
            setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj


def delete_wifi_config(db: Session, wifi_id: str) -> bool:
    obj = db.get(models.StoreWifiConfig, wifi_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True


# ==================== 表单工具 CRUD ====================

def list_form_templates(db: Session) -> List[models.FormTemplate]:
    return db.execute(select(models.FormTemplate).where(models.FormTemplate.isDeleted == False)).scalars().all()


def get_form_template(db: Session, template_id: str) -> Optional[models.FormTemplate]:
    return db.get(models.FormTemplate, template_id)


def create_form_template(db: Session, data: dict) -> models.FormTemplate:
    import json
    obj = models.FormTemplate(
        name=data["name"],
        description=data.get("description"),
        fields=json.dumps(data["fields"]),
        status='active'
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_form_template(db: Session, template_id: str, data: dict) -> Optional[models.FormTemplate]:
    import json
    obj = db.get(models.FormTemplate, template_id)
    if not obj:
        return None
    if "name" in data:
        obj.name = data["name"]
    if "description" in data:
        obj.description = data["description"]
    if "fields" in data:
        obj.fields = json.dumps(data["fields"])
    if "status" in data:
        obj.status = data["status"]
    db.commit()
    db.refresh(obj)
    return obj


def delete_form_template(db: Session, template_id: str) -> bool:
    from datetime import datetime
    obj = db.get(models.FormTemplate, template_id)
    if not obj:
        return False
    obj.isDeleted = True
    obj.deletedAt = datetime.utcnow().isoformat()
    db.commit()
    return True


def list_form_submissions(db: Session, template_id: str) -> List[models.FormSubmission]:
    return db.execute(select(models.FormSubmission).where(models.FormSubmission.templateId == template_id).order_by(models.FormSubmission.createdAt.desc())).scalars().all()


def create_form_submission(db: Session, data: dict) -> models.FormSubmission:
    import json
    obj = models.FormSubmission(
        templateId=data["templateId"],
        data=json.dumps(data["data"]),
        submitterName=data.get("submitterName"),
        submitterPhone=data.get("submitterPhone"),
        submitterIp=data.get("submitterIp")
    )
    db.add(obj)

    # 更新提交计数
    template = db.get(models.FormTemplate, data["templateId"])
    if template:
        template.submissionCount = (template.submissionCount or 0) + 1

    db.commit()
    db.refresh(obj)
    return obj

