import { useParams } from "react-router-dom";
import { useOrderDetails } from "../../hooks/order/useOrderDetails";

const OrderDetailsPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { order, shipment, documents, loading } = useOrderDetails(orderId);

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
        <p>Contract Number: {order.contractInfo?.contractNumber || 'N/A'}</p>
        <p>Contract Date: {order.contractInfo?.contractDate || 'N/A'}</p>
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

