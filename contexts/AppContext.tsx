/**
 * 应用全局状态上下文 - 管理业务数据状态
 */

import React, { createContext, useContext, useReducer, useCallback, useEffect, ReactNode } from 'react';
import {
  Product, Category, Supplier, Table, Order, User,
  Reservation, StockLog, StockTransactionType, OrderStatus, TableStatus
} from '../types';
import {
  productApi, categoryApi, supplierApi, tableApi, orderApi,
  userApi, reservationApi, inventoryApi, ApiError
} from '../services/api';
import { useNotification } from './NotificationContext';
import { useAuth } from './AuthContext';

// 应用状态接口
interface AppState {
  // 数据
  products: Product[];
  categories: Category[];
  suppliers: Supplier[];
  tables: Table[];
  orders: Order[];
  users: User[];
  reservations: Reservation[];
  stockLogs: StockLog[];

  // 加载状态
  loading: {
    products: boolean;
    categories: boolean;
    suppliers: boolean;
    tables: boolean;
    orders: boolean;
    users: boolean;
    reservations: boolean;
    stockLogs: boolean;
    global: boolean;
  };

  // 错误状态
  errors: {
    products: string | null;
    categories: string | null;
    suppliers: string | null;
    tables: string | null;
    orders: string | null;
    users: string | null;
    reservations: string | null;
    stockLogs: string | null;
  };

  // 初始化状态
  initialized: boolean;
}

// Action类型
type ActionType =
  | { type: 'SET_LOADING'; payload: { key: keyof AppState['loading']; value: boolean } }
  | { type: 'SET_ERROR'; payload: { key: keyof AppState['errors']; value: string | null } }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'SET_SUPPLIERS'; payload: Supplier[] }
  | { type: 'ADD_SUPPLIER'; payload: Supplier }
  | { type: 'SET_TABLES'; payload: Table[] }
  | { type: 'UPDATE_TABLE'; payload: Table }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER'; payload: Order }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'SET_RESERVATIONS'; payload: Reservation[] }
  | { type: 'ADD_RESERVATION'; payload: Reservation }
  | { type: 'SET_STOCK_LOGS'; payload: StockLog[] }
  | { type: 'ADD_STOCK_LOG'; payload: StockLog }
  | { type: 'SET_INITIALIZED'; payload: boolean }
  | { type: 'RESET_STATE' };

// 初始状态
const initialState: AppState = {
  products: [],
  categories: [],
  suppliers: [],
  tables: [],
  orders: [],
  users: [],
  reservations: [],
  stockLogs: [],
  loading: {
    products: false,
    categories: false,
    suppliers: false,
    tables: false,
    orders: false,
    users: false,
    reservations: false,
    stockLogs: false,
    global: false,
  },
  errors: {
    products: null,
    categories: null,
    suppliers: null,
    tables: null,
    orders: null,
    users: null,
    reservations: null,
    stockLogs: null,
  },
  initialized: false,
};

// Reducer
function appReducer(state: AppState, action: ActionType): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: { ...state.loading, [action.payload.key]: action.payload.value },
      };

    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.payload.key]: action.payload.value },
      };

    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };

    case 'ADD_PRODUCT':
      return { ...state, products: [action.payload, ...state.products] };

    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.payload.id ? action.payload : p
        ),
      };

    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload),
      };

    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };

    case 'SET_SUPPLIERS':
      return { ...state, suppliers: action.payload };

    case 'ADD_SUPPLIER':
      return { ...state, suppliers: [...state.suppliers, action.payload] };

    case 'SET_TABLES':
      return { ...state, tables: action.payload };

    case 'UPDATE_TABLE':
      return {
        ...state,
        tables: state.tables.map(t =>
          t.id === action.payload.id ? action.payload : t
        ),
      };

    case 'SET_ORDERS':
      return { ...state, orders: action.payload };

    case 'ADD_ORDER':
      return { ...state, orders: [action.payload, ...state.orders] };

    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(o =>
          o.id === action.payload.id ? action.payload : o
        ),
      };

    case 'SET_USERS':
      return { ...state, users: action.payload };

    case 'SET_RESERVATIONS':
      return { ...state, reservations: action.payload };

    case 'ADD_RESERVATION':
      return { ...state, reservations: [action.payload, ...state.reservations] };

    case 'SET_STOCK_LOGS':
      return { ...state, stockLogs: action.payload };

    case 'ADD_STOCK_LOG':
      return { ...state, stockLogs: [action.payload, ...state.stockLogs] };

    case 'SET_INITIALIZED':
      return { ...state, initialized: action.payload };

    case 'RESET_STATE':
      return initialState;

    default:
      return state;
  }
}

// 上下文接口
interface AppContextType extends AppState {
  // 数据获取
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchSuppliers: () => Promise<void>;
  fetchTables: () => Promise<void>;
  fetchOrders: (params?: { status?: string }) => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchReservations: () => Promise<void>;
  fetchStockLogs: () => Promise<void>;
  initializeData: () => Promise<void>;

  // 商品操作
  createProduct: (data: Partial<Product>) => Promise<Product>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  // 库存操作
  updateStock: (productId: string, delta: number, type: StockTransactionType, note?: string) => Promise<void>;

  // 订单操作
  createOrder: (tableId: string, items: any[], total: number, type: Order['type']) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;

  // 桌台操作
  updateTableStatus: (tableId: string, status: TableStatus, orderId?: string) => Promise<void>;

  // 供应商操作
  addSupplier: (supplier: Supplier) => Promise<void>;

  // 预订操作
  addReservation: (reservation: Omit<Reservation, 'id'>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { error: showError, success: showSuccess } = useNotification();
  const { isAuthenticated } = useAuth();

  // 通用错误处理
  const handleError = useCallback((key: keyof AppState['errors'], error: unknown) => {
    const message = error instanceof ApiError ? error.message : '操作失败，请稍后重试';
    dispatch({ type: 'SET_ERROR', payload: { key, value: message } });
    showError('错误', message);
  }, [showError]);

  // 获取商品列表
  const fetchProducts = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'products', value: true } });
    dispatch({ type: 'SET_ERROR', payload: { key: 'products', value: null } });

    try {
      const products = await productApi.list();
      dispatch({ type: 'SET_PRODUCTS', payload: products });
    } catch (error) {
      handleError('products', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'products', value: false } });
    }
  }, [handleError]);

  // 获取分类列表
  const fetchCategories = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'categories', value: true } });

    try {
      const categories = await categoryApi.list();
      dispatch({ type: 'SET_CATEGORIES', payload: categories });
    } catch (error) {
      handleError('categories', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'categories', value: false } });
    }
  }, [handleError]);

  // 获取供应商列表
  const fetchSuppliers = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'suppliers', value: true } });

    try {
      const suppliers = await supplierApi.list();
      dispatch({ type: 'SET_SUPPLIERS', payload: suppliers });
    } catch (error) {
      handleError('suppliers', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'suppliers', value: false } });
    }
  }, [handleError]);

  // 获取桌台列表
  const fetchTables = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'tables', value: true } });

    try {
      const tables = await tableApi.list();
      dispatch({ type: 'SET_TABLES', payload: tables });
    } catch (error) {
      handleError('tables', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'tables', value: false } });
    }
  }, [handleError]);

  // 获取订单列表
  const fetchOrders = useCallback(async (params?: { status?: string }) => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'orders', value: true } });

    try {
      const orders = await orderApi.list(params);
      dispatch({ type: 'SET_ORDERS', payload: orders });
    } catch (error) {
      handleError('orders', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'orders', value: false } });
    }
  }, [handleError]);

  // 获取用户列表
  const fetchUsers = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'users', value: true } });

    try {
      const users = await userApi.list();
      dispatch({ type: 'SET_USERS', payload: users });
    } catch (error) {
      handleError('users', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'users', value: false } });
    }
  }, [handleError]);

  // 获取预订列表
  const fetchReservations = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'reservations', value: true } });

    try {
      const reservations = await reservationApi.list();
      dispatch({ type: 'SET_RESERVATIONS', payload: reservations });
    } catch (error) {
      handleError('reservations', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'reservations', value: false } });
    }
  }, [handleError]);

  // 获取库存日志
  const fetchStockLogs = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'stockLogs', value: true } });

    try {
      const logs = await inventoryApi.getLogs();
      dispatch({ type: 'SET_STOCK_LOGS', payload: logs });
    } catch (error) {
      handleError('stockLogs', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'stockLogs', value: false } });
    }
  }, [handleError]);

  // 初始化所有数据
  const initializeData = useCallback(async () => {
    if (state.initialized) return;

    dispatch({ type: 'SET_LOADING', payload: { key: 'global', value: true } });

    try {
      await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchSuppliers(),
        fetchTables(),
        fetchOrders(),
        fetchUsers(),
        fetchReservations(),
        fetchStockLogs(),
      ]);
      dispatch({ type: 'SET_INITIALIZED', payload: true });
    } catch {
      // 错误已在各个fetch函数中处理
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'global', value: false } });
    }
  }, [state.initialized, fetchProducts, fetchCategories, fetchSuppliers, fetchTables, fetchOrders, fetchUsers, fetchReservations, fetchStockLogs]);

  // 创建商品
  const createProduct = useCallback(async (data: Partial<Product>): Promise<Product> => {
    const product = await productApi.create(data as any);
    dispatch({ type: 'ADD_PRODUCT', payload: product });
    showSuccess('成功', '商品创建成功');
    return product;
  }, [showSuccess]);

  // 更新商品
  const updateProduct = useCallback(async (product: Product) => {
    await productApi.update(product.id, product);
    dispatch({ type: 'UPDATE_PRODUCT', payload: product });
    showSuccess('成功', '商品更新成功');
  }, [showSuccess]);

  // 删除商品
  const deleteProduct = useCallback(async (id: string) => {
    await productApi.delete(id);
    dispatch({ type: 'DELETE_PRODUCT', payload: id });
    showSuccess('成功', '商品删除成功');
  }, [showSuccess]);

  // 更新库存
  const updateStock = useCallback(async (
    productId: string,
    delta: number,
    type: StockTransactionType,
    note?: string
  ) => {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    // 创建库存日志
    const newLog: StockLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      productId,
      productName: product.name,
      type,
      delta,
      currentStock: product.stock + delta,
      operator: '当前用户', // TODO: 从auth context获取
      timestamp: Date.now(),
      note,
    };

    try {
      await inventoryApi.createLog(newLog);
      dispatch({ type: 'ADD_STOCK_LOG', payload: newLog });

      // 更新商品库存
      const updatedProduct = { ...product, stock: product.stock + delta };
      dispatch({ type: 'UPDATE_PRODUCT', payload: updatedProduct });
    } catch (error) {
      handleError('stockLogs', error);
      throw error;
    }
  }, [state.products, handleError]);

  // 创建订单
  const createOrder = useCallback(async (
    tableId: string,
    items: any[],
    total: number,
    type: Order['type']
  ): Promise<Order> => {
    // 计算成本
    const totalCost = items.reduce((sum, item) => {
      const product = state.products.find(p => p.id === item.id);
      return sum + ((product?.costPrice || 0) * item.quantity);
    }, 0);

    const orderData = {
      orderNo: `${Date.now()}`,
      tableId,
      items: items.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        costPrice: item.costPrice,
        image: item.image,
        unit: item.unit,
        quantity: item.quantity,
      })),
      total,
      totalCost,
      status: OrderStatus.PENDING,
      timestamp: Date.now(),
      type,
    };

    try {
      const order = await orderApi.create(orderData as any);
      dispatch({ type: 'ADD_ORDER', payload: order });

      // 更新桌台状态
      if (tableId !== 'Quick') {
        await updateTableStatus(tableId, TableStatus.SCANNED, order.id);
      }

      // 扣减库存
      for (const item of items) {
        await updateStock(
          item.id,
          -item.quantity,
          StockTransactionType.OUT_SALE,
          `订单销售: ${order.orderNo}`
        );
      }

      showSuccess('成功', '订单创建成功');
      return order;
    } catch (error) {
      handleError('orders', error);
      throw error;
    }
  }, [state.products, updateStock, showSuccess, handleError]);

  // 更新订单状态
  const updateOrderStatus = useCallback(async (orderId: string, status: OrderStatus) => {
    try {
      const order = await orderApi.updateStatus(orderId, status);
      dispatch({ type: 'UPDATE_ORDER', payload: order });
      showSuccess('成功', '订单状态更新成功');
    } catch (error) {
      handleError('orders', error);
      throw error;
    }
  }, [showSuccess, handleError]);

  // 更新桌台状态
  const updateTableStatus = useCallback(async (
    tableId: string,
    status: TableStatus,
    orderId?: string
  ) => {
    try {
      const table = await tableApi.update(tableId, {
        status,
        currentOrderId: orderId,
      });
      dispatch({ type: 'UPDATE_TABLE', payload: table });
    } catch (error) {
      handleError('tables', error);
      throw error;
    }
  }, [handleError]);

  // 添加供应商
  const addSupplier = useCallback(async (supplier: Supplier) => {
    try {
      const newSupplier = await supplierApi.create(supplier);
      dispatch({ type: 'ADD_SUPPLIER', payload: newSupplier });
      showSuccess('成功', '供应商添加成功');
    } catch (error) {
      handleError('suppliers', error);
      throw error;
    }
  }, [showSuccess, handleError]);

  // 添加预订
  const addReservation = useCallback(async (reservation: Omit<Reservation, 'id'>) => {
    try {
      const newReservation = await reservationApi.create(reservation as any);
      dispatch({ type: 'ADD_RESERVATION', payload: newReservation });
      showSuccess('成功', '预订添加成功');
    } catch (error) {
      handleError('reservations', error);
      throw error;
    }
  }, [showSuccess, handleError]);

  // 当认证状态改变时重置数据
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch({ type: 'RESET_STATE' });
    }
  }, [isAuthenticated]);

  const value: AppContextType = {
    ...state,
    fetchProducts,
    fetchCategories,
    fetchSuppliers,
    fetchTables,
    fetchOrders,
    fetchUsers,
    fetchReservations,
    fetchStockLogs,
    initializeData,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    createOrder,
    updateOrderStatus,
    updateTableStatus,
    addSupplier,
    addReservation,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Hook
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
