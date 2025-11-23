from typing import List, Optional
from pydantic import BaseModel
from pydantic import ConfigDict

class Category(BaseModel):
    id: str
    name: str
    icon: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class Supplier(BaseModel):
    id: str
    name: str
    contactName: str
    phone: str
    email: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class Product(BaseModel):
    id: str
    name: str
    price: float
    costPrice: Optional[float] = None
    categoryId: str
    image: Optional[str] = None
    stock: int
    minStock: Optional[int] = None
    unit: str
    salesMode: Optional[List[str]] = None
    isOnShelf: bool
    supplierId: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class ProductCreate(BaseModel):
    name: str
    price: float
    categoryId: str
    stock: int
    unit: str
    image: Optional[str] = None
    costPrice: Optional[float] = None
    minStock: Optional[int] = None
    salesMode: Optional[List[str]] = None
    isOnShelf: bool = True
    supplierId: Optional[str] = None

class Table(BaseModel):
    id: str
    name: str
    status: str
    capacity: int
    area: Optional[str] = None
    currentOrderId: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class TableCreate(BaseModel):
    name: str
    status: str
    capacity: int
    area: Optional[str] = None

class User(BaseModel):
    id: str
    name: str
    phone: str
    type: str
    balance: float
    points: int
    level: int
    joinDate: str
    model_config = ConfigDict(from_attributes=True)

class UserCreate(BaseModel):
    name: str
    phone: str
    type: str
    balance: float = 0.0
    points: int = 0
    level: int = 0
    joinDate: str

class OrderItem(BaseModel):
    id: str
    productId: str
    name: str
    price: float
    costPrice: Optional[float] = None
    image: Optional[str] = None
    unit: str
    quantity: int
    model_config = ConfigDict(from_attributes=True)

class OrderItemCreate(BaseModel):
    productId: str
    name: str
    price: float
    costPrice: Optional[float] = None
    image: Optional[str] = None
    unit: str
    quantity: int

class Order(BaseModel):
    id: str
    orderNo: str
    tableId: str
    items: List[OrderItem]
    total: float
    totalCost: Optional[float] = None
    status: str
    paymentMethod: Optional[str] = None
    timestamp: int
    type: str
    model_config = ConfigDict(from_attributes=True)

class OrderCreate(BaseModel):
    orderNo: str
    tableId: str
    items: List[OrderItemCreate]
    status: str
    paymentMethod: Optional[str] = None
    timestamp: int
    type: str

class Reservation(BaseModel):
    id: str
    tableId: str
    customerName: str
    customerPhone: str
    reservationTime: str
    guests: int
    status: str
    notes: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class ReservationCreate(BaseModel):
    tableId: str
    customerName: str
    customerPhone: str
    reservationTime: str
    guests: int
    status: str
    notes: Optional[str] = None

class StockLog(BaseModel):
    id: str
    productId: str
    productName: str
    type: str
    delta: int
    currentStock: int
    operator: str
    timestamp: int
    note: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class StockLogCreate(BaseModel):
    productId: str
    productName: str
    type: str
    delta: int
    currentStock: int
    operator: str
    timestamp: int
    note: Optional[str] = None

