from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from backend.app import models

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

