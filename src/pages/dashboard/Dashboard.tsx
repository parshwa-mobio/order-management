import { useAuth } from "../../contexts/AuthContext";
import { useDashboard } from "../../hooks/useDashboard";
import { AdminDashboard } from "./AdminDashboard";
import { SalesDashboard } from "./SalesDashboard";
import { DistributorDashboard } from "./DistributorDashboard";
import { ExportDashboard } from "./ExportDashboard";
import { FormGrid } from "../../components/formCommon/FormGrid";
import { FormCard } from "../../components/formCommon/FormCard";
import { FormChart } from "../../components/formCommon/FormChart";
import { FormTable } from "../../components/formCommon/FormTable";
import { FormLoading } from "../../components/formCommon/FormLoading";
import { FormAlert } from "../../components/formCommon/FormAlert";
import { Box, Typography, Container } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const DefaultDashboard = () => {
  const { loading, orderSummary, claimsSummary, topProducts } = useDashboard();

  if (loading) {
    return <FormLoading fullScreen />;
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
          Dashboard
        </Typography>

        <FormGrid container spacing={3} sx={{ mb: 4 }}>
          <FormGrid xs={12} sm={6} md={3}>
            <FormCard
              title="Total Orders"
              value={orderSummary.totalOrders}
              icon="📦"
            />
          </FormGrid>

          <FormGrid xs={12} sm={6} md={3}>
            <FormCard
              title="Pending Orders"
              value={orderSummary.pendingOrders}
              icon="⏳"
            />
          </FormGrid>

          <FormGrid xs={12} sm={6} md={3}>
            <FormCard
              title="Revenue"
              value={`$${orderSummary.revenue.toLocaleString()}`}
              icon="💰"
            />
          </FormGrid>

          <FormGrid xs={12} sm={6} md={3}>
            <FormCard
              title="Total Claims"
              value={claimsSummary.total}
              icon="📝"
            />
          </FormGrid>
        </FormGrid>

        <FormGrid container spacing={3}>
          <FormGrid xs={12} lg={6}>
            <FormChart title="Orders Status">
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
                    <Cell key={`cell-${color}-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </FormChart>
          </FormGrid>

          <FormGrid xs={12} lg={6}>
            <FormChart title="Claims Status">
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
            </FormChart>
          </FormGrid>

          <FormGrid xs={12}>
            <FormTable
              title="Top Products"
              columns={[
                { field: "name", headerName: "Product Name" },
                { field: "quantity", headerName: "Quantity Sold" },
                { field: "revenue", headerName: "Revenue" },
              ]}
              rows={topProducts}
            />
          </FormGrid>
        </FormGrid>
      </Box>
    </Container>
  );
};

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Box
        sx={{
          p: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <FormAlert
          severity="info"
          message="Please log in to access the dashboard"
        />
      </Box>
    );
  }

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
