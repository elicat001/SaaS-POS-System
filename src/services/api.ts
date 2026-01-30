/**
 * API Service Layer - 统一的API调用服务
 * 实现前后端集成，包含错误处理、请求拦截、响应处理
 */

import {
  Product, Category, Supplier, Table, User, Order,
  Reservation, StockLog, StockTransactionType
} from '@/types';

// API配置
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:8000/api';
const REQUEST_TIMEOUT = 10000; // 10秒超时

// 自定义错误类
class ApiError extends Error {
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
class NetworkError extends Error {
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
  private static ACCESS_TOKEN_KEY = 'access_token';
  private static REFRESH_TOKEN_KEY = 'refresh_token';

  static getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  static clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  static isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

// 请求拦截器
const requestInterceptor = (config: RequestConfig): RequestConfig => {
  const token = TokenManager.getAccessToken();
  const headers = new Headers(config.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  headers.set('Content-Type', 'application/json');

  return {
    ...config,
    headers,
  };
};

// 响应拦截器
const responseInterceptor = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let errorData: any;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: '请求失败' };
    }

    if (response.status === 401) {
      TokenManager.clearTokens();
      window.location.href = '/login';
    }

    throw new ApiError(
      errorData.message || `请求失败 (${response.status})`,
      response.status,
      errorData.code,
      errorData.details
    );
  }

  const data: ApiResponse<T> = await response.json();

  if (!data.success) {
    throw new ApiError(
      data.message || '请求失败',
      response.status,
      undefined,
      data as any
    );
  }

  return data.data;
};

// 基础请求函数
async function request<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const timeout = config.timeout || REQUEST_TIMEOUT;
  const retries = config.retries || 0;

  const interceptedConfig = requestInterceptor(config);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...interceptedConfig,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return await responseInterceptor<T>(response);
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new NetworkError('请求超时，请稍后重试');
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new NetworkError();
    }

    if (retries > 0) {
      // 指数退避重试
      await new Promise(resolve => setTimeout(resolve, 1000 * (3 - retries)));
      return request<T>(endpoint, { ...config, retries: retries - 1 });
    }

    throw error;
  }
}

// 认证API
export const authApi = {
  login: async (credentials: { username: string; password: string }) => {
    const response = await request<{
      access_token: string;
      refresh_token: string;
      token_type: string;
      user: any;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    TokenManager.setTokens(response.access_token, response.refresh_token);
    return response;
  },

  logout: async () => {
    try {
      await request('/auth/logout', { method: 'POST' });
    } finally {
      TokenManager.clearTokens();
    }
  },

  getCurrentUser: async () => {
    return request<any>('/auth/me');
  },

  isAuthenticated: () => TokenManager.isAuthenticated(),

  clearAuth: () => TokenManager.clearTokens(),
};

// 商品API
export const productApi = {
  getProducts: async (params?: {
    categoryId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.categoryId) query.set('category_id', params.categoryId);
    if (params?.search) query.set('search', params.search);
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());

    const queryString = query.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    return request<Product[]>(endpoint);
  },

  getProduct: async (id: string) => {
    return request<Product>(`/products/${id}`);
  },

  createProduct: async (product: Omit<Product, 'id'>) => {
    return request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  },

  updateProduct: async (id: string, product: Partial<Product>) => {
    return request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  },

  deleteProduct: async (id: string) => {
    return request(`/products/${id}`, { method: 'DELETE' });
  },
};

// 分类API
export const categoryApi = {
  getCategories: async () => {
    return request<Category[]>('/categories');
  },

  createCategory: async (category: Omit<Category, 'id'>) => {
    return request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  },

  updateCategory: async (id: string, category: Partial<Category>) => {
    return request<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
  },

  deleteCategory: async (id: string) => {
    return request(`/categories/${id}`, { method: 'DELETE' });
  },
};

// 订单API
export const orderApi = {
  getOrders: async (params?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.startDate) query.set('start_date', params.startDate);
    if (params?.endDate) query.set('end_date', params.endDate);
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());

    const queryString = query.toString();
    const endpoint = `/orders${queryString ? `?${queryString}` : ''}`;
    return request<Order[]>(endpoint);
  },

  getOrder: async (id: string) => {
    return request<Order>(`/orders/${id}`);
  },

  createOrder: async (order: Omit<Order, 'id' | 'orderNo' | 'timestamp'>) => {
    return request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  },

  updateOrderStatus: async (id: string, status: string) => {
    return request<Order>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};

// 桌台API
export const tableApi = {
  getTables: async () => {
    return request<Table[]>('/tables');
  },

  getTable: async (id: string) => {
    return request<Table>(`/tables/${id}`);
  },

  createTable: async (table: Omit<Table, 'id'>) => {
    return request<Table>('/tables', {
      method: 'POST',
      body: JSON.stringify(table),
    });
  },

  updateTable: async (id: string, table: Partial<Table>) => {
    return request<Table>(`/tables/${id}`, {
      method: 'PUT',
      body: JSON.stringify(table),
    });
  },

  deleteTable: async (id: string) => {
    return request(`/tables/${id}`, { method: 'DELETE' });
  },
};

// 用户API
export const userApi = {
  getUsers: async (params?: {
    type?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.type) query.set('type', params.type);
    if (params?.search) query.set('search', params.search);
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());

    const queryString = query.toString();
    const endpoint = `/users${queryString ? `?${queryString}` : ''}`;
    return request<User[]>(endpoint);
  },

  getUser: async (id: string) => {
    return request<User>(`/users/${id}`);
  },

  createUser: async (user: Omit<User, 'id'>) => {
    return request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  },

  updateUser: async (id: string, user: Partial<User>) => {
    return request<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });
  },

  deleteUser: async (id: string) => {
    return request(`/users/${id}`, { method: 'DELETE' });
  },
};

// 库存API
export const inventoryApi = {
  getStockLogs: async (params?: {
    productId?: string;
    type?: StockTransactionType;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.productId) query.set('product_id', params.productId);
    if (params?.type) query.set('type', params.type);
    if (params?.startDate) query.set('start_date', params.startDate);
    if (params?.endDate) query.set('end_date', params.endDate);
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());

    const queryString = query.toString();
    const endpoint = `/inventory/logs${queryString ? `?${queryString}` : ''}`;
    return request<StockLog[]>(endpoint);
  },

  createStockLog: async (log: Omit<StockLog, 'id'>) => {
    return request<StockLog>('/inventory/logs', {
      method: 'POST',
      body: JSON.stringify(log),
    });
  },
};

// 数据分析API
export const analyticsApi = {
  getDashboardStats: async () => {
    return request<{
      totalRevenue: number;
      totalOrders: number;
      totalCustomers: number;
      totalProducts: number;
      todayRevenue: number;
      todayOrders: number;
      averageOrderValue: number;
      conversionRate: number;
    }>('/analytics/dashboard');
  },

  getSalesSummary: async (params?: {
    startDate?: string;
    endDate?: string;
    groupBy?: 'day' | 'week' | 'month';
  }) => {
    const query = new URLSearchParams();
    if (params?.startDate) query.set('start_date', params.startDate);
    if (params?.endDate) query.set('end_date', params.endDate);
    if (params?.groupBy) query.set('group_by', params.groupBy);

    const queryString = query.toString();
    const endpoint = `/analytics/sales-summary${queryString ? `?${queryString}` : ''}`;
    return request<any>(endpoint);
  },

  getTopProducts: async (params?: {
    startDate?: string;
    endDate?: string;
    limit?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.startDate) query.set('start_date', params.startDate);
    if (params?.endDate) query.set('end_date', params.endDate);
    if (params?.limit) query.set('limit', params.limit.toString());

    const queryString = query.toString();
    const endpoint = `/analytics/top-products${queryString ? `?${queryString}` : ''}`;
    return request<any>(endpoint);
  },

  getHourlySales: async (date?: string) => {
    const query = new URLSearchParams();
    if (date) query.set('date', date);

    const queryString = query.toString();
    const endpoint = `/analytics/hourly-sales${queryString ? `?${queryString}` : ''}`;
    return request<any>(endpoint);
  },
};

// 界面装修API
export const interfaceApi = {
  getPages: async (pageType?: string) => {
    const query = new URLSearchParams();
    if (pageType) query.set('page_type', pageType);

    const queryString = query.toString();
    const endpoint = `/interface/pages${queryString ? `?${queryString}` : ''}`;
    return request<any[]>(endpoint);
  },

  getPage: async (id: string) => {
    return request<any>(`/interface/pages/${id}`);
  },

  createPage: async (page: any) => {
    return request<any>('/interface/pages', {
      method: 'POST',
      body: JSON.stringify(page),
    });
  },

  updatePage: async (id: string, page: any) => {
    return request<any>(`/interface/pages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(page),
    });
  },

  deletePage: async (id: string) => {
    return request(`/interface/pages/${id}`, { method: 'DELETE' });
  },

  publishPage: async (id: string) => {
    return request<any>(`/interface/pages/${id}/publish`, {
      method: 'POST',
    });
  },

  getTemplates: async () => {
    return request<any[]>('/interface/templates');
  },

  createTemplate: async (template: any) => {
    return request<any>('/interface/templates', {
      method: 'POST',
      body: JSON.stringify(template),
    });
  },

  getThemes: async () => {
    return request<any[]>('/interface/themes');
  },

  createTheme: async (theme: any) => {
    return request<any>('/interface/themes', {
      method: 'POST',
      body: JSON.stringify(theme),
    });
  },
};

// 导出所有API
export {
  TokenManager,
  ApiError,
  NetworkError,
};