import { useAdminDashboard } from "../../hooks/useAdminDashboard";
import { DashboardCard } from "../../components/dashboard/DashboardCard";
import { OrderTrendChart } from "../../components/dashboard/OrderTrendChart";
import { UserRoleChart } from "../../components/dashboard/UserRoleChart";
import { NotificationsPanel } from "../../components/dashboard/NotificationsPanel";

export const AdminDashboard = () => {
  const { data, loading, error } = useAdminDashboard();
  console.log({ data });
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  if (error) return <div className="text-red-500">{error}</div>;
  if (!data) return null;

  // Transform orders data for the trend chart
  const orderTrendData = data.orders.orders.reduce(
    (acc: { date: string; count: number }[], order) => {
      const date = new Date(order.createdAt).toLocaleDateString();
      const existingDate = acc.find((item) => item.date === date);

      if (existingDate) {
        existingDate.count += 1;
      } else {
        acc.push({ date, count: 1 });
      }

      return acc;
    },
    [],
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardCard
          title="Total Orders"
          value={data.orders.orders.length}
          icon="📦"
        />
        <DashboardCard title="Total Users" value={data.users.total} icon="👥" />
        <DashboardCard title="Products" value={data.products.count} icon="🏷️" />
        <DashboardCard
          title="Pending Returns"
          value={data.pendingApprovals.returns}
          icon="↩️"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 min-h-[400px]">
        <div className="h-full">
          <OrderTrendChart data={orderTrendData} />
        </div>
        <div className="h-full">
          <UserRoleChart data={data.users.summary} />
        </div>
      </div>

      {/* Notifications and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <NotificationsPanel notifications={data.notifications} />

        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Low Stock Alerts</h2>
          <div className="space-y-4">
            {data.products.lowStock.map((item, index) => (
              <div key={index} className="p-4 bg-yellow-50 rounded-lg">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">
                  Stock: {item.stock} (Threshold: {item.threshold})
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Order Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.orders.recent.orders.map((order) => {
                // Calculate total amount from orderItems
                const totalAmount = order.orderItems.reduce(
                  (sum, item) => sum + item.totalPrice,
                  0,
                );

                return (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{order._id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.user?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${totalAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
