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


# ==================== 应用中心 Schemas ====================

class App(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    category: str
    version: str
    isActive: bool
    configSchema: Optional[str] = None
    route: Optional[str] = None
    createdAt: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


class AppInstallation(BaseModel):
    id: str
    appId: str
    status: str
    config: Optional[str] = None
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


class AppInstallationWithApp(BaseModel):
    id: str
    appId: str
    status: str
    config: Optional[str] = None
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None
    app: Optional[App] = None
    model_config = ConfigDict(from_attributes=True)


class AppInstallRequest(BaseModel):
    appId: str
    config: Optional[dict] = None


class AppConfigUpdate(BaseModel):
    config: dict


class AppToggleRequest(BaseModel):
    status: str  # 'active' | 'disabled'


class ThirdPartyIntegration(BaseModel):
    id: str
    platform: str
    appKey: Optional[str] = None
    shopId: Optional[str] = None
    status: str
    lastSyncAt: Optional[str] = None
    errorMessage: Optional[str] = None
    createdAt: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


class ThirdPartyIntegrationCreate(BaseModel):
    platform: str
    appKey: Optional[str] = None
    appSecret: Optional[str] = None
    shopId: Optional[str] = None


class ThirdPartyIntegrationUpdate(BaseModel):
    appKey: Optional[str] = None
    appSecret: Optional[str] = None
    shopId: Optional[str] = None
    status: Optional[str] = None


# ==================== 应用数据 Schemas ====================

class WineStorage(BaseModel):
    id: str
    customerId: str
    customerName: str
    customerPhone: str
    wineName: str
    wineType: Optional[str] = None
    quantity: float
    unit: str
    storageDate: str
    expiryDate: Optional[str] = None
    status: str
    notes: Optional[str] = None
    retrievedAt: Optional[str] = None
    retrievedQuantity: Optional[float] = None
    createdAt: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


class WineStorageCreate(BaseModel):
    customerId: str
    customerName: str
    customerPhone: str
    wineName: str
    wineType: Optional[str] = None
    quantity: float
    unit: str = '瓶'
    storageDate: str
    expiryDate: Optional[str] = None
    notes: Optional[str] = None


class WineStorageRetrieve(BaseModel):
    quantity: float
    notes: Optional[str] = None


class Review(BaseModel):
    id: str
    orderId: str
    customerId: Optional[str] = None
    customerName: Optional[str] = None
    rating: int
    tasteRating: Optional[int] = None
    serviceRating: Optional[int] = None
    environmentRating: Optional[int] = None
    content: Optional[str] = None
    images: Optional[str] = None
    reply: Optional[str] = None
    repliedAt: Optional[str] = None
    isAnonymous: bool
    status: str
    createdAt: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


class ReviewCreate(BaseModel):
    orderId: str
    customerId: Optional[str] = None
    customerName: Optional[str] = None
    rating: int
    tasteRating: Optional[int] = None
    serviceRating: Optional[int] = None
    environmentRating: Optional[int] = None
    content: Optional[str] = None
    images: Optional[List[str]] = None
    isAnonymous: bool = False


class ReviewReply(BaseModel):
    reply: str


class QueueTicket(BaseModel):
    id: str
    ticketNo: str
    queueType: str
    customerName: Optional[str] = None
    customerPhone: str
    partySize: int
    status: str
    calledAt: Optional[str] = None
    seatedAt: Optional[str] = None
    tableId: Optional[str] = None
    estimatedWaitMinutes: Optional[int] = None
    notificationSent: bool
    createdAt: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


class QueueTicketCreate(BaseModel):
    queueType: str
    customerName: Optional[str] = None
    customerPhone: str
    partySize: int


class Invoice(BaseModel):
    id: str
    orderId: str
    invoiceType: str
    titleType: str
    title: str
    taxNumber: Optional[str] = None
    companyAddress: Optional[str] = None
    companyPhone: Optional[str] = None
    bankName: Optional[str] = None
    bankAccount: Optional[str] = None
    amount: float
    email: Optional[str] = None
    status: str
    invoiceNo: Optional[str] = None
    invoiceUrl: Optional[str] = None
    issuedAt: Optional[str] = None
    rejectedReason: Optional[str] = None
    createdAt: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


class InvoiceCreate(BaseModel):
    orderId: str
    invoiceType: str
    titleType: str
    title: str
    taxNumber: Optional[str] = None
    companyAddress: Optional[str] = None
    companyPhone: Optional[str] = None
    bankName: Optional[str] = None
    bankAccount: Optional[str] = None
    amount: float
    email: Optional[str] = None


class InvoiceIssue(BaseModel):
    invoiceNo: str
    invoiceUrl: Optional[str] = None


class InvoiceReject(BaseModel):
    reason: str


class StoreWifiConfig(BaseModel):
    id: str
    ssid: str
    password: Optional[str] = None
    encryptionType: str
    isDefault: bool
    description: Optional[str] = None
    createdAt: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


class StoreWifiConfigCreate(BaseModel):
    ssid: str
    password: Optional[str] = None
    encryptionType: str = 'WPA2'
    isDefault: bool = False
    description: Optional[str] = None


class FormTemplate(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    fields: str
    status: str
    submissionCount: int
    createdAt: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


class FormTemplateCreate(BaseModel):
    name: str
    description: Optional[str] = None
    fields: List[dict]


class FormSubmission(BaseModel):
    id: str
    templateId: str
    data: str
    submitterName: Optional[str] = None
    submitterPhone: Optional[str] = None
    submitterIp: Optional[str] = None
    createdAt: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


class FormSubmissionCreate(BaseModel):
    templateId: str
    data: dict
    submitterName: Optional[str] = None
    submitterPhone: Optional[str] = None

