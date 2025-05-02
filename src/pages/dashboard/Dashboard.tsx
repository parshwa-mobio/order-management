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
import { FormGrid } from "../../components/formCommon/FormGrid";
import {
  Box,
  Typography,
  Container,
  Grid,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert
} from "@mui/material";

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
        showToast("Failed to fetch dashboard data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
          Dashboard
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <FormGrid xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 500 }}>
                Total Orders
              </Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
                {orderSummary.totalOrders}
              </Typography>
            </Paper>
          </FormGrid>

          <FormGrid xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 500 }}>
                Pending Orders
              </Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
                {orderSummary.pendingOrders}
              </Typography>
            </Paper>
          </FormGrid>

          <FormGrid xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 500 }}>
                Revenue
              </Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
                ${orderSummary.revenue.toLocaleString()}
              </Typography>
            </Paper>
          </FormGrid>

          <FormGrid xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 500 }}>
                Total Claims
              </Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
                {claimsSummary.total}
              </Typography>
            </Paper>
          </FormGrid>
        </Grid>

        <Grid container spacing={3}>
          <FormGrid xs={12} lg={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Orders Status
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
              </Box>
            </Paper>
          </FormGrid>

          <FormGrid xs={12} lg={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Claims Status
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
              </Box>
            </Paper>
          </FormGrid>

          <FormGrid xs={12}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Top Products
              </Typography>
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product Name</TableCell>
                      <TableCell>Quantity Sold</TableCell>
                      <TableCell>Revenue</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topProducts.map((product) => (
                      <TableRow key={`product-${product.name}-${product.quantity}`}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>${product.revenue.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </FormGrid>
        </Grid>
      </Box>
    </Container>
  );
};

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return (
    <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Alert severity="info" sx={{ width: '100%', maxWidth: 500 }}>
        Please log in to access the dashboard
      </Alert>
    </Box>
  );

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
