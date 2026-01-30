import { OrderStatus } from './common';
import { CartItem } from './product';

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