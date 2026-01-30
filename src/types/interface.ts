import { BaseEntity } from './common';

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

export interface InterfaceWidget extends BaseEntity {
  pageId: string;
  widgetType: WidgetType;
  name?: string;
  props: Record<string, unknown>;
  style?: Record<string, unknown>;
  sortOrder: number;
  isVisible: boolean;
}

export interface InterfacePage extends BaseEntity {
  pageType: 'home' | 'user' | 'order' | 'category' | 'product_detail';
  name: string;
  description?: string;
  backgroundColor: string;
  backgroundImage?: string;
  isPublished: boolean;
  publishedAt?: string;
  version: number;
  widgets: InterfaceWidget[];
}

export interface InterfaceTemplate extends BaseEntity {
  name: string;
  description?: string;
  thumbnail?: string;
  category: 'official' | 'custom' | 'industry';
  industry?: string;
  pageType: string;
  config: PageConfigSnapshot;
  isSystem: boolean;
  useCount: number;
}

export interface InterfaceTheme extends BaseEntity {
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
}

export interface InterfaceHistory extends BaseEntity {
  pageId: string;
  version: number;
  config: PageConfigSnapshot;
  operationType: 'create' | 'update' | 'publish' | 'restore';
  operatorId?: string;
  operatorName?: string;
  description?: string;
}

export interface InterfaceNavBarItem {
  icon: string;
  label: string;
  path: string;
  badge?: boolean;
}

export interface InterfaceNavBar extends BaseEntity {
  name: string;
  backgroundColor: string;
  activeColor: string;
  inactiveColor: string;
  items: InterfaceNavBarItem[];
  isActive: boolean;
}

export interface InterfacePopup extends BaseEntity {
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

// 组件属性类型
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