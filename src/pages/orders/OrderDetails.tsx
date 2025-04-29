import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
  // Add other fields as needed
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

const OrderDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        // Fetch order details
        const orderRes = await fetch(`/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const orderData = await orderRes.json();
        setOrder(orderData);

        // Fetch shipment info
        const shipmentRes = await fetch(`/api/shipment/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const shipmentData = await shipmentRes.json();
        setShipment(shipmentData);

        // Fetch documents
        const docsRes = await fetch(`/api/documents/order/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const docsData = await docsRes.json();
        setDocuments(docsData);
      } catch (err) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!order) {
    return <div className="p-6 text-red-600">Order not found.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Contract Info</h2>
        <p>Contract Number: {order.contractInfo.contractNumber}</p>
        <p>Contract Date: {order.contractInfo.contractDate}</p>
      </div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Items</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, idx) => (
              <tr key={idx}>
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">{item.quantity}</td>
                <td className="px-4 py-2">${item.price.toFixed(2)}</td>
                <td className="px-4 py-2">${item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Pricing</h2>
        <p>Subtotal: ${order.pricing.subtotal.toFixed(2)}</p>
        <p>Tax: ${order.pricing.tax.toFixed(2)}</p>
        <p className="font-bold">Total: ${order.pricing.total.toFixed(2)}</p>
      </div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Shipment Progress</h2>
        {shipment ? (
          <div>
            <p>Status: {shipment.status}</p>
            <p>Tracking Number: {shipment.trackingNumber}</p>
            <p>ERP Status: {shipment.erpStatus}</p>
            <p>Cargo Tracking: {shipment.cargoTracking}</p>
          </div>
        ) : (
          <p>No shipment info available.</p>
        )}
      </div>
      <div>
        <h2 className="text-lg font-semibold">Documents</h2>
        {documents.length > 0 ? (
          <ul>
            {documents.map((doc) => (
              <li key={doc.id}>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {doc.name}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No documents available.</p>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsPage;
