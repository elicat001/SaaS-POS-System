/**
 * API服务层单元测试
 */

import { ApiError, NetworkError, TokenManager, authApi, productApi, orderApi } from '../../services/api';

// Mock fetch
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    TokenManager.clearTokens();
  });

  describe('TokenManager', () => {
    it('should store and retrieve tokens', () => {
      expect(TokenManager.isAuthenticated()).toBe(false);

      TokenManager.setToken('test-token');
      expect(TokenManager.getToken()).toBe('test-token');
      expect(TokenManager.isAuthenticated()).toBe(true);
    });

    it('should clear tokens', () => {
      TokenManager.setToken('test-token');
      TokenManager.setRefreshToken('refresh-token');

      TokenManager.clearTokens();

      expect(TokenManager.getToken()).toBeNull();
      expect(TokenManager.getRefreshToken()).toBeNull();
      expect(TokenManager.isAuthenticated()).toBe(false);
    });
  });

  describe('Error Classes', () => {
    it('should create ApiError with correct properties', () => {
      const error = new ApiError('Test error', 400, 'TEST_CODE', { detail: 'info' });

      expect(error.message).toBe('Test error');
      expect(error.status).toBe(400);
      expect(error.code).toBe('TEST_CODE');
      expect(error.details).toEqual({ detail: 'info' });
      expect(error.name).toBe('ApiError');
    });

    it('should create NetworkError with default message', () => {
      const error = new NetworkError();

      expect(error.message).toBe('网络连接失败，请检查网络设置');
      expect(error.name).toBe('NetworkError');
    });
  });

  describe('authApi', () => {
    describe('login', () => {
      it('should login successfully and store tokens', async () => {
        const mockResponse = {
          access_token: 'access-123',
          refresh_token: 'refresh-123',
          token_type: 'bearer',
          user: {
            id: '1',
            username: 'admin',
            name: 'Admin',
            role: 'admin',
            permissions: ['all'],
          },
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockResponse,
        } as Response);

        const result = await authApi.login({ username: 'admin', password: 'password' });

        expect(result).toEqual(mockResponse);
        expect(TokenManager.getToken()).toBe('access-123');
        expect(TokenManager.getRefreshToken()).toBe('refresh-123');
      });

      it('should throw ApiError on invalid credentials', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 401,
          json: async () => ({ detail: '用户名或密码错误' }),
        } as Response);

        await expect(authApi.login({ username: 'wrong', password: 'wrong' }))
          .rejects.toThrow(ApiError);
      });
    });

    describe('logout', () => {
      it('should clear tokens on logout', async () => {
        TokenManager.setToken('test-token');
        TokenManager.setRefreshToken('refresh-token');

        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({}),
        } as Response);

        await authApi.logout();

        expect(TokenManager.getToken()).toBeNull();
        expect(TokenManager.getRefreshToken()).toBeNull();
      });

      it('should clear tokens even if logout request fails', async () => {
        TokenManager.setToken('test-token');

        mockFetch.mockRejectedValueOnce(new Error('Network error'));

        await authApi.logout();

        expect(TokenManager.getToken()).toBeNull();
      });
    });
  });

  describe('productApi', () => {
    beforeEach(() => {
      TokenManager.setToken('test-token');
    });

    describe('list', () => {
      it('should fetch products list', async () => {
        const mockProducts = [
          { id: '1', name: 'Product 1', price: 10 },
          { id: '2', name: 'Product 2', price: 20 },
        ];

        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockProducts,
        } as Response);

        const result = await productApi.list();

        expect(result).toEqual(mockProducts);
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/products/'),
          expect.objectContaining({
            method: 'GET',
            headers: expect.objectContaining({
              'Authorization': 'Bearer test-token',
            }),
          })
        );
      });
    });

    describe('create', () => {
      it('should create a new product', async () => {
        const newProduct = {
          name: 'New Product',
          price: 15,
          categoryId: 'cat-1',
          stock: 100,
          unit: '个',
        };

        const mockResponse = { id: '3', ...newProduct };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 201,
          json: async () => mockResponse,
        } as Response);

        const result = await productApi.create(newProduct);

        expect(result).toEqual(mockResponse);
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/products/'),
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(newProduct),
          })
        );
      });
    });

    describe('update', () => {
      it('should update a product', async () => {
        const updateData = { price: 25 };
        const mockResponse = { id: '1', name: 'Product 1', price: 25 };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockResponse,
        } as Response);

        const result = await productApi.update('1', updateData);

        expect(result).toEqual(mockResponse);
      });
    });

    describe('delete', () => {
      it('should delete a product', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 204,
          json: async () => ({}),
        } as Response);

        await productApi.delete('1');

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/products/1'),
          expect.objectContaining({ method: 'DELETE' })
        );
      });
    });
  });

  describe('orderApi', () => {
    beforeEach(() => {
      TokenManager.setToken('test-token');
    });

    describe('list', () => {
      it('should fetch orders with filters', async () => {
        const mockOrders = [{ id: '1', orderNo: '001', total: 100 }];

        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockOrders,
        } as Response);

        const result = await orderApi.list({ status: 'PENDING' });

        expect(result).toEqual(mockOrders);
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('status=PENDING'),
          expect.anything()
        );
      });
    });

    describe('create', () => {
      it('should create a new order', async () => {
        const orderData = {
          orderNo: '12345',
          tableId: 't1',
          items: [{ productId: 'p1', name: 'Item 1', price: 10, unit: '个', quantity: 2 }],
          status: 'PENDING',
          timestamp: Date.now(),
          type: 'DINE_IN' as const,
        };

        const mockResponse = { id: 'ord-1', ...orderData };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 201,
          json: async () => mockResponse,
        } as Response);

        const result = await orderApi.create(orderData);

        expect(result).toEqual(mockResponse);
      });
    });
  });

  describe('Request handling', () => {
    it('should handle 401 unauthorized and clear tokens', async () => {
      TokenManager.setToken('expired-token');

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ detail: 'Unauthorized' }),
      } as Response);

      await expect(productApi.list()).rejects.toThrow(ApiError);
      expect(TokenManager.getToken()).toBeNull();
    });

    it('should handle network errors', async () => {
      TokenManager.setToken('test-token');

      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(productApi.list()).rejects.toThrow(NetworkError);
    });

    it('should handle timeout', async () => {
      TokenManager.setToken('test-token');

      // Simulate abort error
      const abortError = new Error('Aborted');
      abortError.name = 'AbortError';
      mockFetch.mockRejectedValueOnce(abortError);

      await expect(productApi.list()).rejects.toThrow('请求超时');
    });
  });
});
