import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../useToast";

export interface OrderSummary {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  revenue: number;
}

export interface ClaimsSummary {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface TopProduct {
  name: string;
  quantity: number;
  revenue: number;
}

export const useDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [orderSummary, setOrderSummary] = useState<OrderSummary>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    revenue: 0,
  });
  const [claimsSummary, setClaimsSummary] = useState<ClaimsSummary>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const baseUrl = import.meta.env.VITE_API_BASE;

      try {
        const [orderRes, claimsRes, productsRes] = await Promise.all([
          fetch(`${baseUrl}/dashboard/orders`, { headers }),
          fetch(`${baseUrl}/dashboard/claims`, { headers }),
          fetch(`${baseUrl}/dashboard/top-products`, { headers }),
        ]);

        if (!orderRes.ok || !claimsRes.ok || !productsRes.ok) {
          throw new Error('One or more API requests failed');
        }

        const [orderData, claimsData, productsData] = await Promise.all([
          orderRes.json(),
          claimsRes.json(),
          productsRes.json(),
        ]);

        setOrderSummary(orderData);
        setClaimsSummary(claimsData);
        setTopProducts(productsData);
      } catch (error) {
        if (error instanceof Error) {
          showToast(error.message, "error");
        } else {
          showToast("Failed to fetch dashboard data", "error");
        }
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchDashboardData();
    }
  }, [user?.id, showToast]);

  return { loading, orderSummary, claimsSummary, topProducts };
};