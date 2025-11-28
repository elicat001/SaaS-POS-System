/**
 * AuthContext 单元测试
 */

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth, PERMISSIONS } from '../../contexts/AuthContext';
import { authApi, TokenManager } from '../../services/api';

// Mock API
jest.mock('../../services/api', () => ({
  authApi: {
    login: jest.fn(),
    logout: jest.fn(),
    getCurrentUser: jest.fn(),
    isAuthenticated: jest.fn(),
    clearAuth: jest.fn(),
  },
  TokenManager: {
    clearTokens: jest.fn(),
  },
  ApiError: class ApiError extends Error {
    constructor(message: string, public status: number) {
      super(message);
    }
  },
}));

// Test component that uses the auth context
const TestComponent: React.FC = () => {
  const { user, isAuthenticated, isLoading, error, login, logout, hasPermission, hasRole } = useAuth();

  return (
    <div>
      <div data-testid="loading">{isLoading ? 'loading' : 'not-loading'}</div>
      <div data-testid="authenticated">{isAuthenticated ? 'yes' : 'no'}</div>
      <div data-testid="user">{user?.name || 'no-user'}</div>
      <div data-testid="error">{error || 'no-error'}</div>
      <div data-testid="has-admin">{hasRole('admin') ? 'yes' : 'no'}</div>
      <div data-testid="has-permission">{hasPermission(PERMISSIONS.PRODUCT_VIEW) ? 'yes' : 'no'}</div>

      <button onClick={() => login({ username: 'test', password: 'test' })}>Login</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  const mockUser = {
    id: '1',
    username: 'admin',
    name: 'Admin User',
    role: 'admin' as const,
    permissions: ['product:view', 'order:view'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (authApi.isAuthenticated as jest.Mock).mockReturnValue(false);
  });

  describe('Initial state', () => {
    it('should render with initial unauthenticated state', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });

      expect(screen.getByTestId('authenticated')).toHaveTextContent('no');
      expect(screen.getByTestId('user')).toHaveTextContent('no-user');
    });

    it('should check for existing auth on mount', async () => {
      (authApi.isAuthenticated as jest.Mock).mockReturnValue(true);
      (authApi.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('yes');
      });

      expect(screen.getByTestId('user')).toHaveTextContent('Admin User');
    });
  });

  describe('Login', () => {
    it('should login successfully', async () => {
      const user = userEvent.setup();
      const loginResponse = {
        access_token: 'token',
        refresh_token: 'refresh',
        token_type: 'bearer',
        user: mockUser,
      };

      (authApi.login as jest.Mock).mockResolvedValue(loginResponse);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });

      await user.click(screen.getByText('Login'));

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('yes');
      });

      expect(screen.getByTestId('user')).toHaveTextContent('Admin User');
      expect(authApi.login).toHaveBeenCalledWith({ username: 'test', password: 'test' });
    });

    it('should handle login error', async () => {
      const user = userEvent.setup();
      const error = new Error('Invalid credentials');
      (error as any).status = 401;

      (authApi.login as jest.Mock).mockRejectedValue(error);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });

      await user.click(screen.getByText('Login'));

      await waitFor(() => {
        expect(screen.getByTestId('error')).not.toHaveTextContent('no-error');
      });

      expect(screen.getByTestId('authenticated')).toHaveTextContent('no');
    });
  });

  describe('Logout', () => {
    it('should logout successfully', async () => {
      const user = userEvent.setup();

      // Start authenticated
      (authApi.isAuthenticated as jest.Mock).mockReturnValue(true);
      (authApi.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
      (authApi.logout as jest.Mock).mockResolvedValue(undefined);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('yes');
      });

      await user.click(screen.getByText('Logout'));

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('no');
      });

      expect(screen.getByTestId('user')).toHaveTextContent('no-user');
    });
  });

  describe('Permission checking', () => {
    it('should check permissions correctly', async () => {
      (authApi.isAuthenticated as jest.Mock).mockReturnValue(true);
      (authApi.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('yes');
      });

      // Admin has all permissions
      expect(screen.getByTestId('has-admin')).toHaveTextContent('yes');
      expect(screen.getByTestId('has-permission')).toHaveTextContent('yes');
    });

    it('should deny permissions for unauthenticated users', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });

      expect(screen.getByTestId('has-admin')).toHaveTextContent('no');
      expect(screen.getByTestId('has-permission')).toHaveTextContent('no');
    });
  });
});
