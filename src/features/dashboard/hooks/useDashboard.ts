import { useState, useMemo } from 'react';
import { Order } from '../../../types';

interface DashboardStats {
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  orderCount: number;
  averageOrderValue: number;
}

interface SalesTrendData {
  time: string;
  sales: number;
}

interface ProductSalesData {
  name: string;
  sales: number;
  quantity: number;
}

export const useDashboard = (orders: Order[]) => {
  const [timeRange, setTimeRange] = useState('今天');

  // 计算统计数据
  const stats = useMemo((): DashboardStats => {
    const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
    const totalCost = orders.reduce((acc, o) => acc + (o.totalCost || 0), 0);
    const grossProfit = totalRevenue - totalCost;
    const count = orders.length;
    const avg = count > 0 ? totalRevenue / count : 0;
    
    return { totalRevenue, totalCost, grossProfit, orderCount: count, averageOrderValue: avg };
  }, [orders, timeRange]);

  // 生成销售趋势数据
  const salesTrendData = useMemo((): SalesTrendData[] => {
    const now = Date.now();
    const data: SalesTrendData[] = [];
    
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now - i * 3600000).getHours();
      const sales = Math.random() * 50;
      data.push({
        time: `${hour}:00`,
        sales: parseFloat(sales.toFixed(2))
      });
    }
    
    return data;
  }, []);

  // 生成产品销售排名数据
  const productSalesData = useMemo((): ProductSalesData[] => {
    const productMap = new Map<string, ProductSalesData>();
    
    orders.forEach(order => {
      order.items.forEach(item => {
        if (productMap.has(item.id)) {
          const existing = productMap.get(item.id)!;
          existing.sales += item.price * item.quantity;
          existing.quantity += item.quantity;
        } else {
          productMap.set(item.id, {
            name: item.name,
            sales: item.price * item.quantity,
            quantity: item.quantity
          });
        }
      });
    });
    
    // 转换为数组并按销售额排序
    return Array.from(productMap.values())
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10); // Top 10 products
  }, [orders]);

  // 生成支付方式分布数据
  const paymentMethodData = useMemo(() => {
    const paymentMap = new Map<string, number>();
    
    orders.forEach(order => {
      const method = order.paymentMethod || '未知';
      const current = paymentMap.get(method) || 0;
      paymentMap.set(method, current + order.total);
    });
    
    const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
    let colorIndex = 0;
    
    return Array.from(paymentMap.entries()).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2)),
      color: colors[colorIndex++ % colors.length]
    }));
  }, [orders]);

  return {
    timeRange,
    setTimeRange,
    stats,
    salesTrendData,
    productSalesData,
    paymentMethodData
  };
};