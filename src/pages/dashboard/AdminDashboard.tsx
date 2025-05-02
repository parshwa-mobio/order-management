import { useAdminDashboard } from "../../hooks/useAdminDashboard";
import { DashboardCard } from "../../components/dashboard/DashboardCard";
import { OrderTrendChart } from "../../components/dashboard/OrderTrendChart";
import { UserRoleChart } from "../../components/dashboard/UserRoleChart";
import { NotificationsPanel } from "../../components/dashboard/NotificationsPanel";
import {
  Box,
  Typography,
  Container,
  Grid,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert
} from "@mui/material";

export const AdminDashboard = () => {
  const { data, loading, error } = useAdminDashboard();

  if (loading)
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

  if (error) return (
    <Box sx={{ p: 3 }}>
      <Alert severity="error">{error}</Alert>
    </Box>
  );

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
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
          Admin Dashboard
        </Typography>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard
              title="Total Orders"
              value={data.orders.orders.length}
              icon="📦"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard
              title="Total Users"
              value={data.users.total}
              icon="👥"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard
              title="Products"
              value={data.products.count}
              icon="🏷️"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard
              title="Pending Returns"
              value={data.pendingApprovals.returns}
              icon="↩️"
            />
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} lg={6}>
            <Box sx={{ height: '100%', minHeight: 400 }}>
              <OrderTrendChart data={orderTrendData} />
            </Box>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Box sx={{ height: '100%', minHeight: 400 }}>
              <UserRoleChart data={data.users.summary} />
            </Box>
          </Grid>
        </Grid>

        {/* Notifications and Alerts */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} lg={6}>
            <NotificationsPanel notifications={data.notifications} />
          </Grid>
          <Grid item xs={12} lg={6}>
            {/* Low Stock Alerts */}
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Low Stock Alerts
              </Typography>
              <Stack spacing={2}>
                {data.products.lowStock.map((item) => (
                  <Paper
                    key={item.name + item.stock}
                    variant="outlined"
                    sx={{
                      p: 2,
                      bgcolor: 'warning.light',
                      borderRadius: 2
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Stock: {item.stock} (Threshold: {item.threshold})
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* Recent Orders Table */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Recent Orders
          </Typography>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Order Number</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.orders.recent.orders.map((order) => {
                  // Calculate total amount from orderItems
                  const totalAmount = order.orderItems.reduce(
                    (sum, item) => sum + item.totalPrice,
                    0,
                  );

                  return (
                    <TableRow key={order._id}>
                      <TableCell>{order._id}</TableCell>
                      <TableCell>{order.user?.name || "N/A"}</TableCell>
                      <TableCell>${totalAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.status}
                          color={order.status === "completed" ? "success" : "warning"}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Container>
  );
};
