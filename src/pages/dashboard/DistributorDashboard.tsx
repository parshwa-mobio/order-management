import { useDistributorDashboard } from "../../hooks/useDistributorDashboard";
import { FormCard } from "../../components/formCommon/FormCard";
import { FormList } from "../../components/formCommon/FormList";
import { FormGrid } from "../../components/formCommon/FormGrid";
import { FormLoading } from "../../components/formCommon/FormLoading";
import { FormAlert } from "../../components/formCommon/FormAlert";
import { Box, Typography, Container, Button } from "@mui/material";

export const DistributorDashboard = () => {
  const { data, loading, error } = useDistributorDashboard();

  if (loading) return <FormLoading fullScreen />;

  if (error) return (
    <Box sx={{ p: 3 }}>
      <FormAlert severity="error" message={error} />
    </Box>
  );

  if (!data) return null;

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
          Distributor Dashboard
        </Typography>

        {/* Summary Cards */}
        <FormGrid container spacing={3} sx={{ mb: 4 }}>
          <FormGrid xs={12} sm={6} md={3}>
            <FormCard
              title="Total Orders"
              value={data.orders.total}
              icon="📦"
            />
          </FormGrid>
          <FormGrid xs={12} sm={6} md={3}>
            <FormCard
              title="Draft Orders"
              value={data.orders.drafts.length}
              icon="📝"
            />
          </FormGrid>
          <FormGrid xs={12} sm={6} md={3}>
            <FormCard
              title="Available Stock"
              value={data.stock.available}
              icon="🏭"
            />
          </FormGrid>
          <FormGrid xs={12} sm={6} md={3}>
            <FormCard
              title="Active Shipments"
              value={data.shipments.length}
              icon="🚚"
            />
          </FormGrid>
        </FormGrid>

        {/* Draft Orders and Shipments Section */}
        <FormGrid container spacing={3} sx={{ mb: 4 }}>
          {/* Draft Orders */}
          <FormGrid xs={12} lg={6}>
            <FormList
              title="Draft Orders"
              items={data.orders.drafts.map(draft => ({
                id: draft.id,
                title: draft.customer,
                subtitle: `Created: ${new Date(draft.createdAt).toLocaleDateString()}`,
                secondary: (
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                  >
                    Complete
                  </Button>
                ),
                status: 'info'
              }))}
            />
          </FormGrid>

          {/* Active Shipments */}
          <FormGrid xs={12} lg={6}>
            <FormList
              title="Active Shipments"
              items={data.shipments.map(shipment => ({
                id: shipment.id,
                title: `Order #${shipment.orderId}`,
                subtitle: `To: ${shipment.destination}`,
                secondary: `Delivery: ${new Date(shipment.estimatedDelivery).toLocaleDateString()}`,
                status: shipment.status === "in_transit" ? "info" : "success"
              }))}
            />
          </FormGrid>
        </FormGrid>

        {/* Recommendations and Notifications Section */}
        <FormGrid container spacing={3}>
          {/* Product Recommendations */}
          <FormGrid xs={12} lg={6}>
            <FormList
              title="Recommended Products"
              items={data.recommendations.map(product => ({
                id: product.id,
                title: product.name,
                subtitle: `Stock: ${product.stockLevel} | Demand: ${product.demandScore}`,
                secondary: `$${product.price.toLocaleString()}`,
                status: 'success'
              }))}
            />
          </FormGrid>

          {/* Notifications Panel */}
          <FormGrid xs={12} lg={6}>
            <FormAlert
              title="System Notifications"
              severity="info"
              message={data.notifications[0]?.message || "No new notifications"}
              date={data.notifications[0]?.date}
            />
          </FormGrid>
        </FormGrid>
      </Box>
    </Container>
  );
};
