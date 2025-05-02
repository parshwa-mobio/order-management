import { useState, useEffect } from "react";

interface OrderItem {
  product: {
    _id: string;
    sku: string;
    name: string;
  };
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  discount: number;
  totalPrice: number;
  _id: string;
}

interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  distributorId: string;
  dealerId: string;
  createdBy: string;
  createdVia: string;
  orderItems: OrderItem[];
  orderType: string;
  status: string;
  containerType: string;
  deliveryDate: string;
  notes: string;
  createdAt: string;
  isDeleted: boolean;
  updatedAt: string;
}

interface AdminDashboardData {
  orders: {
    orders: Order[];
    pagination: {
      total: number;
      page: number;
      pages: number;
    };
    recent: {
      orders: Order[];
      pagination: {
        total: number;
        page: number;
        pages: number;
      };
    };
  };
  users: {
    summary: Array<{
      count: number;
      role: string;
    }>;
    total: number;
  };
  products: {
    count: number;
    lowStock: Array<any>;
  };
  notifications: Array<any>;
  pendingApprovals: {
    returns: number;
    orders: number;
  };
}

export const useAdminDashboard = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const baseUrl = import.meta.env.VITE_API_BASE;

      try {
        const [
          ordersSummary,
          usersSummary,
          productsCount,
          notifications,
          lowStock,
          pendingReturns,
          recentOrders,
        ] = await Promise.all([
          fetch(`${baseUrl}/orders?summary=admin`, { headers }).then(
            async (res) => {
              if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Orders API error: ${errorText}`);
              }
              return res.json();
            },
          ),
          fetch(`${baseUrl}/users/roles-summary`, { headers }).then(
            async (res) => {
              if (!res.ok) {
                const errorText = await res.text();
                console.error("❌ Users API Raw Response:", errorText);
                throw new Error(`Users API error: ${errorText}`);
              }
              return res.json();
            },
          ),
          fetch(`${baseUrl}/products/count`, { headers }).then(async (res) => {
            if (!res.ok) {
              const errorText = await res.text();
              throw new Error(`Products API error: ${errorText}`);
            }
            return res.json();
          }),
          fetch(`${baseUrl}/notifications`, { headers }).then(async (res) => {
            if (!res.ok) {
              const errorText = await res.text();
              throw new Error(`Notifications API error: ${errorText}`);
            }
            return res.json();
          }),
          fetch(`${baseUrl}/stock/low?role=admin`, { headers }).then(
            async (res) => {
              if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Stock API error: ${errorText}`);
              }
              return res.json();
            },
          ),
          fetch(`${baseUrl}/returns?status=pending`, { headers }).then(
            async (res) => {
              if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Returns API error: ${errorText}`);
              }
              return res.json();
            },
          ),
          fetch(`${baseUrl}/orders?sort=recent&limit=5`, { headers }).then(
            async (res) => {
              if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Recent orders API error: ${errorText}`);
              }
              return res.json();
            },
          ),
        ]);
       
        setData({
          orders: {
            ...ordersSummary,
            recent: recentOrders,
          },
          users: {
            summary: usersSummary.summary,
            total: usersSummary.total,
          },
          products: {
            count: productsCount.count,
            lowStock: lowStock,
          },
          notifications,
          pendingApprovals: {
            returns: pendingReturns.length,
            orders:
              ordersSummary.orders.filter(
                (o: { status: string }) => o.status === "pending",
              ).length || 0,
          },
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch dashboard data",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return { data, loading, error };
};
