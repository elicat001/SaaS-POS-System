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


# ==================== 界面装修 Schemas ====================

class InterfaceWidget(BaseModel):
    id: str
    pageId: str
    widgetType: str
    name: Optional[str] = None
    props: dict
    style: Optional[dict] = None
    sortOrder: int
    isVisible: bool
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


class InterfaceWidgetCreate(BaseModel):
    widgetType: str
    name: Optional[str] = None
    props: dict
    style: Optional[dict] = None
    sortOrder: int = 0
    isVisible: bool = True


class InterfaceWidgetUpdate(BaseModel):
    name: Optional[str] = None
    props: Optional[dict] = None
    style: Optional[dict] = None
    sortOrder: Optional[int] = None
    isVisible: Optional[bool] = None


class InterfacePage(BaseModel):
    id: str
    pageType: str
    name: str
    description: Optional[str] = None
    backgroundColor: str
    backgroundImage: Optional[str] = None
    isPublished: bool
    publishedAt: Optional[str] = None
    version: int
    widgets: List[InterfaceWidget] = []
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


class InterfacePageCreate(BaseModel):
    pageType: str
    name: str
    description: Optional[str] = None
    backgroundColor: str = '#f8fafc'
    backgroundImage: Optional[str] = None


class InterfacePageUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    backgroundColor: Optional[str] = None
    backgroundImage: Optional[str] = None


class InterfacePagePublish(BaseModel):
    publish: bool = True


class InterfaceTemplate(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    thumbnail: Optional[str] = None
    category: str
    industry: Optional[str] = None
    pageType: str
    config: dict
    isSystem: bool
    useCount: int
    createdAt: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


class InterfaceTemplateCreate(BaseModel):
    name: str
    description: Optional[str] = None
    thumbnail: Optional[str] = None
    category: str = 'custom'
    industry: Optional[str] = None
    pageType: str
    config: dict


class InterfaceTheme(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    primaryColor: str
    secondaryColor: str
    accentColor: str
    textColor: str
    backgroundColor: str
    borderRadius: str
    fontFamily: str
    customCss: Optional[str] = None
    isActive: bool
    isSystem: bool
    createdAt: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


class InterfaceThemeCreate(BaseModel):
    name: str
    description: Optional[str] = None
    primaryColor: str = '#10b981'
    secondaryColor: str = '#3b82f6'
    accentColor: str = '#f59e0b'
    textColor: str = '#1e293b'
    backgroundColor: str = '#ffffff'
    borderRadius: str = '8px'
    fontFamily: str = 'system-ui'
    customCss: Optional[str] = None


class InterfaceThemeUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    primaryColor: Optional[str] = None
    secondaryColor: Optional[str] = None
    accentColor: Optional[str] = None
    textColor: Optional[str] = None
    backgroundColor: Optional[str] = None
    borderRadius: Optional[str] = None
    fontFamily: Optional[str] = None
    customCss: Optional[str] = None
    isActive: Optional[bool] = None


class InterfaceHistory(BaseModel):
    id: str
    pageId: str
    version: int
    config: dict
    operationType: str
    operatorId: Optional[str] = None
    operatorName: Optional[str] = None
    description: Optional[str] = None
    createdAt: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


class InterfaceNavBar(BaseModel):
    id: str
    name: str
    backgroundColor: str
    activeColor: str
    inactiveColor: str
    items: List[dict]
    isActive: bool
    createdAt: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


class InterfaceNavBarCreate(BaseModel):
    name: str = '默认导航栏'
    backgroundColor: str = '#ffffff'
    activeColor: str = '#10b981'
    inactiveColor: str = '#94a3b8'
    items: List[dict]


class InterfaceNavBarUpdate(BaseModel):
    name: Optional[str] = None
    backgroundColor: Optional[str] = None
    activeColor: Optional[str] = None
    inactiveColor: Optional[str] = None
    items: Optional[List[dict]] = None
    isActive: Optional[bool] = None


class InterfacePopup(BaseModel):
    id: str
    name: str
    popupType: str
    title: Optional[str] = None
    content: Optional[str] = None
    imageUrl: Optional[str] = None
    linkUrl: Optional[str] = None
    linkType: Optional[str] = None
    position: str
    showOnce: bool
    startTime: Optional[str] = None
    endTime: Optional[str] = None
    isActive: bool
    triggerType: str
    triggerValue: Optional[str] = None
    createdAt: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


class InterfacePopupCreate(BaseModel):
    name: str
    popupType: str
    title: Optional[str] = None
    content: Optional[str] = None
    imageUrl: Optional[str] = None
    linkUrl: Optional[str] = None
    linkType: Optional[str] = None
    position: str = 'center'
    showOnce: bool = True
    startTime: Optional[str] = None
    endTime: Optional[str] = None
    triggerType: str = 'enter'
    triggerValue: Optional[str] = None


class InterfacePopupUpdate(BaseModel):
    name: Optional[str] = None
    popupType: Optional[str] = None
    title: Optional[str] = None
    content: Optional[str] = None
    imageUrl: Optional[str] = None
    linkUrl: Optional[str] = None
    linkType: Optional[str] = None
    position: Optional[str] = None
    showOnce: Optional[bool] = None
    startTime: Optional[str] = None
    endTime: Optional[str] = None
    isActive: Optional[bool] = None
    triggerType: Optional[str] = None
    triggerValue: Optional[str] = None


class WidgetReorderRequest(BaseModel):
    widgetIds: List[str]  # 按新顺序排列的widget ID列表


class PageConfigSnapshot(BaseModel):
    """页面配置快照，用于保存/恢复"""
    backgroundColor: str
    backgroundImage: Optional[str] = None
    widgets: List[InterfaceWidgetCreate]

