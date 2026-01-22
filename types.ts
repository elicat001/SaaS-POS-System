
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

export interface Category {
  id: string;
  name: string;
  icon?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  costPrice?: number; // New: Cost price for profit calculation
  categoryId: string;
  image?: string;
  stock: number;
  minStock?: number; // New: Low stock alert threshold
  unit: string;
  salesMode?: ('DINE_IN' | 'TAKE_OUT')[];
  isOnShelf: boolean;
  supplierId?: string; // New: Link to supplier
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  orderNo: string;
  tableId: string;
  items: CartItem[];
  total: number;
  totalCost?: number; // Added for profit calculation
  status: OrderStatus;
  paymentMethod?: string;
  timestamp: number;
  type: 'DINE_IN' | 'DELIVERY' | 'PICKUP';
}

export interface Table {
  id: string;
  name: string;
  status: TableStatus;
  capacity: number;
  area?: string;
  currentOrderId?: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  type: 'MEMBER' | 'NORMAL';
  balance: number;
  points: number;
  level: number;
  joinDate: string;
}

export interface Reservation {
  id: string;
  tableId: string;
  customerName: string;
  customerPhone: string;
  reservationTime: string; // ISO string or formatted date string
  guests: number;
  status: ReservationStatus;
  notes?: string;
}

// --- New Inventory Types ---

export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  phone: string;
  email?: string;
}

export enum StockTransactionType {
  IN_PURCHASE = '采购入库',
  IN_RETURN = '退货入库',
  OUT_SALE = '销售出库',
  OUT_LOSS = '损耗出库',
  ADJUSTMENT = '库存盘点'
}

export interface StockLog {
  id: string;
  productId: string;
  productName: string;
  type: StockTransactionType;
  delta: number; // Positive for IN, Negative for OUT
  currentStock: number; // Snapshot after change
  operator: string;
  timestamp: number;
  note?: string;
}

// ==================== 界面装修类型 ====================

export type WidgetType =
  | 'SEARCH'
  | 'BANNER'
  | 'GRID_NAV'
  | 'NOTICE'
  | 'PRODUCT_FEED'
  | 'TITLE'
  | 'SPACER'
  | 'STORE_INFO'
  | 'MEMBER_CARD'
  | 'COUPON'
  | 'HOT_PRODUCTS'
  | 'CATEGORY_NAV'
  | 'FLASH_SALE'
  | 'IMAGE'
  | 'VIDEO'
  | 'DIVIDER'
  | 'RICH_TEXT'
  | 'TABS'
  | 'COUNTDOWN'
  | 'MAP';

export interface InterfaceWidget {
  id: string;
  pageId: string;
  widgetType: WidgetType;
  name?: string;
  props: Record<string, unknown>;
  style?: Record<string, unknown>;
  sortOrder: number;
  isVisible: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface InterfacePage {
  id: string;
  pageType: 'home' | 'user' | 'order' | 'category' | 'product_detail';
  name: string;
  description?: string;
  backgroundColor: string;
  backgroundImage?: string;
  isPublished: boolean;
  publishedAt?: string;
  version: number;
  widgets: InterfaceWidget[];
  createdAt?: string;
  updatedAt?: string;
}

export interface InterfaceTemplate {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  category: 'official' | 'custom' | 'industry';
  industry?: string;
  pageType: string;
  config: PageConfigSnapshot;
  isSystem: boolean;
  useCount: number;
  createdAt?: string;
}

export interface InterfaceTheme {
  id: string;
  name: string;
  description?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  backgroundColor: string;
  borderRadius: string;
  fontFamily: string;
  customCss?: string;
  isActive: boolean;
  isSystem: boolean;
  createdAt?: string;
}

export interface InterfaceHistory {
  id: string;
  pageId: string;
  version: number;
  config: PageConfigSnapshot;
  operationType: 'create' | 'update' | 'publish' | 'restore';
  operatorId?: string;
  operatorName?: string;
  description?: string;
  createdAt?: string;
}

export interface InterfaceNavBarItem {
  icon: string;
  label: string;
  path: string;
  badge?: boolean;
}

export interface InterfaceNavBar {
  id: string;
  name: string;
  backgroundColor: string;
  activeColor: string;
  inactiveColor: string;
  items: InterfaceNavBarItem[];
  isActive: boolean;
  createdAt?: string;
}

export interface InterfacePopup {
  id: string;
  name: string;
  popupType: 'coupon' | 'activity' | 'announcement' | 'custom';
  title?: string;
  content?: string;
  imageUrl?: string;
  linkUrl?: string;
  linkType?: 'page' | 'product' | 'category' | 'external';
  position: 'center' | 'bottom' | 'top';
  showOnce: boolean;
  startTime?: string;
  endTime?: string;
  isActive: boolean;
  triggerType: 'enter' | 'scroll' | 'delay' | 'exit';
  triggerValue?: string;
  createdAt?: string;
}

export interface PageConfigSnapshot {
  backgroundColor: string;
  backgroundImage?: string;
  widgets: Array<{
    widgetType: WidgetType;
    name?: string;
    props: Record<string, unknown>;
    style?: Record<string, unknown>;
    sortOrder: number;
    isVisible: boolean;
  }>;
}

// 组件默认属性类型
export interface SearchWidgetProps {
  placeholder: string;
  style: 'ROUNDED' | 'SQUARE';
  background: string;
  showIcon: boolean;
}

export interface BannerWidgetProps {
  height: number;
  images: Array<{
    url: string;
    link?: string;
    linkType?: string;
  }>;
  autoPlay: boolean;
  interval: number;
  indicatorType: 'dots' | 'number' | 'none';
}

export interface GridNavWidgetProps {
  cols: 3 | 4 | 5;
  rows: number;
  items: Array<{
    icon: string;
    label: string;
    color: string;
    link?: string;
    linkType?: string;
  }>;
  background: string;
  iconSize: number;
}

export interface NoticeWidgetProps {
  text: string;
  speed: number;
  background: string;
  textColor: string;
  showIcon: boolean;
  link?: string;
}

export interface ProductFeedWidgetProps {
  title?: string;
  mode: 'SINGLE' | 'DOUBLE' | 'LIST' | 'SCROLL';
  source: 'recommend' | 'hot' | 'new' | 'category' | 'custom';
  categoryId?: string;
  productIds?: string[];
  limit: number;
  showPrice: boolean;
  showSales: boolean;
  showCart: boolean;
}

export interface TitleWidgetProps {
  text: string;
  align: 'left' | 'center' | 'right';
  size: string;
  color: string;
  bold: boolean;
  showMore: boolean;
  moreLink?: string;
}

export interface SpacerWidgetProps {
  height: number;
  background: string;
}

export interface StoreInfoWidgetProps {
  showLogo: boolean;
  showName: boolean;
  showAddress: boolean;
  showPhone: boolean;
  showHours: boolean;
  style: 'card' | 'simple';
}

export interface MemberCardWidgetProps {
  background: string;
  showAvatar: boolean;
  showLevel: boolean;
  showPoints: boolean;
  showBalance: boolean;
  style: 'card' | 'banner';
}

export interface CouponWidgetProps {
  title?: string;
  mode: 'scroll' | 'grid';
  source: 'available' | 'new' | 'custom';
  couponIds?: string[];
  limit: number;
}

export interface ImageWidgetProps {
  url: string;
  mode: 'aspectFit' | 'aspectFill' | 'widthFix';
  link?: string;
  linkType?: string;
  radius: number;
}

export interface VideoWidgetProps {
  url: string;
  poster?: string;
  autoPlay: boolean;
  loop: boolean;
  muted: boolean;
}

export interface RichTextWidgetProps {
  content: string;
  padding: number;
}

export interface CountdownWidgetProps {
  title: string;
  endTime: string;
  background: string;
  textColor: string;
  style: 'simple' | 'card';
}

export interface DividerWidgetProps {
  style: 'solid' | 'dashed' | 'dotted';
  color: string;
  margin: number;
}
