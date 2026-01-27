"""
数据库模型 - 包含审计字段和索引优化
"""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Text, ForeignKey, Boolean, Index, event
from sqlalchemy.orm import relationship
from app.database import Base


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


# ==================== 界面装修模型 ====================

class InterfacePage(Base, TimestampMixin):
    """界面页面配置"""
    __tablename__ = "interface_pages"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    pageType = Column(String(50), nullable=False)  # 'home' | 'user' | 'order' | 'category' | 'product_detail'
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    backgroundColor = Column(String(20), default='#f8fafc')
    backgroundImage = Column(String(500), nullable=True)
    isPublished = Column(Boolean, default=False)
    publishedAt = Column(String, nullable=True)
    version = Column(Integer, default=1)

    # 关系
    widgets = relationship("InterfaceWidget", back_populates="page", cascade="all, delete-orphan", order_by="InterfaceWidget.sortOrder")
    histories = relationship("InterfaceHistory", back_populates="page", cascade="all, delete-orphan")

    __table_args__ = (
        Index('idx_interface_page_type', 'pageType'),
        Index('idx_interface_page_published', 'isPublished'),
    )


class InterfaceWidget(Base, TimestampMixin):
    """界面组件"""
    __tablename__ = "interface_widgets"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    pageId = Column(String, ForeignKey("interface_pages.id"), nullable=False)
    widgetType = Column(String(50), nullable=False)  # 组件类型
    name = Column(String(100), nullable=True)  # 组件名称（可选）
    props = Column(Text, nullable=False)  # JSON格式的组件属性
    style = Column(Text, nullable=True)  # JSON格式的样式
    sortOrder = Column(Integer, default=0)
    isVisible = Column(Boolean, default=True)

    # 关系
    page = relationship("InterfacePage", back_populates="widgets")

    __table_args__ = (
        Index('idx_widget_page', 'pageId'),
        Index('idx_widget_type', 'widgetType'),
        Index('idx_widget_sort', 'sortOrder'),
    )


class InterfaceTemplate(Base, TimestampMixin):
    """界面模板"""
    __tablename__ = "interface_templates"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    thumbnail = Column(String(500), nullable=True)
    category = Column(String(50), nullable=False)  # 'official' | 'custom' | 'industry'
    industry = Column(String(50), nullable=True)  # 'restaurant' | 'cafe' | 'bar' | 'retail'
    pageType = Column(String(50), nullable=False)  # 适用的页面类型
    config = Column(Text, nullable=False)  # JSON完整配置
    isSystem = Column(Boolean, default=False)  # 是否系统预设
    useCount = Column(Integer, default=0)

    __table_args__ = (
        Index('idx_template_category', 'category'),
        Index('idx_template_industry', 'industry'),
        Index('idx_template_page_type', 'pageType'),
    )


class InterfaceTheme(Base, TimestampMixin):
    """界面主题"""
    __tablename__ = "interface_themes"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    primaryColor = Column(String(20), default='#10b981')
    secondaryColor = Column(String(20), default='#3b82f6')
    accentColor = Column(String(20), default='#f59e0b')
    textColor = Column(String(20), default='#1e293b')
    backgroundColor = Column(String(20), default='#ffffff')
    borderRadius = Column(String(20), default='8px')
    fontFamily = Column(String(100), default='system-ui')
    customCss = Column(Text, nullable=True)
    isActive = Column(Boolean, default=False)
    isSystem = Column(Boolean, default=False)

    __table_args__ = (
        Index('idx_theme_active', 'isActive'),
    )


class InterfaceHistory(Base, TimestampMixin):
    """界面配置历史（版本控制）"""
    __tablename__ = "interface_histories"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    pageId = Column(String, ForeignKey("interface_pages.id"), nullable=False)
    version = Column(Integer, nullable=False)
    config = Column(Text, nullable=False)  # JSON快照
    operationType = Column(String(20), nullable=False)  # 'create' | 'update' | 'publish' | 'restore'
    operatorId = Column(String, nullable=True)
    operatorName = Column(String(100), nullable=True)
    description = Column(String(200), nullable=True)  # 版本描述

    # 关系
    page = relationship("InterfacePage", back_populates="histories")

    __table_args__ = (
        Index('idx_history_page', 'pageId'),
        Index('idx_history_version', 'version'),
    )


class InterfaceNavBar(Base, TimestampMixin):
    """底部导航栏配置"""
    __tablename__ = "interface_navbars"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), default='默认导航栏')
    backgroundColor = Column(String(20), default='#ffffff')
    activeColor = Column(String(20), default='#10b981')
    inactiveColor = Column(String(20), default='#94a3b8')
    items = Column(Text, nullable=False)  # JSON数组 [{icon, label, path, badge}]
    isActive = Column(Boolean, default=True)


class InterfacePopup(Base, TimestampMixin):
    """弹窗/浮层配置"""
    __tablename__ = "interface_popups"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    popupType = Column(String(50), nullable=False)  # 'coupon' | 'activity' | 'announcement' | 'custom'
    title = Column(String(200), nullable=True)
    content = Column(Text, nullable=True)
    imageUrl = Column(String(500), nullable=True)
    linkUrl = Column(String(500), nullable=True)
    linkType = Column(String(50), nullable=True)  # 'page' | 'product' | 'category' | 'external'
    position = Column(String(50), default='center')  # 'center' | 'bottom' | 'top'
    showOnce = Column(Boolean, default=True)
    startTime = Column(String, nullable=True)
    endTime = Column(String, nullable=True)
    isActive = Column(Boolean, default=True)
    triggerType = Column(String(50), default='enter')  # 'enter' | 'scroll' | 'delay' | 'exit'
    triggerValue = Column(String(50), nullable=True)  # 触发条件值

    __table_args__ = (
        Index('idx_popup_type', 'popupType'),
        Index('idx_popup_active', 'isActive'),
    )


@event.listens_for(InterfacePage, 'before_update')
def interface_page_before_update(mapper, connection, target):
    """界面页面更新前设置更新时间"""
    target.updatedAt = datetime.utcnow().isoformat()


@event.listens_for(InterfaceWidget, 'before_update')
def interface_widget_before_update(mapper, connection, target):
    """界面组件更新前设置更新时间"""
    target.updatedAt = datetime.utcnow().isoformat()


@event.listens_for(InterfaceTemplate, 'before_update')
def interface_template_before_update(mapper, connection, target):
    """界面模板更新前设置更新时间"""
    target.updatedAt = datetime.utcnow().isoformat()


@event.listens_for(InterfaceTheme, 'before_update')
def interface_theme_before_update(mapper, connection, target):
    """界面主题更新前设置更新时间"""
    target.updatedAt = datetime.utcnow().isoformat()
