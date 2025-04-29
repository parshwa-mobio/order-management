import { OrderStatus } from "../../hooks/useExportDashboard";
import { Timeline } from "../Timeline";

interface OrderStatusTimelineProps {
  orderStatuses: OrderStatus[];
}

export const OrderStatusTimeline = ({
  orderStatuses,
}: OrderStatusTimelineProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Order Status Timeline</h2>
      <div className="space-y-8">
        {orderStatuses.map((order) => (
          <div key={order.id} className="border p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">{order.distributorName}</h3>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  order.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {order.status}
              </span>
            </div>
            <Timeline events={order.timeline} />
          </div>
        ))}
      </div>
    </div>
  );
};
