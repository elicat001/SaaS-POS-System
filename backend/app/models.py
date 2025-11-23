import uuid
from sqlalchemy import Column, String, Integer, Float, Text, ForeignKey, Enum
from sqlalchemy.orm import relationship
from backend.app.database import Base

class Category(Base):
    __tablename__ = "categories"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    icon = Column(String, nullable=True)
    products = relationship("Product", back_populates="category")

class Supplier(Base):
    __tablename__ = "suppliers"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    contactName = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    email = Column(String, nullable=True)
    products = relationship("Product", back_populates="supplier")

class Product(Base):
    __tablename__ = "products"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    costPrice = Column(Float, nullable=True)
    categoryId = Column(String, ForeignKey("categories.id"), nullable=False)
    image = Column(String, nullable=True)
    stock = Column(Integer, nullable=False, default=0)
    minStock = Column(Integer, nullable=True)
    unit = Column(String, nullable=False)
    salesMode = Column(String, nullable=True)
    isOnShelf = Column(Integer, nullable=False, default=1)
    supplierId = Column(String, ForeignKey("suppliers.id"), nullable=True)
    category = relationship("Category", back_populates="products")
    supplier = relationship("Supplier", back_populates="products")

class Table(Base):
    __tablename__ = "tables"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    status = Column(String, nullable=False)
    capacity = Column(Integer, nullable=False)
    area = Column(String, nullable=True)
    currentOrderId = Column(String, nullable=True)
    orders = relationship("Order", back_populates="table")

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    type = Column(String, nullable=False)
    balance = Column(Float, nullable=False, default=0.0)
    points = Column(Integer, nullable=False, default=0)
    level = Column(Integer, nullable=False, default=0)
    joinDate = Column(String, nullable=False)

class Order(Base):
    __tablename__ = "orders"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    orderNo = Column(String, nullable=False)
    tableId = Column(String, ForeignKey("tables.id"), nullable=False)
    total = Column(Float, nullable=False, default=0.0)
    totalCost = Column(Float, nullable=True)
    status = Column(String, nullable=False)
    paymentMethod = Column(String, nullable=True)
    timestamp = Column(Integer, nullable=False)
    type = Column(String, nullable=False)
    table = relationship("Table", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    orderId = Column(String, ForeignKey("orders.id"), nullable=False)
    productId = Column(String, ForeignKey("products.id"), nullable=False)
    name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    costPrice = Column(Float, nullable=True)
    image = Column(String, nullable=True)
    unit = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    order = relationship("Order", back_populates="items")

class Reservation(Base):
    __tablename__ = "reservations"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    tableId = Column(String, ForeignKey("tables.id"), nullable=False)
    customerName = Column(String, nullable=False)
    customerPhone = Column(String, nullable=False)
    reservationTime = Column(String, nullable=False)
    guests = Column(Integer, nullable=False)
    status = Column(String, nullable=False)
    notes = Column(Text, nullable=True)

class StockLog(Base):
    __tablename__ = "stock_logs"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    productId = Column(String, ForeignKey("products.id"), nullable=False)
    productName = Column(String, nullable=False)
    type = Column(String, nullable=False)
    delta = Column(Integer, nullable=False)
    currentStock = Column(Integer, nullable=False)
    operator = Column(String, nullable=False)
    timestamp = Column(Integer, nullable=False)
    note = Column(Text, nullable=True)

