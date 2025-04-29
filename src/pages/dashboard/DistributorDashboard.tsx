import { useDistributorDashboard } from "../../hooks/useDistributorDashboard";
import { DashboardCard } from "../../components/dashboard/DashboardCard";
import { NotificationsPanel } from "../../components/dashboard/NotificationsPanel";

export const DistributorDashboard = () => {
  const { data, loading, error } = useDistributorDashboard();

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!data) return null;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Distributor Dashboard</h1>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardCard
          title="Total Orders"
          value={data.orders.total}
          icon="📦"
        />
        <DashboardCard
          title="Draft Orders"
          value={data.orders.drafts.length}
          icon="📝"
        />
        <DashboardCard
          title="Available Stock"
          value={data.stock.available}
          icon="🏭"
        />
        <DashboardCard
          title="Active Shipments"
          value={data.shipments.length}
          icon="🚚"
        />
      </div>
      {/* Draft Orders and Shipments Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Draft Orders */}
        <div className="bg-white p-6 rounded-lg shadow-lg h-full">
          <h2 className="text-lg font-semibold mb-4">Draft Orders</h2>
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {data.orders.drafts.map((draft) => (
              <div
                key={draft.id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">
                      {draft.customer}
                    </p>
                    <p className="text-sm text-gray-600">
                      Created: {new Date(draft.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors">
                    Complete
                  </button>
                </div>
                <div className="mt-3 space-y-1">
                  {draft.products.map((product, index) => (
                    <p
                      key={index}
                      className="text-sm text-gray-600 flex justify-between"
                    >
                      <span>{product.name}</span>
                      <span className="font-medium">x {product.quantity}</span>
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Active Shipments */}
        <div className="bg-white p-6 rounded-lg shadow-lg h-full">
          <h2 className="text-lg font-semibold mb-4">Active Shipments</h2>
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {data.shipments.map((shipment) => (
              <div
                key={shipment.id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">
                      Order #{shipment.orderId}
                    </p>
                    <p className="text-sm text-gray-600">
                      To: {shipment.destination}
                    </p>
                    <p className="text-sm text-gray-600">
                      Delivery:{" "}
                      {new Date(
                        shipment.estimatedDelivery,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      shipment.status === "in_transit"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {shipment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Recommendations and Notifications Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Recommendations */}
        <div className="bg-white p-6 rounded-lg shadow-lg h-full">
          <h2 className="text-lg font-semibold mb-4">Recommended Products</h2>
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {data.recommendations.map((product) => (
              <div
                key={product.id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <div className="mt-1 space-x-4">
                      <span className="text-sm text-gray-600">
                        Stock: {product.stockLevel}
                      </span>
                      <span className="text-sm text-gray-600">
                        Demand: {product.demandScore}
                      </span>
                    </div>
                  </div>
                  <p className="font-medium text-green-600">
                    ${product.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Notifications Panel - Reusing Admin Component */}
        <NotificationsPanel notifications={data.notifications} />
      </div>
    </div>
  );
};
