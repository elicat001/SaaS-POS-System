
export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

export enum TableStatus {
  AVAILABLE = 'AVAILABLE',
  SCANNED = 'SCANNED',
  UNPAID = 'UNPAID',
  PAID = 'PAID'
}

export enum ReservationStatus {
  CONFIRMED = 'CONFIRMED',
  PENDING = 'PENDING',
  ARRIVED = 'ARRIVED',
  CANCELLED = 'CANCELLED'
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  costPrice?: number; // New: Cost price for profit calculation
  categoryId: string;
  image?: string;
  stock: number;
  minStock?: number; // New: Low stock alert threshold
  unit: string;
  salesMode?: ('DINE_IN' | 'TAKE_OUT')[];
  isOnShelf: boolean;
  supplierId?: string; // New: Link to supplier
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  orderNo: string;
  tableId: string;
  items: CartItem[];
  total: number;
  totalCost?: number; // Added for profit calculation
  status: OrderStatus;
  paymentMethod?: string;
  timestamp: number;
  type: 'DINE_IN' | 'DELIVERY' | 'PICKUP';
}

export interface Table {
  id: string;
  name: string;
  status: TableStatus;
  capacity: number;
  area?: string;
  currentOrderId?: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  type: 'MEMBER' | 'NORMAL';
  balance: number;
  points: number;
  level: number;
  joinDate: string;
}

export interface Reservation {
  id: string;
  tableId: string;
  customerName: string;
  customerPhone: string;
  reservationTime: string; // ISO string or formatted date string
  guests: number;
  status: ReservationStatus;
  notes?: string;
}

// --- New Inventory Types ---

export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  phone: string;
  email?: string;
}

export enum StockTransactionType {
  IN_PURCHASE = '采购入库',
  IN_RETURN = '退货入库',
  OUT_SALE = '销售出库',
  OUT_LOSS = '损耗出库',
  ADJUSTMENT = '库存盘点'
}

export interface StockLog {
  id: string;
  productId: string;
  productName: string;
  type: StockTransactionType;
  delta: number; // Positive for IN, Negative for OUT
  currentStock: number; // Snapshot after change
  operator: string;
  timestamp: number;
  note?: string;
}

// ==================== 应用中心类型 ====================

export enum AppCategory {
  BUILTIN = 'builtin',
  INTEGRATION = 'integration'
}

export enum AppInstallationStatus {
  ACTIVE = 'active',
  DISABLED = 'disabled'
}

export interface App {
  id: string;
  name: string;
  description?: string;
  icon: string;
  category: AppCategory | string;
  version: string;
  isActive: boolean;
  configSchema?: string;
  route?: string;
  createdAt?: string;
}

export interface AppInstallation {
  id: string;
  appId: string;
  status: AppInstallationStatus | string;
  config?: string;
  createdAt?: string;
  updatedAt?: string;
  app?: App;
}

export interface ThirdPartyIntegration {
  id: string;
  platform: 'jd' | 'eleme' | 'meituan';
  appKey?: string;
  shopId?: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSyncAt?: string;
  errorMessage?: string;
  createdAt?: string;
}

// ==================== 存酒管理类型 ====================

export interface WineStorage {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  wineName: string;
  wineType?: string;
  quantity: number;
  unit: string;
  storageDate: string;
  expiryDate?: string;
  status: 'stored' | 'retrieved' | 'expired';
  notes?: string;
  retrievedAt?: string;
  retrievedQuantity?: number;
  createdAt?: string;
}

// ==================== 评价管理类型 ====================

export interface Review {
  id: string;
  orderId: string;
  customerId?: string;
  customerName?: string;
  rating: number;
  tasteRating?: number;
  serviceRating?: number;
  environmentRating?: number;
  content?: string;
  images?: string;
  reply?: string;
  repliedAt?: string;
  isAnonymous: boolean;
  status: 'visible' | 'hidden';
  createdAt?: string;
}

// ==================== 排队管理类型 ====================

export interface QueueTicket {
  id: string;
  ticketNo: string;
  queueType: 'small' | 'medium' | 'large';
  customerName?: string;
  customerPhone: string;
  partySize: number;
  status: 'waiting' | 'called' | 'seated' | 'cancelled' | 'expired';
  calledAt?: string;
  seatedAt?: string;
  tableId?: string;
  estimatedWaitMinutes?: number;
  notificationSent: boolean;
  createdAt?: string;
}

// ==================== 发票管理类型 ====================

export interface Invoice {
  id: string;
  orderId: string;
  invoiceType: 'personal' | 'company';
  titleType: 'general' | 'special';
  title: string;
  taxNumber?: string;
  companyAddress?: string;
  companyPhone?: string;
  bankName?: string;
  bankAccount?: string;
  amount: number;
  email?: string;
  status: 'pending' | 'issued' | 'rejected' | 'cancelled';
  invoiceNo?: string;
  invoiceUrl?: string;
  issuedAt?: string;
  rejectedReason?: string;
  createdAt?: string;
}

// ==================== WiFi配置类型 ====================

export interface StoreWifiConfig {
  id: string;
  ssid: string;
  password?: string;
  encryptionType: 'OPEN' | 'WEP' | 'WPA' | 'WPA2';
  isDefault: boolean;
  description?: string;
  createdAt?: string;
}

// ==================== 表单工具类型 ====================

export interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'phone' | 'email';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

export interface FormTemplate {
  id: string;
  name: string;
  description?: string;
  fields: string;
  status: 'active' | 'inactive';
  submissionCount: number;
  createdAt?: string;
}

export interface FormSubmission {
  id: string;
  templateId: string;
  data: string;
  submitterName?: string;
  submitterPhone?: string;
  submitterIp?: string;
  createdAt?: string;
}
