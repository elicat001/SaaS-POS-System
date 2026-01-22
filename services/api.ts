/**
 * API Service Layer - 统一的API调用服务
 * 实现前后端集成，包含错误处理、请求拦截、响应处理
 */

import {
  Product, Category, Supplier, Table, User, Order,
  Reservation, StockLog, StockTransactionType
} from '../types';

// API配置
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const REQUEST_TIMEOUT = 10000; // 10秒超时

// 自定义错误类
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// 网络错误
export class NetworkError extends Error {
  constructor(message: string = '网络连接失败，请检查网络设置') {
    super(message);
    this.name = 'NetworkError';
  }
}

// 请求配置接口
interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
}

// 响应处理
interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Token管理
class TokenManager {
  private static TOKEN_KEY = 'auth_token';
  private static REFRESH_TOKEN_KEY = 'refresh_token';

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  static clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

// 基础请求函数
async function request<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> {
  const { timeout = REQUEST_TIMEOUT, retries = 1, ...fetchConfig } = config;

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  // 构建请求头
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchConfig.headers,
  };

  // 添加认证token
  const token = TokenManager.getToken();
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  // 创建AbortController用于超时控制
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url, {
        ...fetchConfig,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // 处理401未授权
      if (response.status === 401) {
        TokenManager.clearTokens();
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        throw new ApiError('登录已过期，请重新登录', 401, 'UNAUTHORIZED');
      }

      // 处理其他错误状态
      if (!response.ok) {
        let errorData: Record<string, unknown> = {};
        try {
          errorData = await response.json();
        } catch {
          // 忽略JSON解析错误
        }

        const message = (errorData.detail as string) || (errorData.message as string) || `请求失败 (${response.status})`;
        throw new ApiError(message, response.status, errorData.code as string, errorData);
      }

      // 处理204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          lastError = new NetworkError('请求超时，请稍后重试');
        } else {
          lastError = new NetworkError(error.message);
        }
      }

      // 如果不是最后一次重试，等待后继续
      if (attempt < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }

  throw lastError || new NetworkError();
}

// HTTP方法封装
const http = {
  get: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: 'GET' }),

  post: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    }),

  put: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    }),

  patch: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined
    }),

  delete: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: 'DELETE' }),
};

// ==================== 认证相关API ====================

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: AuthUser;
}

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'manager' | 'cashier' | 'staff';
  permissions: string[];
  avatar?: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  name: string;
  phone?: string;
  role?: string;
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await http.post<LoginResponse>('/auth/login', credentials);
    TokenManager.setToken(response.access_token);
    TokenManager.setRefreshToken(response.refresh_token);
    return response;
  },

  logout: async (): Promise<void> => {
    try {
      await http.post('/auth/logout');
    } finally {
      TokenManager.clearTokens();
    }
  },

  register: (data: RegisterRequest) =>
    http.post<{ id: string; username: string }>('/auth/register', data),

  getCurrentUser: () =>
    http.get<AuthUser>('/auth/me'),

  refreshToken: async (): Promise<string> => {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new ApiError('No refresh token', 401);
    }
    const response = await http.post<{ access_token: string }>('/auth/refresh', {
      refresh_token: refreshToken
    });
    TokenManager.setToken(response.access_token);
    return response.access_token;
  },

  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    http.post('/auth/change-password', data),

  isAuthenticated: () => TokenManager.isAuthenticated(),

  clearAuth: () => TokenManager.clearTokens(),
};

// ==================== 商品API ====================

export interface ProductCreateRequest {
  name: string;
  price: number;
  categoryId: string;
  stock: number;
  unit: string;
  image?: string;
  costPrice?: number;
  minStock?: number;
  salesMode?: string[];
  isOnShelf?: boolean;
  supplierId?: string;
}

export const productApi = {
  list: () => http.get<Product[]>('/products/'),

  get: (id: string) => http.get<Product>(`/products/${id}`),

  create: (data: ProductCreateRequest) =>
    http.post<Product>('/products/', data),

  update: (id: string, data: Partial<ProductCreateRequest>) =>
    http.put<Product>(`/products/${id}`, data),

  delete: (id: string) => http.delete(`/products/${id}`),

  updateStock: (id: string, delta: number, type: StockTransactionType, note?: string) =>
    http.post(`/products/${id}/stock`, { delta, type, note }),

  batchUpdateStock: (updates: Array<{ productId: string; delta: number; type: StockTransactionType; note?: string }>) =>
    http.post('/products/batch-stock', { updates }),
};

// ==================== 分类API ====================

export const categoryApi = {
  list: () => http.get<Category[]>('/categories/'),

  create: (data: { name: string; icon?: string }) =>
    http.post<Category>('/categories/', data),

  update: (id: string, data: { name?: string; icon?: string }) =>
    http.put<Category>(`/categories/${id}`, data),

  delete: (id: string) => http.delete(`/categories/${id}`),
};

// ==================== 供应商API ====================

export interface SupplierCreateRequest {
  name: string;
  contactName: string;
  phone: string;
  email?: string;
}

export const supplierApi = {
  list: () => http.get<Supplier[]>('/suppliers/'),

  get: (id: string) => http.get<Supplier>(`/suppliers/${id}`),

  create: (data: SupplierCreateRequest) =>
    http.post<Supplier>('/suppliers/', data),

  update: (id: string, data: Partial<SupplierCreateRequest>) =>
    http.put<Supplier>(`/suppliers/${id}`, data),

  delete: (id: string) => http.delete(`/suppliers/${id}`),
};

// ==================== 桌台API ====================

export interface TableCreateRequest {
  name: string;
  status: string;
  capacity: number;
  area?: string;
}

export const tableApi = {
  list: () => http.get<Table[]>('/tables/'),

  get: (id: string) => http.get<Table>(`/tables/${id}`),

  create: (data: TableCreateRequest) =>
    http.post<Table>('/tables/', data),

  update: (id: string, data: Partial<TableCreateRequest & { currentOrderId?: string }>) =>
    http.put<Table>(`/tables/${id}`, data),

  delete: (id: string) => http.delete(`/tables/${id}`),

  updateStatus: (id: string, status: string) =>
    http.patch<Table>(`/tables/${id}/status`, { status }),
};

// ==================== 订单API ====================

export interface OrderItemCreate {
  productId: string;
  name: string;
  price: number;
  costPrice?: number;
  image?: string;
  unit: string;
  quantity: number;
}

export interface OrderCreateRequest {
  orderNo: string;
  tableId: string;
  items: OrderItemCreate[];
  status: string;
  paymentMethod?: string;
  timestamp: number;
  type: 'DINE_IN' | 'DELIVERY' | 'PICKUP';
}

export const orderApi = {
  list: (params?: { status?: string; startDate?: number; endDate?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.startDate) queryParams.append('start_ts', params.startDate.toString());
    if (params?.endDate) queryParams.append('end_ts', params.endDate.toString());
    const query = queryParams.toString();
    return http.get<Order[]>(`/orders/${query ? `?${query}` : ''}`);
  },

  get: (id: string) => http.get<Order>(`/orders/${id}`),

  create: (data: OrderCreateRequest) =>
    http.post<Order>('/orders/', data),

  updateStatus: (id: string, status: string) =>
    http.patch<Order>(`/orders/${id}/status`, { status }),

  cancel: (id: string, reason?: string) =>
    http.post(`/orders/${id}/cancel`, { reason }),

  refund: (id: string, amount?: number, reason?: string) =>
    http.post(`/orders/${id}/refund`, { amount, reason }),
};

// ==================== 用户API ====================

export interface UserCreateRequest {
  name: string;
  phone: string;
  type: 'MEMBER' | 'NORMAL';
  balance?: number;
  points?: number;
  level?: number;
  joinDate: string;
}

export const userApi = {
  list: (params?: { type?: string; search?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append('type', params.type);
    if (params?.search) queryParams.append('search', params.search);
    const query = queryParams.toString();
    return http.get<User[]>(`/users/${query ? `?${query}` : ''}`);
  },

  get: (id: string) => http.get<User>(`/users/${id}`),

  create: (data: UserCreateRequest) =>
    http.post<User>('/users/', data),

  update: (id: string, data: Partial<UserCreateRequest>) =>
    http.put<User>(`/users/${id}`, data),

  delete: (id: string) => http.delete(`/users/${id}`),

  addBalance: (id: string, amount: number) =>
    http.post(`/users/${id}/balance`, { amount }),

  addPoints: (id: string, points: number) =>
    http.post(`/users/${id}/points`, { points }),
};

// ==================== 预订API ====================

export interface ReservationCreateRequest {
  tableId: string;
  customerName: string;
  customerPhone: string;
  reservationTime: string;
  guests: number;
  status: string;
  notes?: string;
}

export const reservationApi = {
  list: (params?: { date?: string; status?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.date) queryParams.append('date', params.date);
    if (params?.status) queryParams.append('status', params.status);
    const query = queryParams.toString();
    return http.get<Reservation[]>(`/reservations/${query ? `?${query}` : ''}`);
  },

  get: (id: string) => http.get<Reservation>(`/reservations/${id}`),

  create: (data: ReservationCreateRequest) =>
    http.post<Reservation>('/reservations/', data),

  update: (id: string, data: Partial<ReservationCreateRequest>) =>
    http.put<Reservation>(`/reservations/${id}`, data),

  cancel: (id: string) =>
    http.post(`/reservations/${id}/cancel`),

  arrive: (id: string) =>
    http.post(`/reservations/${id}/arrive`),
};

// ==================== 库存日志API ====================

export interface StockLogCreateRequest {
  productId: string;
  productName: string;
  type: string;
  delta: number;
  currentStock: number;
  operator: string;
  timestamp: number;
  note?: string;
}

export const inventoryApi = {
  getLogs: (params?: { productId?: string; type?: string; startDate?: number; endDate?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.productId) queryParams.append('product_id', params.productId);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.startDate) queryParams.append('start_ts', params.startDate.toString());
    if (params?.endDate) queryParams.append('end_ts', params.endDate.toString());
    const query = queryParams.toString();
    return http.get<StockLog[]>(`/inventory/logs${query ? `?${query}` : ''}`);
  },

  createLog: (data: StockLogCreateRequest) =>
    http.post<StockLog>('/inventory/logs', data),

  getLowStockProducts: () =>
    http.get<Product[]>('/inventory/low-stock'),

  getStockValue: () =>
    http.get<{ totalValue: number; totalCost: number; itemCount: number }>('/inventory/value'),
};

// ==================== 分析API ====================

export interface SalesSummary {
  date: string;
  orders: number;
  gross: number;
  profit?: number;
}

export interface DashboardStats {
  todayRevenue: number;
  todayOrders: number;
  todayProfit: number;
  averageOrderValue: number;
  comparedToYesterday: {
    revenue: number;
    orders: number;
    profit: number;
  };
}

export const analyticsApi = {
  getSalesSummary: (startTs: number, endTs: number) =>
    http.get<SalesSummary[]>(`/analytics/sales-summary?start_ts=${startTs}&end_ts=${endTs}`),

  getDashboardStats: () =>
    http.get<DashboardStats>('/analytics/dashboard'),

  getTopProducts: (limit: number = 10, startTs?: number, endTs?: number) => {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (startTs) params.append('start_ts', startTs.toString());
    if (endTs) params.append('end_ts', endTs.toString());
    return http.get<Array<{ productId: string; name: string; quantity: number; revenue: number }>>(
      `/analytics/top-products?${params}`
    );
  },

  getHourlySales: (date?: string) => {
    const params = date ? `?date=${date}` : '';
    return http.get<Array<{ hour: number; orders: number; revenue: number }>>(
      `/analytics/hourly-sales${params}`
    );
  },

  getCategorySales: (startTs?: number, endTs?: number) => {
    const params = new URLSearchParams();
    if (startTs) params.append('start_ts', startTs.toString());
    if (endTs) params.append('end_ts', endTs.toString());
    const query = params.toString();
    return http.get<Array<{ categoryId: string; name: string; revenue: number; orders: number }>>(
      `/analytics/category-sales${query ? `?${query}` : ''}`
    );
  },
};

// ==================== AI服务代理API ====================

export const aiApi = {
  generateInsight: (salesData: unknown, recentOrders: unknown) =>
    http.post<{ insight: string }>('/ai/insight', { salesData, recentOrders }),

  generateProductDescription: (productName: string) =>
    http.post<{ description: string }>('/ai/product-description', { productName }),
};

// ==================== 应用中心API ====================

interface App {
  id: string;
  name: string;
  description?: string;
  icon: string;
  category: string;
  version: string;
  isActive: boolean;
  configSchema?: string;
  route?: string;
  createdAt?: string;
}

interface AppInstallation {
  id: string;
  appId: string;
  status: string;
  config?: string;
  createdAt?: string;
  updatedAt?: string;
  app?: App;
}

interface ThirdPartyIntegration {
  id: string;
  platform: string;
  appKey?: string;
  shopId?: string;
  status: string;
  lastSyncAt?: string;
  errorMessage?: string;
  createdAt?: string;
}

interface WineStorage {
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
  status: string;
  notes?: string;
  retrievedAt?: string;
  retrievedQuantity?: number;
  createdAt?: string;
}

interface Review {
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
  status: string;
  createdAt?: string;
}

interface QueueTicket {
  id: string;
  ticketNo: string;
  queueType: string;
  customerName?: string;
  customerPhone: string;
  partySize: number;
  status: string;
  calledAt?: string;
  seatedAt?: string;
  tableId?: string;
  estimatedWaitMinutes?: number;
  notificationSent: boolean;
  createdAt?: string;
}

interface Invoice {
  id: string;
  orderId: string;
  invoiceType: string;
  titleType: string;
  title: string;
  taxNumber?: string;
  amount: number;
  email?: string;
  status: string;
  invoiceNo?: string;
  invoiceUrl?: string;
  createdAt?: string;
}

interface StoreWifiConfig {
  id: string;
  ssid: string;
  password?: string;
  encryptionType: string;
  isDefault: boolean;
  description?: string;
  createdAt?: string;
}

interface FormTemplate {
  id: string;
  name: string;
  description?: string;
  fields: string;
  status: string;
  submissionCount: number;
  createdAt?: string;
}

interface FormSubmission {
  id: string;
  templateId: string;
  data: string;
  submitterName?: string;
  submitterPhone?: string;
  createdAt?: string;
}

export const appApi = {
  // 应用管理
  listApps: () => http.get<App[]>('/apps/'),
  listInstalled: () => http.get<AppInstallation[]>('/apps/installed'),
  getApp: (appId: string) => http.get<App>(`/apps/${appId}`),
  install: (appId: string, config?: Record<string, unknown>) =>
    http.post<AppInstallation>('/apps/install', { appId, config }),
  uninstall: (installationId: string) => http.delete(`/apps/${installationId}`),
  updateConfig: (installationId: string, config: Record<string, unknown>) =>
    http.put<AppInstallation>(`/apps/${installationId}/config`, { config }),
  toggle: (installationId: string, status: 'active' | 'disabled') =>
    http.put<AppInstallation>(`/apps/${installationId}/toggle`, { status }),

  // 存酒管理
  listWineStorage: (status?: string) =>
    http.get<WineStorage[]>(`/apps/wine-storage/list${status ? `?status=${status}` : ''}`),
  getWineStorage: (wineId: string) => http.get<WineStorage>(`/apps/wine-storage/${wineId}`),
  createWineStorage: (data: Omit<WineStorage, 'id' | 'status' | 'createdAt' | 'retrievedAt' | 'retrievedQuantity'>) =>
    http.post<WineStorage>('/apps/wine-storage', data),
  retrieveWine: (wineId: string, quantity: number, notes?: string) =>
    http.post<WineStorage>(`/apps/wine-storage/${wineId}/retrieve`, { quantity, notes }),

  // 评价管理
  listReviews: (status?: string) =>
    http.get<Review[]>(`/apps/reviews/list${status ? `?status=${status}` : ''}`),
  getReview: (reviewId: string) => http.get<Review>(`/apps/reviews/${reviewId}`),
  createReview: (data: { orderId: string; rating: number; content?: string; images?: string[]; isAnonymous?: boolean }) =>
    http.post<Review>('/apps/reviews', data),
  replyReview: (reviewId: string, reply: string) =>
    http.post<Review>(`/apps/reviews/${reviewId}/reply`, { reply }),
  toggleReviewVisibility: (reviewId: string, status: 'visible' | 'hidden') =>
    http.put(`/apps/reviews/${reviewId}/visibility?status=${status}`),

  // 排队管理
  listQueueTickets: (status?: string) =>
    http.get<QueueTicket[]>(`/apps/queue/list${status ? `?status=${status}` : ''}`),
  getQueueTicket: (ticketId: string) => http.get<QueueTicket>(`/apps/queue/${ticketId}`),
  createQueueTicket: (data: { queueType: string; customerName?: string; customerPhone: string; partySize: number }) =>
    http.post<QueueTicket>('/apps/queue', data),
  callQueueTicket: (ticketId: string) => http.post<QueueTicket>(`/apps/queue/${ticketId}/call`),
  seatQueueTicket: (ticketId: string, tableId: string) =>
    http.post(`/apps/queue/${ticketId}/seat?table_id=${tableId}`),
  cancelQueueTicket: (ticketId: string) => http.post(`/apps/queue/${ticketId}/cancel`),

  // 发票管理
  listInvoices: (status?: string) =>
    http.get<Invoice[]>(`/apps/invoices/list${status ? `?status=${status}` : ''}`),
  getInvoice: (invoiceId: string) => http.get<Invoice>(`/apps/invoices/${invoiceId}`),
  createInvoice: (data: { orderId: string; invoiceType: string; titleType: string; title: string; taxNumber?: string; amount: number; email?: string }) =>
    http.post<Invoice>('/apps/invoices', data),
  issueInvoice: (invoiceId: string, invoiceNo: string, invoiceUrl?: string) =>
    http.post<Invoice>(`/apps/invoices/${invoiceId}/issue`, { invoiceNo, invoiceUrl }),
  rejectInvoice: (invoiceId: string, reason: string) =>
    http.post<Invoice>(`/apps/invoices/${invoiceId}/reject`, { reason }),

  // WiFi配置
  listWifiConfigs: () => http.get<StoreWifiConfig[]>('/apps/wifi/list'),
  createWifiConfig: (data: { ssid: string; password?: string; encryptionType?: string; isDefault?: boolean; description?: string }) =>
    http.post<StoreWifiConfig>('/apps/wifi', data),
  updateWifiConfig: (wifiId: string, data: { ssid: string; password?: string; encryptionType?: string; isDefault?: boolean; description?: string }) =>
    http.put<StoreWifiConfig>(`/apps/wifi/${wifiId}`, data),
  deleteWifiConfig: (wifiId: string) => http.delete(`/apps/wifi/${wifiId}`),

  // 表单工具
  listFormTemplates: () => http.get<FormTemplate[]>('/apps/forms/templates'),
  getFormTemplate: (templateId: string) => http.get<FormTemplate>(`/apps/forms/templates/${templateId}`),
  createFormTemplate: (data: { name: string; description?: string; fields: unknown[] }) =>
    http.post<FormTemplate>('/apps/forms/templates', data),
  updateFormTemplate: (templateId: string, data: { name: string; description?: string; fields: unknown[] }) =>
    http.put<FormTemplate>(`/apps/forms/templates/${templateId}`, data),
  deleteFormTemplate: (templateId: string) => http.delete(`/apps/forms/templates/${templateId}`),
  listFormSubmissions: (templateId: string) =>
    http.get<FormSubmission[]>(`/apps/forms/templates/${templateId}/submissions`),
  submitForm: (data: { templateId: string; data: Record<string, unknown>; submitterName?: string; submitterPhone?: string }) =>
    http.post<FormSubmission>('/apps/forms/submit', data),
};

// ==================== 第三方集成API ====================

export const integrationApi = {
  list: () => http.get<ThirdPartyIntegration[]>('/integrations/'),
  get: (platform: string) => http.get<ThirdPartyIntegration>(`/integrations/${platform}`),
  create: (data: { platform: string; appKey?: string; appSecret?: string; shopId?: string }) =>
    http.post<ThirdPartyIntegration>('/integrations/', data),
  update: (integrationId: string, data: { appKey?: string; appSecret?: string; shopId?: string; status?: string }) =>
    http.put<ThirdPartyIntegration>(`/integrations/${integrationId}`, data),
  delete: (integrationId: string) => http.delete(`/integrations/${integrationId}`),
  connect: (platform: string) => http.post<{ ok: boolean; message: string }>(`/integrations/${platform}/connect`),
  disconnect: (platform: string) => http.post<{ ok: boolean; message: string }>(`/integrations/${platform}/disconnect`),
  sync: (platform: string, syncType?: string) =>
    http.post<{ ok: boolean; message: string; syncType: string; syncedAt: string }>(`/integrations/${platform}/sync${syncType ? `?sync_type=${syncType}` : ''}`),
};

// 导出Token管理器供外部使用
export { TokenManager };

// 默认导出所有API
export default {
  auth: authApi,
  products: productApi,
  categories: categoryApi,
  suppliers: supplierApi,
  tables: tableApi,
  orders: orderApi,
  users: userApi,
  reservations: reservationApi,
  inventory: inventoryApi,
  analytics: analyticsApi,
  ai: aiApi,
  apps: appApi,
  integrations: integrationApi,
};
