// 从React项目复制的类型定义
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
  costPrice?: number;
  categoryId: string;
  image?: string;
  stock: number;
  minStock?: number;
  unit: string;
  salesMode?: ('DINE_IN' | 'TAKE_OUT')[];
  isOnShelf: boolean;
  supplierId?: string;
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
  totalCost?: number;
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
  reservationTime: string;
  guests: number;
  status: ReservationStatus;
  notes?: string;
}

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
  delta: number;
  currentStock: number;
  operator: string;
  timestamp: number;
  note?: string;
}

// 认证相关类型
export interface AuthUser {
  id: string;
  username: string;
  email?: string;
  roles: string[];
  permissions: string[];
  avatar?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

// API响应类型
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// 分页类型
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 错误类型
export interface ApiError {
  message: string;
  code?: string;
  status: number;
  details?: Record<string, unknown>;
}

// 认证相关类型
export interface AuthUser {
  id: string;
  username: string;
  email?: string;
  roles: string[];
  permissions: string[];
  avatar?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

// API响应类型
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// 分页类型
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}