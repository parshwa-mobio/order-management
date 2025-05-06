import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../useToast";

export interface Shipment {
  id: string;
  status: string;
  origin: string;
  destination: string;
  eta: string;
  carrier: string;
  trackingNumber: string;
  items: Array<{
    productName: string;
    quantity: number;
  }>;
}

export interface OrderStatus {
  id: string;
  distributorName: string;
  status: string;
  timeline: Array<{
    status: string;
    date: string;
    description: string;
  }>;
}

export interface InternationalReturn {
  id: string;
  distributorName: string;
  country: string;
  status: string;
  items: Array<{
    productName: string;
    quantity: number;
    reason: string;
  }>;
  documents: string[];
}

export interface Document {
  id: string;
  name: string;
  type: string;
  status: string;
  uploadedBy: string;
  uploadDate: string;
  url: string;
}

export interface GlobalAlert {
  id: string;
  type: "shipment" | "return";
  severity: "low" | "medium" | "high";
  message: string;
  date: string;
}

const fetchData = async (url: string, headers: HeadersInit) => {
  const response = await fetch(url, { headers });
  return response.json();
};

const handleError = (error: unknown, showToast: ReturnType<typeof useToast>['showToast']) => {
  if (error instanceof Error) {
    showToast(`Failed to fetch dashboard data: ${error.message}`, "error");
  } else {
    showToast("Failed to fetch dashboard data: Unknown error", "error");
  }
};

export const useExportDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<{
    shipments: Shipment[];
    orderStatuses: OrderStatus[];
    returns: InternationalReturn[];
    documents: Document[];
    alerts: GlobalAlert[];
  }>({
    shipments: [],
    orderStatuses: [],
    returns: [],
    documents: [],
    alerts: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;

      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const baseUrl = import.meta.env.VITE_API_BASE;

        const endpoints = {
          shipments: `${baseUrl}/shipment?scope=global`,
          orders: `${baseUrl}/orders?scope=export`,
          returns: `${baseUrl}/returns?scope=international`,
          notifications: `${baseUrl}/notifications`,
          documents: `${baseUrl}/documents?type=export`,
        };

        const responses = await Promise.all(
          Object.values(endpoints).map(url => fetchData(url, headers))
        );

        const [shipments, orders, returns, notifications, documents] = responses;

        setDashboardData({
          shipments,
          orderStatuses: orders,
          returns,
          documents,
          alerts: notifications.filter(
            (n: GlobalAlert) => n.type === "shipment" || n.type === "return"
          ),
        });
      } catch (error) {
        handleError(error, showToast);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id, showToast]);

  return { loading, ...dashboardData };
};
