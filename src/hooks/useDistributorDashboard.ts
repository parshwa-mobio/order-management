import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

interface DistributorDashboardData {
  orders: {
    total: number;
    drafts: Array<{
      id: string;
      customer: string;
      products: Array<{ name: string; quantity: number }>;
      createdAt: string;
    }>;
    recent: Array<{
      id: string;
      customer: string;
      amount: number;
      status: string;
      date: string;
    }>;
  };
  stock: {
    total: number;
    available: number;
    lowStock: Array<{
      id: string;
      name: string;
      quantity: number;
      threshold: number;
    }>;
  };
  shipments: Array<{
    id: string;
    orderId: string;
    status: string;
    destination: string;
    estimatedDelivery: string;
  }>;
  recommendations: Array<{
    id: string;
    name: string;
    price: number;
    stockLevel: number;
    demandScore: number;
  }>;
  notifications: Array<{
    id: string;
    message: string;
    type: string;
    date: string;
  }>;
}

export const useDistributorDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DistributorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const baseUrl = import.meta.env.VITE_API_BASE;

        const [
          orders,
          draftOrders,
          recommendations,
          notifications,
          stock,
          shipments,
        ] = await Promise.all([
          fetch(`${baseUrl}/orders?distributorId=${user?.id}`, {
            headers,
          }).then(async (res) => {
            if (!res.ok) throw new Error("Failed to fetch orders");
            return res.json();
          }),
          fetch(`${baseUrl}/orders/draft`, { headers }).then(async (res) => {
            if (!res.ok) throw new Error("Failed to fetch draft orders");
            return res.json();
          }),
          fetch(`${baseUrl}/products/recommendations`, { headers }).then(
            async (res) => {
              if (!res.ok) throw new Error("Failed to fetch recommendations");
              return res.json();
            },
          ),
          fetch(`${baseUrl}/notifications`, { headers }).then(async (res) => {
            if (!res.ok) throw new Error("Failed to fetch notifications");
            return res.json();
          }),
          fetch(`${baseUrl}/stock?distributorId=${user?.id}`, { headers }).then(
            async (res) => {
              if (!res.ok) throw new Error("Failed to fetch stock");
              return res.json();
            },
          ),
          fetch(`${baseUrl}/shipment?distributorId=${user?.id}`, {
            headers,
          }).then(async (res) => {
            if (!res.ok) throw new Error("Failed to fetch shipments");
            return res.json();
          }),
        ]);

        setData({
          orders: {
            total: orders.total,
            drafts: draftOrders,
            recent: orders.recent,
          },
          stock,
          shipments,
          recommendations,
          notifications,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch dashboard data",
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchDashboardData();
    }
  }, [user?.id]);

  return { data, loading, error };
};
