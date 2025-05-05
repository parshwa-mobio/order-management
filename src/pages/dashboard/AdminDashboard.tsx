import { memo } from "react";
import { useAdminDashboard } from "../../hooks/dashboard/useAdminDashboard";
import { FormCard } from "../../components/formCommon/FormCard";
import { FormAlert } from "../../components/formCommon/FormAlert";
import { FormTable } from "../../components/formCommon/FormTable";
import { FormLoading } from "../../components/formCommon/FormLoading";
import { FormGrid } from "../../components/formCommon/FormGrid";
import { FormList } from "../../components/formCommon/FormList";
import { OrderTrendChart } from "../../components/dashboard/OrderTrendChart";
import { UserRoleChart } from "../../components/dashboard/UserRoleChart";
import { Box, Typography, Container } from "@mui/material";
import { useUsername } from "../../hooks/user/useUsername";

export const AdminDashboard = memo(() => {
  const { data, loading, error } = useAdminDashboard();
  if (loading) return <FormLoading fullScreen />;

  if (error) return (
    <Box sx={{ p: 3 }}>
      <FormAlert severity="error" message={error} />
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
        <FormGrid container spacing={3} sx={{ mb: 4 }}>
          <FormGrid xs={12} sm={6} md={3}>
            <FormCard
              title="Total Orders"
              value={data.orders.orders.length}
              icon="📦"
            />
          </FormGrid>
          <FormGrid xs={12} sm={6} md={3}>
            <FormCard
              title="Total Users"
              value={data.users.total}
              icon="👥"
            />
          </FormGrid>
          <FormGrid xs={12} sm={6} md={3}>
            <FormCard
              title="Products"
              value={data.products.count}
              icon="🏷️"
            />
          </FormGrid>
          <FormGrid xs={12} sm={6} md={3}>
            <FormCard
              title="Pending Returns"
              value={data.pendingApprovals.returns}
              icon="↩️"
            />
          </FormGrid>
        </FormGrid>

        {/* Charts Section */}
        <FormGrid container spacing={3} sx={{ mb: 4 }}>
          <FormGrid xs={12} lg={6}>
            <OrderTrendChart data={orderTrendData} />
          </FormGrid>
          <FormGrid xs={12} lg={6}>
            <UserRoleChart data={data.users.summary} />
          </FormGrid>
        </FormGrid>

        {/* Notifications and Alerts */}
        <FormGrid container spacing={3} sx={{ mb: 4 }}>
          <FormGrid xs={12} lg={6}>
            <FormAlert
              title="System Notifications"
              severity="info"
              message={data.notifications[0]?.message ?? "No new notifications"}
              date={data.notifications[0]?.date}
            />
          </FormGrid>
          <FormGrid xs={12} lg={6}>
            <FormList
              title="Low Stock Alerts"
              items={data.products.lowStock.map(item => ({
                id: item.name,
                title: item.name,
                subtitle: `Stock: ${item.stock} (Threshold: ${item.threshold})`,
                status: 'warning'
              }))}
            />
          </FormGrid>
        </FormGrid>

        {/* Recent Orders Table */}
        <FormTable
          title="Recent Orders"
          columns={[
            { field: 'orderNumber', headerName: 'Order Number' },
            { 
              field: 'createdBy', 
              headerName: 'Customer',
              renderCell: (row: any) => {
                const { username, loading } = useUsername(row.createdBy);
                return loading ? "Loading..." : username;
              }
            },
            { field: 'amount', headerName: 'Amount' },
            { field: 'status', headerName: 'Status' },
            { field: 'createdAt', headerName: 'Date' }
          ]}
          rows={data.orders.recent.orders.map(order => ({
            ...order,
            amount: order.orderItems.reduce((sum, item) => sum + item.totalPrice, 0)
          }))}
        />
      </Box>
    </Container>
  );
});
