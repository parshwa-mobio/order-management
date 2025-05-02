import { useState } from "react";
import { useSalesDashboard } from "../../hooks/useSalesDashboard";
import { SalesTargetChart } from "../../components/dashboard/SalesTargetChart";
import { GrowthTrendChart } from "../../components/dashboard/GrowthTrendChart";
import { DistributorPerformancePanel } from "../../components/dashboard/DistributorPerformancePanel";
import { LowStockAlertsPanel } from "../../components/dashboard/LowStockAlertsPanel";
import { ReturnRequestsPanel } from "../../components/dashboard/ReturnRequestsPanel";
import { RecentOrdersTable } from "../../components/dashboard/RecentOrdersTable";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Container,
  Stack
} from "@mui/material";

export const SalesDashboard = () => {
  const [selectedDistributorId, setSelectedDistributorId] =
    useState<string>("");
  const {
    loading,
    salesTargets,
    growthTrends,
    distributorPerformance,
    lowStockAlerts,
    returnRequests,
    recentOrders,
  } = useSalesDashboard(selectedDistributorId);

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

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
          Sales Dashboard
        </Typography>

        <Stack spacing={4}>
          <SalesTargetChart salesTargets={salesTargets} />
          <GrowthTrendChart growthTrends={growthTrends} />

          <DistributorPerformancePanel
            distributorPerformance={distributorPerformance}
            selectedDistributorId={selectedDistributorId}
            onDistributorChange={setSelectedDistributorId}
          />

          <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
              <LowStockAlertsPanel lowStockAlerts={lowStockAlerts} />
            </Grid>
            <Grid item xs={12} lg={6}>
              <ReturnRequestsPanel returnRequests={returnRequests} />
            </Grid>
          </Grid>

          <RecentOrdersTable recentOrders={recentOrders} />
        </Stack>
      </Box>
    </Container>
  );
};
