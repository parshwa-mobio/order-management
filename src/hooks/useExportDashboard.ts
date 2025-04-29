import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "./useToast";

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

export const useExportDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [orderStatuses, setOrderStatuses] = useState<OrderStatus[]>([]);
  const [returns, setReturns] = useState<InternationalReturn[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [alerts, setAlerts] = useState<GlobalAlert[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const baseUrl = import.meta.env.VITE_API_BASE;

        const [
          shipmentsResponse,
          ordersResponse,
          returnsResponse,
          notificationsResponse,
          documentsResponse,
        ] = await Promise.all([
          fetch(`${baseUrl}/shipment?scope=global`, { headers }),
          fetch(`${baseUrl}/orders?scope=export`, { headers }),
          fetch(`${baseUrl}/returns?scope=international`, { headers }),
          fetch(`${baseUrl}/notifications`, { headers }),
          fetch(`${baseUrl}/documents?type=export`, { headers }),
        ]);

        const [shipments, orders, returns, notifications, documents] =
          await Promise.all([
            shipmentsResponse.json(),
            ordersResponse.json(),
            returnsResponse.json(),
            notificationsResponse.json(),
            documentsResponse.json(),
          ]);

        setShipments(shipments);
        setOrderStatuses(orders);
        setReturns(returns);
        setDocuments(documents);
        setAlerts(
          notifications.filter(
            (n: GlobalAlert) => n.type === "shipment" || n.type === "return",
          ),
        );
      } catch (error) {
        showToast("Failed to fetch dashboard data", "error");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchDashboardData();
    }
  }, [user?.id, showToast]);

  return { loading, shipments, orderStatuses, returns, documents, alerts };
};
