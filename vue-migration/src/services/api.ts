import type {
  Product, Category, Supplier, Table, User, Order,
  Reservation, StockLog, StockTransactionType, AuthUser,
  LoginRequest, ApiResponse, PaginatedResponse
} from '@/types'

// API配置
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
const REQUEST_TIMEOUT = 10000 // 10秒超时

// 自定义错误类
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// 网络错误
export class NetworkError extends Error {
  constructor(message: string = '网络连接失败，请检查网络设置') {
    super(message)
    this.name = 'NetworkError'
  }
}

// Token管理
class TokenManager {
  private static TOKEN_KEY = 'auth_token'
  private static REFRESH_TOKEN_KEY = 'refresh_token'

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token)
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY)
  }

  static setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token)
  }

  static clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.REFRESH_TOKEN_KEY)
  }

  static isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

// 基础请求函数
async function request<T>(
  endpoint: string,
  config: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`

  // 构建请求头
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...config.headers,
  }

  // 添加认证token
  const token = TokenManager.getToken()
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }

  try {
    const response = await fetch(url, {
      ...config,
      headers,
    })

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
        throw new ApiError(errorMessage, response.status, errorData.code, errorData.details)
      } catch {
        throw new ApiError(errorMessage, response.status)
      }
    }

    const data: ApiResponse<T> = await response.json()
    
    if (!data.success) {
      throw new ApiError(data.message || '请求失败', response.status)
    }

    return data.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new NetworkError()
    }
    throw new ApiError('请求失败', 0, 'NETWORK_ERROR')
  }
}

// 认证API
export const authApi = {
  async login(credentials: LoginRequest): Promise<AuthUser> {
    const data = await request<AuthUser>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    
    // 假设响应中包含token
    if ((data as any).token) {
      TokenManager.setToken((data as any).token)
    }
    
    return data
  },

  async logout(): Promise<void> {
    try {
      await request('/auth/logout', { method: 'POST' })
    } finally {
      TokenManager.clearTokens()
    }
  },

  async getCurrentUser(): Promise<AuthUser> {
    return request<AuthUser>('/auth/me')
  },

  isAuthenticated(): boolean {
    return TokenManager.isAuthenticated()
  },

  clearAuth(): void {
    TokenManager.clearTokens()
  },
}

// 商品API
export const productApi = {
  async list(): Promise<Product[]> {
    return request<Product[]>('/products')
  },

  async get(id: string): Promise<Product> {
    return request<Product>(`/products/${id}`)
  },

  async create(data: Omit<Product, 'id'>): Promise<Product> {
    return request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async update(id: string, data: Partial<Product>): Promise<Product> {
    return request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async delete(id: string): Promise<void> {
    await request(`/products/${id}`, { method: 'DELETE' })
  },

  async updateStock(id: string, delta: number, type: StockTransactionType, note?: string): Promise<Product> {
    return request<Product>(`/products/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ delta, type, note }),
    })
  },
}

// 桌台API
export const tableApi = {
  async list(): Promise<Table[]> {
    return request<Table[]>('/tables')
  },

  async get(id: string): Promise<Table> {
    return request<Table>(`/tables/${id}`)
  },

  async create(data: Omit<Table, 'id'>): Promise<Table> {
    return request<Table>('/tables', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async update(id: string, data: Partial<Table>): Promise<Table> {
    return request<Table>(`/tables/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async delete(id: string): Promise<void> {
    await request(`/tables/${id}`, { method: 'DELETE' })
  },

  async updateStatus(id: string, status: string): Promise<Table> {
    return request<Table>(`/tables/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  },
}

// 订单API
export const orderApi = {
  async list(params?: { status?: string; startDate?: number; endDate?: number }): Promise<Order[]> {
    const query = new URLSearchParams()
    if (params?.status) query.append('status', params.status)
    if (params?.startDate) query.append('startDate', params.startDate.toString())
    if (params?.endDate) query.append('endDate', params.endDate.toString())
    
    const queryString = query.toString()
    return request<Order[]>(`/orders${queryString ? `?${queryString}` : ''}`)
  },

  async get(id: string): Promise<Order> {
    return request<Order>(`/orders/${id}`)
  },

  async create(data: Omit<Order, 'id' | 'orderNo' | 'timestamp' | 'status'>): Promise<Order> {
    return request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updateStatus(id: string, status: string): Promise<Order> {
    return request<Order>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  },

  async cancel(id: string, reason?: string): Promise<Order> {
    return request<Order>(`/orders/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    })
  },

  async refund(id: string, amount?: number): Promise<Order> {
    return request<Order>(`/orders/${id}/refund`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    })
  },
}

// 供应商API
export const supplierApi = {
  async list(): Promise<Supplier[]> {
    return request<Supplier[]>('/suppliers')
  },

  async get(id: string): Promise<Supplier> {
    return request<Supplier>(`/suppliers/${id}`)
  },

  async create(data: Omit<Supplier, 'id'>): Promise<Supplier> {
    return request<Supplier>('/suppliers', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async update(id: string, data: Partial<Supplier>): Promise<Supplier> {
    return request<Supplier>(`/suppliers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async delete(id: string): Promise<void> {
    await request(`/suppliers/${id}`, { method: 'DELETE' })
  },
}

// 库存API
export const inventoryApi = {
  async getLogs(params?: { productId?: string; type?: string; startDate?: number; endDate?: number }): Promise<StockLog[]> {
    const query = new URLSearchParams()
    if (params?.productId) query.append('productId', params.productId)
    if (params?.type) query.append('type', params.type)
    if (params?.startDate) query.append('startDate', params.startDate.toString())
    if (params?.endDate) query.append('endDate', params.endDate.toString())
    
    const queryString = query.toString()
    return request<StockLog[]>(`/inventory/logs${queryString ? `?${queryString}` : ''}`)
  },

  async createLog(data: Omit<StockLog, 'id' | 'timestamp'>): Promise<StockLog> {
    return request<StockLog>('/inventory/logs', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async getLowStockProducts(): Promise<Product[]> {
    return request<Product[]>('/inventory/low-stock')
  },

  async getStockValue(): Promise<{ totalValue: number }> {
    return request<{ totalValue: number }>('/inventory/value')
  },
}

// 用户API
export const userApi = {
  async list(): Promise<User[]> {
    return request<User[]>('/users')
  },

  async get(id: string): Promise<User> {
    return request<User>(`/users/${id}`)
  },

  async create(data: Omit<User, 'id' | 'joinDate'>): Promise<User> {
    return request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async update(id: string, data: Partial<User>): Promise<User> {
    return request<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async delete(id: string): Promise<void> {
    await request(`/users/${id}`, { method: 'DELETE' })
  },

  async recharge(id: string, amount: number): Promise<User> {
    return request<User>(`/users/${id}/recharge`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    })
  },
}

// 分类API
export const categoryApi = {
  async list(): Promise<Category[]> {
    return request<Category[]>('/categories')
  },

  async get(id: string): Promise<Category> {
    return request<Category>(`/categories/${id}`)
  },

  async create(data: Omit<Category, 'id'>): Promise<Category> {
    return request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async update(id: string, data: Partial<Category>): Promise<Category> {
    return request<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async delete(id: string): Promise<void> {
    await request(`/categories/${id}`, { method: 'DELETE' })
  },
}

// 导出TokenManager
export { TokenManager }