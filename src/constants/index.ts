import { Category, Product, Table, TableStatus, Order, OrderStatus, User, Reservation, ReservationStatus, Supplier, StockLog, StockTransactionType } from '@/types';

export const CATEGORIES: Category[] = [
  { id: 'c1', name: '全部', icon: 'LayoutGrid' },
  { id: 'c2', name: '店铺线下活动', icon: 'Store' },
  { id: 'c3', name: '进店福利', icon: 'Gift' },
  { id: 'c4', name: '贝果&牛角', icon: 'Croissant' },
  { id: 'c5', name: '提拉米苏', icon: 'Dessert' },
  { id: 'c6', name: '瑞士卷 (减糖)', icon: 'Swiss' },
];

// Renamed to INITIAL_PRODUCTS to signify it's the starting state
export const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', name: '2件方形切件蛋糕🍰 (口味随机)', price: 12.90, costPrice: 6.50, categoryId: 'c3', stock: 9977, minStock: 50, unit: '份', isOnShelf: true, supplierId: 'sup-001', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&q=80' },
  { id: 'p2', name: '巴斯克切件蛋糕', price: 19.90, costPrice: 8.00, categoryId: 'c3', stock: 9977, minStock: 50, unit: '份', isOnShelf: true, supplierId: 'sup-001', image: 'https://images.unsplash.com/photo-1625938144755-652e08e359b7?w=200&q=80' },
  { id: 'p3', name: '红丝绒芒果慕斯蛋糕', price: 19.90, costPrice: 9.50, categoryId: 'c4', stock: 18, minStock: 20, unit: '份', isOnShelf: true, supplierId: 'sup-002', image: 'https://images.unsplash.com/photo-1563729760304-b201b237857e?w=200&q=80' },
  { id: 'p4', name: '巧克力贝果', price: 10.80, costPrice: 4.00, categoryId: 'c4', stock: 155, minStock: 30, unit: '个', isOnShelf: true, supplierId: 'sup-002', image: 'https://images.unsplash.com/photo-1617345834028-b3580199a202?w=200&q=80' },
  { id: 'p5', name: '原味半熟芝士蛋糕', price: 6.80, costPrice: 3.00, categoryId: 'c5', stock: 500, minStock: 50, unit: '个', isOnShelf: true, supplierId: 'sup-001', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=200&q=80' },
  { id: 'p6', name: '柠檬核桃玛德琳', price: 2.00, costPrice: 0.80, categoryId: 'c5', stock: 200, minStock: 100, unit: '个', isOnShelf: true, supplierId: 'sup-003', image: 'https://images.unsplash.com/photo-1548842704-d6751b6b454d?w=200&q=80' },
  { id: 'p7', name: '海盐蛋糕 (可吃)', price: 12.89, costPrice: 6.00, categoryId: 'c6', stock: 12, minStock: 15, unit: '个', isOnShelf: false, supplierId: 'sup-003', image: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=200&q=80' },
  { id: 'p8', name: '抹茶瑞士卷', price: 8.80, costPrice: 3.50, categoryId: 'c6', stock: 1000, minStock: 50, unit: '卷', isOnShelf: true, supplierId: 'sup-001', image: 'https://images.unsplash.com/photo-1599146617646-455f8267d899?w=200&q=80' },
];

export const INITIAL_TABLES: Table[] = Array.from({ length: 10 }, (_, i) => ({
  id: `t${i + 1}`,
  name: `${i + 1}`,
  status: i === 0 ? TableStatus.AVAILABLE : (i === 1 ? TableStatus.SCANNED : TableStatus.AVAILABLE),
  capacity: i < 4 ? 2 : (i < 8 ? 4 : 8),
  area: i < 4 ? '大厅' : (i < 8 ? '包厢' : '露台')
}));

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-001',
    orderNo: '2025110211262484817',
    tableId: 't2',
    items: [{ ...INITIAL_PRODUCTS[0], quantity: 1 }],
    total: 12.90,
    totalCost: 6.50,
    status: OrderStatus.COMPLETED,
    timestamp: Date.now() - 10000000,
    type: 'DELIVERY',
    paymentMethod: 'WeChat'
  },
  {
    id: 'ord-002',
    orderNo: '2025110211262483311',
    tableId: 't5',
    items: [{ ...INITIAL_PRODUCTS[7], quantity: 2 }],
    total: 17.60,
    totalCost: 7.00,
    status: OrderStatus.PENDING,
    timestamp: Date.now() - 500000,
    type: 'DINE_IN'
  }
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: '张三', phone: '13800138000', type: 'MEMBER', balance: 120.50, points: 500, level: 2, joinDate: '2024-01-15' },
  { id: 'u2', name: '李四', phone: '13900139000', type: 'NORMAL', balance: 0, points: 0, level: 0, joinDate: '2024-11-02' },
  { id: 'u3', name: '王五', phone: '13700137000', type: 'MEMBER', balance: 15.00, points: 120, level: 1, joinDate: '2024-10-10' },
];

export const MOCK_RESERVATIONS: Reservation[] = [
  { 
    id: 'res-001', 
    tableId: 't3', 
    customerName: '王先生', 
    customerPhone: '13812345678', 
    reservationTime: new Date(new Date().setHours(18, 30)).toISOString(), // Today 18:30
    guests: 4, 
    status: ReservationStatus.CONFIRMED,
    notes: '需宝宝椅'
  },
  { 
    id: 'res-002', 
    tableId: 't8', 
    customerName: '陈小姐', 
    customerPhone: '13987654321', 
    reservationTime: new Date(new Date().setHours(19, 0)).toISOString(), // Today 19:00
    guests: 8, 
    status: ReservationStatus.PENDING 
  }
];

// --- New Inventory Mocks ---

export const MOCK_SUPPLIERS: Supplier[] = [
  { id: 'sup-001', name: '甜心烘焙原料厂', contactName: '刘经理', phone: '13500001111', email: 'supply@bakery.com' },
  { id: 'sup-002', name: '新鲜果园供应链', contactName: '张主管', phone: '13600002222', email: 'fruit@fresh.com' },
  { id: 'sup-003', name: '优选面粉工坊', contactName: '王工', phone: '13700003333' },
];

export const MOCK_STOCK_LOGS: StockLog[] = [
  { 
    id: 'log-1', 
    productId: 'p3', 
    productName: '红丝绒芒果慕斯蛋糕', 
    type: StockTransactionType.OUT_SALE, 
    delta: -2, 
    currentStock: 18, 
    operator: '系统', 
    timestamp: Date.now() - 3600000 
  },
  { 
    id: 'log-2', 
    productId: 'p1', 
    productName: '2件方形切件蛋糕', 
    type: StockTransactionType.IN_PURCHASE, 
    delta: 100, 
    currentStock: 9977, 
    operator: '张店长', 
    timestamp: Date.now() - 86400000,
    note: '日常补货'
  }
];