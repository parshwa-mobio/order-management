import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useToast } from "../../hooks/useToast";
import { AdminDashboard } from "./AdminDashboard";
import { SalesDashboard } from "./SalesDashboard";
import { DistributorDashboard } from "./DistributorDashboard";
import { ExportDashboard } from "./ExportDashboard";

interface OrderSummary {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  revenue: number;
}

interface ClaimsSummary {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface TopProduct {
  name: string;
  quantity: number;
  revenue: number;
}

const DefaultDashboard = () => {
  const [orderSummary, setOrderSummary] = useState<OrderSummary>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    revenue: 0,
  });
  const [claimsSummary, setClaimsSummary] = useState<ClaimsSummary>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [orderRes, claimsRes, productsRes] = await Promise.all([
          fetch("http://localhost:5000/api/dashboard/orders", { headers }),
          fetch("http://localhost:5000/api/dashboard/claims", { headers }),
          fetch("http://localhost:5000/api/dashboard/top-products", {
            headers,
          }),
        ]);

        const orderData = await orderRes.json();
        const claimsData = await claimsRes.json();
        const productsData = await productsRes.json();

        setOrderSummary(orderData);
        setClaimsSummary(claimsData);
        setTopProducts(productsData);
      } catch (error) {
        console.log(error);
        showToast("Failed to fetch dashboard data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Total Orders</h3>
          <p className="text-3xl font-bold">{orderSummary.totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">
            Pending Orders
          </h3>
          <p className="text-3xl font-bold">{orderSummary.pendingOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Revenue</h3>
          <p className="text-3xl font-bold">
            ${orderSummary.revenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Total Claims</h3>
          <p className="text-3xl font-bold">{claimsSummary.total}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Orders Status</h2>
          <PieChart width={400} height={300}>
            <Pie
              data={[
                { name: "Completed", value: orderSummary.completedOrders },
                { name: "Pending", value: orderSummary.pendingOrders },
              ]}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {COLORS.map((color, index) => (
                <Cell key={`cell-${index}`} fill={color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Claims Status</h2>
          <BarChart
            width={400}
            height={300}
            data={[
              { name: "Pending", value: claimsSummary.pending },
              { name: "Approved", value: claimsSummary.approved },
              { name: "Rejected", value: claimsSummary.rejected },
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </div>

        <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Top Products</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity Sold
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topProducts.map((product, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${product.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  console.log("Dashboard rendered");
  const { user } = useAuth();

  if (!user) return <div>Please log in to access the dashboard</div>;

  switch (user.role) {
    case "admin":
      return <AdminDashboard />;
    case "distributor":
      return <DistributorDashboard />;
    case "sales":
      return <SalesDashboard />;
    case "exportTeam":
      return <ExportDashboard />;
    default:
      return <DefaultDashboard />;
  }
};

export default Dashboard;
