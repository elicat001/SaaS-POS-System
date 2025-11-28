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
};
