"""
数据库模型 - 包含审计字段和索引优化
"""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Text, ForeignKey, Boolean, Index, event
from sqlalchemy.orm import relationship
from backend.app.database import Base


# ==================== 基础Mixin ====================

class TimestampMixin:
    """时间戳混入类 - 提供审计字段"""
    createdAt = Column(String, nullable=False, default=lambda: datetime.utcnow().isoformat())
    updatedAt = Column(String, nullable=True)


class SoftDeleteMixin:
    """软删除混入类"""
    isDeleted = Column(Boolean, default=False, nullable=False)
    deletedAt = Column(String, nullable=True)


# ==================== 系统用户模型（用于认证） ====================

class SystemUser(Base, TimestampMixin):
    """系统用户 - 用于员工登录认证"""
    __tablename__ = "system_users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String(50), nullable=False, unique=True, index=True)
    passwordHash = Column(String(256), nullable=False)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=True)
    role = Column(String(20), nullable=False, default="staff")  # admin, manager, cashier, staff
    avatar = Column(String(500), nullable=True)
    isActive = Column(Boolean, default=True, nullable=False)
    lastLogin = Column(String, nullable=True)

    # 索引
    __table_args__ = (
        Index('idx_system_user_role', 'role'),
        Index('idx_system_user_active', 'isActive'),
    )


# ==================== 业务模型 ====================

class Category(Base, TimestampMixin):
    """商品分类"""
    __tablename__ = "categories"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    icon = Column(String(50), nullable=True)
    sortOrder = Column(Integer, default=0)
    isActive = Column(Boolean, default=True)

    # 关系
    products = relationship("Product", back_populates="category")

    # 索引
    __table_args__ = (
        Index('idx_category_active', 'isActive'),
        Index('idx_category_sort', 'sortOrder'),
    )


class Supplier(Base, TimestampMixin, SoftDeleteMixin):
    """供应商"""
    __tablename__ = "suppliers"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(200), nullable=False)
    contactName = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    email = Column(String(100), nullable=True)
    address = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)

    # 关系
    products = relationship("Product", back_populates="supplier")

    # 索引
    __table_args__ = (
        Index('idx_supplier_name', 'name'),
        Index('idx_supplier_deleted', 'isDeleted'),
    )


class Product(Base, TimestampMixin, SoftDeleteMixin):
    """商品"""
    __tablename__ = "products"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(200), nullable=False)
    price = Column(Float, nullable=False)
    costPrice = Column(Float, nullable=True)
    categoryId = Column(String, ForeignKey("categories.id"), nullable=False)
    image = Column(String(500), nullable=True)
    stock = Column(Integer, nullable=False, default=0)
    minStock = Column(Integer, nullable=True)
    unit = Column(String(20), nullable=False)
    salesMode = Column(String(50), nullable=True)  # 逗号分隔的销售模式
    isOnShelf = Column(Boolean, nullable=False, default=True)
    supplierId = Column(String, ForeignKey("suppliers.id"), nullable=True)
    description = Column(Text, nullable=True)
    barcode = Column(String(50), nullable=True)

    # 关系
    category = relationship("Category", back_populates="products")
    supplier = relationship("Supplier", back_populates="products")

    # 索引
    __table_args__ = (
        Index('idx_product_category', 'categoryId'),
        Index('idx_product_supplier', 'supplierId'),
        Index('idx_product_shelf', 'isOnShelf'),
        Index('idx_product_stock', 'stock'),
        Index('idx_product_deleted', 'isDeleted'),
        Index('idx_product_barcode', 'barcode'),
    )


class Table(Base, TimestampMixin):
    """餐桌"""
    __tablename__ = "tables"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(50), nullable=False)
    status = Column(String(20), nullable=False)  # AVAILABLE, SCANNED, UNPAID, PAID
    capacity = Column(Integer, nullable=False)
    area = Column(String(50), nullable=True)
    currentOrderId = Column(String, nullable=True)
    qrCode = Column(String(500), nullable=True)
    sortOrder = Column(Integer, default=0)

    # 关系
    orders = relationship("Order", back_populates="table")

    # 索引
    __table_args__ = (
        Index('idx_table_status', 'status'),
        Index('idx_table_area', 'area'),
    )


class User(Base, TimestampMixin, SoftDeleteMixin):
    """会员用户"""
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False, unique=True, index=True)
    type = Column(String(20), nullable=False)  # MEMBER, NORMAL
    balance = Column(Float, nullable=False, default=0.0)
    points = Column(Integer, nullable=False, default=0)
    level = Column(Integer, nullable=False, default=0)
    joinDate = Column(String, nullable=False)
    avatar = Column(String(500), nullable=True)
    birthday = Column(String, nullable=True)
    gender = Column(String(10), nullable=True)

    # 索引
    __table_args__ = (
        Index('idx_user_type', 'type'),
        Index('idx_user_level', 'level'),
        Index('idx_user_deleted', 'isDeleted'),
    )


class Order(Base, TimestampMixin):
    """订单"""
    __tablename__ = "orders"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    orderNo = Column(String(50), nullable=False, unique=True, index=True)
    tableId = Column(String, ForeignKey("tables.id"), nullable=False)
    userId = Column(String, ForeignKey("users.id"), nullable=True)
    total = Column(Float, nullable=False, default=0.0)
    totalCost = Column(Float, nullable=True)
    discount = Column(Float, nullable=True, default=0.0)
    status = Column(String(20), nullable=False)  # PENDING, COMPLETED, CANCELLED, REFUNDED
    paymentMethod = Column(String(20), nullable=True)
    paidAt = Column(String, nullable=True)
    timestamp = Column(Integer, nullable=False)
    type = Column(String(20), nullable=False)  # DINE_IN, DELIVERY, PICKUP
    notes = Column(Text, nullable=True)
    operatorId = Column(String, nullable=True)  # 操作员ID

    # 关系
    table = relationship("Table", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

    # 索引
    __table_args__ = (
        Index('idx_order_table', 'tableId'),
        Index('idx_order_user', 'userId'),
        Index('idx_order_status', 'status'),
        Index('idx_order_timestamp', 'timestamp'),
        Index('idx_order_type', 'type'),
        Index('idx_order_payment', 'paymentMethod'),
    )


class OrderItem(Base):
    """订单项"""
    __tablename__ = "order_items"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    orderId = Column(String, ForeignKey("orders.id"), nullable=False)
    productId = Column(String, ForeignKey("products.id"), nullable=False)
    name = Column(String(200), nullable=False)
    price = Column(Float, nullable=False)
    costPrice = Column(Float, nullable=True)
    image = Column(String(500), nullable=True)
    unit = Column(String(20), nullable=False)
    quantity = Column(Integer, nullable=False)
    subtotal = Column(Float, nullable=True)

    # 关系
    order = relationship("Order", back_populates="items")

    # 索引
    __table_args__ = (
        Index('idx_order_item_order', 'orderId'),
        Index('idx_order_item_product', 'productId'),
    )


class Reservation(Base, TimestampMixin):
    """预订"""
    __tablename__ = "reservations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    tableId = Column(String, ForeignKey("tables.id"), nullable=False)
    customerName = Column(String(100), nullable=False)
    customerPhone = Column(String(20), nullable=False)
    reservationTime = Column(String, nullable=False)
    guests = Column(Integer, nullable=False)
    status = Column(String(20), nullable=False)  # CONFIRMED, PENDING, ARRIVED, CANCELLED
    notes = Column(Text, nullable=True)
    source = Column(String(50), nullable=True)  # 预订来源

    # 索引
    __table_args__ = (
        Index('idx_reservation_table', 'tableId'),
        Index('idx_reservation_time', 'reservationTime'),
        Index('idx_reservation_status', 'status'),
        Index('idx_reservation_phone', 'customerPhone'),
    )


class StockLog(Base):
    """库存日志"""
    __tablename__ = "stock_logs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    productId = Column(String, ForeignKey("products.id"), nullable=False)
    productName = Column(String(200), nullable=False)
    type = Column(String(50), nullable=False)  # IN_PURCHASE, IN_RETURN, OUT_SALE, OUT_LOSS, ADJUSTMENT
    delta = Column(Integer, nullable=False)
    beforeStock = Column(Integer, nullable=True)
    currentStock = Column(Integer, nullable=False)
    costPrice = Column(Float, nullable=True)
    operator = Column(String(100), nullable=False)
    timestamp = Column(Integer, nullable=False)
    note = Column(Text, nullable=True)
    referenceNo = Column(String(100), nullable=True)  # 关联单号

    # 索引
    __table_args__ = (
        Index('idx_stock_log_product', 'productId'),
        Index('idx_stock_log_type', 'type'),
        Index('idx_stock_log_timestamp', 'timestamp'),
        Index('idx_stock_log_operator', 'operator'),
    )


# ==================== 配置相关模型 ====================

class SystemConfig(Base, TimestampMixin):
    """系统配置"""
    __tablename__ = "system_configs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    key = Column(String(100), nullable=False, unique=True, index=True)
    value = Column(Text, nullable=True)
    type = Column(String(20), nullable=False, default="string")  # string, json, number, boolean
    description = Column(String(500), nullable=True)
    group = Column(String(50), nullable=True)  # 配置分组

    __table_args__ = (
        Index('idx_config_group', 'group'),
    )


class AuditLog(Base):
    """审计日志"""
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    userId = Column(String, nullable=True)
    userName = Column(String(100), nullable=True)
    action = Column(String(50), nullable=False)  # CREATE, UPDATE, DELETE, LOGIN, LOGOUT
    resource = Column(String(50), nullable=False)  # 资源类型
    resourceId = Column(String, nullable=True)
    oldValue = Column(Text, nullable=True)
    newValue = Column(Text, nullable=True)
    ipAddress = Column(String(50), nullable=True)
    userAgent = Column(String(500), nullable=True)
    timestamp = Column(Integer, nullable=False)

    __table_args__ = (
        Index('idx_audit_user', 'userId'),
        Index('idx_audit_action', 'action'),
        Index('idx_audit_resource', 'resource'),
        Index('idx_audit_timestamp', 'timestamp'),
    )


# ==================== 事件监听器 ====================

@event.listens_for(Product, 'before_update')
def product_before_update(mapper, connection, target):
    """商品更新前设置更新时间"""
    target.updatedAt = datetime.utcnow().isoformat()


@event.listens_for(Order, 'before_update')
def order_before_update(mapper, connection, target):
    """订单更新前设置更新时间"""
    target.updatedAt = datetime.utcnow().isoformat()


@event.listens_for(User, 'before_update')
def user_before_update(mapper, connection, target):
    """用户更新前设置更新时间"""
    target.updatedAt = datetime.utcnow().isoformat()


@event.listens_for(Supplier, 'before_update')
def supplier_before_update(mapper, connection, target):
    """供应商更新前设置更新时间"""
    target.updatedAt = datetime.utcnow().isoformat()
