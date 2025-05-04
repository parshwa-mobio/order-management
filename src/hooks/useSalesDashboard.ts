import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "./useToast";

export interface SalesTarget {
  month: string;
  target: number;
  achieved: number;
}

export interface GrowthTrend {
  month: string;
  growth: number;
  revenue: number;
}

export interface DistributorPerformance {
  id: string;
  name: string;
  metrics: {
    orderCount: number;
    revenue: number;
    growth: string;
    returns: number;
    activeProducts: number;
  };
}

export interface LowStockAlert {
  distributorId: string;
  distributorName: string;
  products: Array<{
    id: string;
    name: string;
    currentStock: number;
    reorderPoint: number;
  }>;
}

export interface ReturnRequest {
  id: string;
  distributorName: string;
  products: Array<{
    name: string;
    quantity: number;
    reason: string;
  }>;
  date: string;
  status: string;
}

export interface RecentOrder {
  id: string;
  distributorName: string;
  amount: number;
  date: string;
  status: string;
}

interface OrderResponse {
  id: string;
  user: { name: string };
  orderItems: Array<{ totalPrice: number }>;
  status: string;
  createdAt: string;
}

interface OrdersResponse {
  recent: {
    orders: OrderResponse[];
  };
}

export const useSalesDashboard = (selectedDistributorId: string = "") => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [salesTargets, setSalesTargets] = useState<SalesTarget[]>([]);
  const [growthTrends, setGrowthTrends] = useState<GrowthTrend[]>([]);
  const [distributorPerformance, setDistributorPerformance] = useState<
    DistributorPerformance[]
  >([]);
  const [lowStockAlerts, setLowStockAlerts] = useState<LowStockAlert[]>([]);
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const baseUrl = import.meta.env.VITE_API_BASE;

        const [
          targetsResponse,
          reportsResponse,
          distributorResponse,
          ordersResponse,
          returnsResponse,
          stockResponse,
        ] = await Promise.all([
          fetch(`${baseUrl}/sales/targets`, { headers }),
          fetch(`${baseUrl}/sales/reports?filter=monthly`, { headers }),
          fetch(`${baseUrl}/sales/distributor/${selectedDistributorId}/360`, {
            headers,
          }),
          fetch(`${baseUrl}/orders?distributorId=assigned`, { headers }),
          fetch(`${baseUrl}/returns?status=pending`, { headers }),
          fetch(`${baseUrl}/stock/low?salesId=${user?.id}`, { headers }),
        ]);

        const [targets, reports, distributor, orders, returns, stock] =
          await Promise.all([
            targetsResponse.json(),
            reportsResponse.json(),
            distributorResponse.json(),
            ordersResponse.json(),
            returnsResponse.json(),
            stockResponse.json(),
          ]);

        setSalesTargets(targets);
        setGrowthTrends(reports.trends);
        setDistributorPerformance(distributor);
        setLowStockAlerts(stock);
        setReturnRequests(returns);
        setRecentOrders((orders as OrdersResponse).recent.orders.map((order: OrderResponse) => ({
          id: order.id,
          distributorName: order.user.name,
          amount: order.orderItems.reduce((sum: number, item: { totalPrice: number }) => sum + item.totalPrice, 0),
          date: order.createdAt,
          status: order.status
        })));
      } catch (error) {
        showToast("Failed to fetch dashboard data", "error");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchDashboardData();
    }
  }, [user?.id, selectedDistributorId, showToast]);

  return {
    loading,
    salesTargets,
    growthTrends,
    distributorPerformance,
    lowStockAlerts,
    returnRequests,
    recentOrders,
    selectedDistributorId,
  };
};
