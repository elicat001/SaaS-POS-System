// 通用枚举和基础类型

export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

export enum TableStatus {
  AVAILABLE = 'AVAILABLE',
  SCANNED = 'SCANNED',
  UNPAID = 'UNPAID',
  PAID = 'PAID'
}

export enum ReservationStatus {
  CONFIRMED = 'CONFIRMED',
  PENDING = 'PENDING',
  ARRIVED = 'ARRIVED',
  CANCELLED = 'CANCELLED'
}

export enum StockTransactionType {
  IN_PURCHASE = '采购入库',
  IN_RETURN = '退货入库',
  OUT_SALE = '销售出库',
  OUT_LOSS = '损耗出库',
  ADJUSTMENT = '库存盘点'
}

// 基础接口
export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}