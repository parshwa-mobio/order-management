import { useDistributorDashboard } from "../../hooks/useDistributorDashboard";
import { DashboardCard } from "../../components/dashboard/DashboardCard";
import { NotificationsPanel } from "../../components/dashboard/NotificationsPanel";
import { FormGrid } from "../../components/formCommon/FormGrid";
import {
  Box,
  Typography,
  Container,
  Grid,
  CircularProgress,
  Paper,
  Stack,
  Button,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemText
} from "@mui/material";

export const DistributorDashboard = () => {
  const { data, loading, error } = useDistributorDashboard();

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

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
          Distributor Dashboard
        </Typography>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <FormGrid xs={12} sm={6} md={3}>
            <DashboardCard
              title="Total Orders"
              value={data.orders.total}
              icon="📦"
            />
          </FormGrid>
          <FormGrid xs={12} sm={6} md={3}>
            <DashboardCard
              title="Draft Orders"
              value={data.orders.drafts.length}
              icon="📝"
            />
          </FormGrid>
          <FormGrid xs={12} sm={6} md={3}>
            <DashboardCard
              title="Available Stock"
              value={data.stock.available}
              icon="🏭"
            />
          </FormGrid>
          <FormGrid xs={12} sm={6} md={3}>
            <DashboardCard
              title="Active Shipments"
              value={data.shipments.length}
              icon="🚚"
            />
          </FormGrid>
        </Grid>

        {/* Draft Orders and Shipments Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Draft Orders */}
          <FormGrid xs={12} lg={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Draft Orders
              </Typography>
              <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                <Stack spacing={2}>
                  {data.orders.drafts.map((draft) => (
                    <Paper
                      key={draft.id}
                      variant="outlined"
                      sx={{
                        p: 2,
                        bgcolor: 'background.default',
                        borderRadius: 2,
                        '&:hover': {
                          bgcolor: 'action.hover'
                        },
                        transition: 'background-color 0.3s'
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                            {draft.customer}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Created: {new Date(draft.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                        >
                          Complete
                        </Button>
                      </Box>

                      <List dense disablePadding sx={{ mt: 1 }}>
                        {draft.products.map((product, idx) => (
                          <ListItem
                            key={`${draft.id}-${product.name}-${idx}`}
                            disablePadding
                            sx={{ py: 0.5 }}
                          >
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Typography variant="body2" color="text.secondary">
                                    {product.name}
                                  </Typography>
                                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    x {product.quantity}
                                  </Typography>
                                </Box>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  ))}
                </Stack>
              </Box>
            </Paper>
          </FormGrid>

          {/* Active Shipments */}
          <FormGrid xs={12} lg={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Active Shipments
              </Typography>
              <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                <Stack spacing={2}>
                  {data.shipments.map((shipment) => (
                    <Paper
                      key={shipment.id}
                      variant="outlined"
                      sx={{
                        p: 2,
                        bgcolor: 'background.default',
                        borderRadius: 2,
                        '&:hover': {
                          bgcolor: 'action.hover'
                        },
                        transition: 'background-color 0.3s'
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                            Order #{shipment.orderId}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            To: {shipment.destination}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Delivery: {new Date(shipment.estimatedDelivery).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Chip
                          label={shipment.status}
                          color={shipment.status === "in_transit" ? "info" : "success"}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              </Box>
            </Paper>
          </FormGrid>
        </Grid>

        {/* Recommendations and Notifications Section */}
        <Grid container spacing={3}>
          {/* Product Recommendations */}
          <FormGrid xs={12} lg={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Recommended Products
              </Typography>
              <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                <Stack spacing={2}>
                  {data.recommendations.map((product) => (
                    <Paper
                      key={product.id}
                      variant="outlined"
                      sx={{
                        p: 2,
                        bgcolor: 'background.default',
                        borderRadius: 2,
                        '&:hover': {
                          bgcolor: 'action.hover'
                        },
                        transition: 'background-color 0.3s'
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                            {product.name}
                          </Typography>
                          <Box sx={{ mt: 0.5, display: 'flex', gap: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              Stock: {product.stockLevel}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Demand: {product.demandScore}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="subtitle1" color="success.main" sx={{ fontWeight: 500 }}>
                          ${product.price.toLocaleString()}
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              </Box>
            </Paper>
          </FormGrid>

          {/* Notifications Panel */}
          <FormGrid xs={12} lg={6}>
            <NotificationsPanel notifications={data.notifications} />
          </FormGrid>
        </Grid>
      </Box>
    </Container>
  );
};
