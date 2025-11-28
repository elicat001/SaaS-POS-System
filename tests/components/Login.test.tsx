/**
 * Login组件单元测试
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from '../../components/Login';
import { AuthProvider } from '../../contexts/AuthContext';
import { NotificationProvider } from '../../contexts/NotificationContext';
import { authApi } from '../../services/api';

// Mock API
jest.mock('../../services/api', () => ({
  authApi: {
    login: jest.fn(),
    logout: jest.fn(),
    getCurrentUser: jest.fn(),
    isAuthenticated: jest.fn(() => false),
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

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: null }),
}));

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (authApi.isAuthenticated as jest.Mock).mockReturnValue(false);
  });

  describe('Rendering', () => {
    it('should render login form', async () => {
      renderLogin();

      await waitFor(() => {
        expect(screen.getByLabelText(/用户名/i)).toBeInTheDocument();
      });

      expect(screen.getByLabelText(/密码/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /登录/i })).toBeInTheDocument();
    });

    it('should show default credentials hint', async () => {
      renderLogin();

      await waitFor(() => {
        expect(screen.getByText(/admin/)).toBeInTheDocument();
      });
    });
  });

  describe('Form interaction', () => {
    it('should allow entering username and password', async () => {
      const user = userEvent.setup();
      renderLogin();

      await waitFor(() => {
        expect(screen.getByLabelText(/用户名/i)).toBeInTheDocument();
      });

      const usernameInput = screen.getByLabelText(/用户名/i);
      const passwordInput = screen.getByLabelText(/密码/i);

      await user.type(usernameInput, 'testuser');
      await user.type(passwordInput, 'testpassword');

      expect(usernameInput).toHaveValue('testuser');
      expect(passwordInput).toHaveValue('testpassword');
    });

    it('should toggle password visibility', async () => {
      const user = userEvent.setup();
      renderLogin();

      await waitFor(() => {
        expect(screen.getByLabelText(/密码/i)).toBeInTheDocument();
      });

      const passwordInput = screen.getByLabelText(/密码/i);
      expect(passwordInput).toHaveAttribute('type', 'password');

      // Find and click the toggle button
      const toggleButton = screen.getByRole('button', { name: '' });
      await user.click(toggleButton);

      // Password should now be visible
      expect(screen.getByLabelText(/密码/i)).toHaveAttribute('type', 'text');
    });
  });

  describe('Form submission', () => {
    it('should call login API on form submission', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        access_token: 'token',
        refresh_token: 'refresh',
        token_type: 'bearer',
        user: { id: '1', username: 'admin', name: 'Admin', role: 'admin', permissions: [] },
      };

      (authApi.login as jest.Mock).mockResolvedValue(mockResponse);

      renderLogin();

      await waitFor(() => {
        expect(screen.getByLabelText(/用户名/i)).toBeInTheDocument();
      });

      await user.type(screen.getByLabelText(/用户名/i), 'admin');
      await user.type(screen.getByLabelText(/密码/i), 'admin123');
      await user.click(screen.getByRole('button', { name: /登录/i }));

      await waitFor(() => {
        expect(authApi.login).toHaveBeenCalledWith({
          username: 'admin',
          password: 'admin123',
        });
      });
    });

    it('should show loading state while submitting', async () => {
      const user = userEvent.setup();

      // Make login take some time
      (authApi.login as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 1000))
      );

      renderLogin();

      await waitFor(() => {
        expect(screen.getByLabelText(/用户名/i)).toBeInTheDocument();
      });

      await user.type(screen.getByLabelText(/用户名/i), 'admin');
      await user.type(screen.getByLabelText(/密码/i), 'admin123');
      await user.click(screen.getByRole('button', { name: /登录/i }));

      // Should show loading state
      expect(screen.getByText(/登录中/i)).toBeInTheDocument();
    });

    it('should display error message on login failure', async () => {
      const user = userEvent.setup();
      const error = new Error('用户名或密码错误');

      (authApi.login as jest.Mock).mockRejectedValue(error);

      renderLogin();

      await waitFor(() => {
        expect(screen.getByLabelText(/用户名/i)).toBeInTheDocument();
      });

      await user.type(screen.getByLabelText(/用户名/i), 'wrong');
      await user.type(screen.getByLabelText(/密码/i), 'wrong');
      await user.click(screen.getByRole('button', { name: /登录/i }));

      await waitFor(() => {
        expect(screen.getByText(/登录失败/i)).toBeInTheDocument();
      });
    });
  });

  describe('Validation', () => {
    it('should require username and password', async () => {
      renderLogin();

      await waitFor(() => {
        expect(screen.getByLabelText(/用户名/i)).toBeInTheDocument();
      });

      const usernameInput = screen.getByLabelText(/用户名/i);
      const passwordInput = screen.getByLabelText(/密码/i);

      expect(usernameInput).toBeRequired();
      expect(passwordInput).toBeRequired();
    });
  });
});
