import { BaseEntity } from './common';

export interface Category extends BaseEntity {
  name: string;
  icon?: string;
}

export interface Product extends BaseEntity {
  name: string;
  price: number;
  costPrice?: number;
  categoryId: string;
  image?: string;
  stock: number;
  minStock?: number;
  unit: string;
  salesMode?: ('DINE_IN' | 'TAKE_OUT')[];
  isOnShelf: boolean;
  supplierId?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Supplier extends BaseEntity {
  name: string;
  contactName: string;
  phone: string;
  email?: string;
}