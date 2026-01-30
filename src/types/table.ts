import { TableStatus, ReservationStatus, BaseEntity } from './common';

export interface Table extends BaseEntity {
  name: string;
  status: TableStatus;
  capacity: number;
  area?: string;
  currentOrderId?: string;
}

export interface Reservation extends BaseEntity {
  tableId: string;
  customerName: string;
  customerPhone: string;
  reservationTime: string;
  guests: number;
  status: ReservationStatus;
  notes?: string;
}