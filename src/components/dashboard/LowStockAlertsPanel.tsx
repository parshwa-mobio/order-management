import { LowStockAlert } from "../../hooks/useSalesDashboard";

interface LowStockAlertsPanelProps {
  lowStockAlerts: LowStockAlert[];
}

export const LowStockAlertsPanel = ({
  lowStockAlerts,
}: LowStockAlertsPanelProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Low Stock Alerts</h2>
      <div className="space-y-4">
        {lowStockAlerts.map((alert) => (
          <div
            key={alert.distributorId}
            className="border-l-4 border-red-500 pl-4"
          >
            <h3 className="font-medium">{alert.distributorName}</h3>
            <div className="mt-2 space-y-2">
              {alert.products.map((product) => (
                <div key={product.id} className="flex justify-between text-sm">
                  <span>{product.name}</span>
                  <span className="text-red-600">
                    {product.currentStock} / {product.reorderPoint}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
