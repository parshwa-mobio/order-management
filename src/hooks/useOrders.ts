import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";

interface OrderItem {
  product: any; // Accepts object as per backend response
  quantity: number;
  unitPrice: number;
  _id: string;
  sku: string;
  name: string;
  tax: number;
  discount: number;
  totalPrice: number;
}

interface Order {
  _id: string;
  orderNumber?: string;
  user: any; // Accepts object as per backend response
  orderItems: OrderItem[];
  totalAmount?: number;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  createdAt: string;
  updatedAt: string;
  distributorId?: string;
  dealerId?: string;
  orderType?: string;
  containerType?: string;
  deliveryDate?: string;
  notes?: string;
  contractId?: string;
  isDeleted?: boolean;
}

interface ShippingDetails {
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  shippingDetails: ShippingDetails;
  createdAt: string;
  updatedAt: string;
  distributorId?: string; // Added this property
  dealerId?: string; // Added this property
  type?: string; // Added this property
}

interface OrdersResponse {
  orders: Order[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

interface UseOrdersProps {
  searchTerm: string;
  filterStatus: string;
  dateRange?: { from: string; to: string };
  page?: number;
  limit?: number;
}

interface PaginationState {
  total: number;
  page: number;
  pages: number;
}

export const useOrders = ({
  searchTerm,
  filterStatus,
  dateRange,
  page = 1,
  limit = 10,
}: UseOrdersProps) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    total: 0,
    page: 1,
    pages: 1,
  });

  const baseUrl = import.meta.env.VITE_API_BASE;

  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (filterStatus !== "all") params.append("status", filterStatus);
    if (dateRange?.from) params.append("from", dateRange.from);
    if (dateRange?.to) params.append("to", dateRange.to);
    return params;
  }, [page, limit, filterStatus, dateRange]);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = buildQueryParams();
      const response = await fetch(`${baseUrl}/orders?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: OrdersResponse = await response.json();
      setOrders(data.orders || []);
      setPagination(data.pagination);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch orders";
      setError(errorMessage);
      setOrders([]);
      setPagination({ total: 0, page: 1, pages: 1 });
    } finally {
      setLoading(false);
    }
  }, [baseUrl, buildQueryParams]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = useMemo(() => {
    if (!orders.length || !user) return [];

    return orders.filter((order) => {
      switch (user.role) {
        case "admin":
          return true;
        case "distributor":
          return order.distributorId === user.id;
        case "dealer":
          return order.dealerId === user.id;
        case "sales":
          return (
            Array.isArray(user.assignedDistributors) &&
            order.distributorId &&
            user.assignedDistributors.includes(order.distributorId)
          );
        case "exportTeam":
          return order.type === "international";
        default:
          return false;
      }
    });
  }, [orders, user, searchTerm]);

  return {
    orders: filteredOrders,
    loading,
    error,
    pagination,
    totalPages: pagination.pages,
    currentPage: pagination.page,
    totalItems: pagination.total,
    refetch: fetchOrders,
  };
};
