import { useState, useEffect } from "react";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface OrderDetails {
  id: string;
  items: OrderItem[];
  pricing: {
    subtotal: number;
    tax: number;
    total: number;
  };
  contractInfo: {
    contractNumber: string;
    contractDate: string;
  };
}

interface Shipment {
  status: string;
  trackingNumber: string;
  erpStatus: string;
  cargoTracking: string;
}

interface Document {
  id: string;
  name: string;
  url: string;
}

export const useOrderDetails = (orderId: string | undefined) => {

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const baseUrl = import.meta.env.VITE_API_BASE;
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return;
      
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [orderData, shipmentData, docsData] = await Promise.all([
          fetch(`${baseUrl}/orders/${orderId}`, { headers })
            .then(res => res.json()),
          fetch(`${baseUrl}/shipment/${orderId}`, { headers })
            .then(res => res.json()),
          fetch(`${baseUrl}/documents/order/${orderId}`, { headers })
            .then(res => res.json())
        ]);

        setOrder(orderData);
        setShipment(shipmentData);
        setDocuments(docsData);
      } catch (err) {
        // Handle error if needed
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  return {
    order,
    shipment,
    documents,
    loading
  };
};