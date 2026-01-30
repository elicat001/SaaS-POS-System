import { StockTransactionType, BaseEntity } from './common';

export interface StockLog extends BaseEntity {
  productId: string;
  productName: string;
  type: StockTransactionType;
  delta: number;
  currentStock: number;
  operator: string;
  timestamp: number;
  note?: string;
}