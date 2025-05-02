import { useState, memo } from "react";
import { useSalesDashboard } from "../../hooks/useSalesDashboard";
import { SalesTargetChart } from "../../components/dashboard/SalesTargetChart";
import { GrowthTrendChart } from "../../components/dashboard/GrowthTrendChart";
import { DistributorPerformancePanel } from "../../components/dashboard/DistributorPerformancePanel";
import { LowStockAlertsPanel } from "../../components/dashboard/LowStockAlertsPanel";
import { ReturnRequestsPanel } from "../../components/dashboard/ReturnRequestsPanel";
import { RecentOrdersTable } from "../../components/dashboard/RecentOrdersTable";
import { FormGrid } from "../../components/formCommon/FormGrid";
import { FormLoading } from "../../components/formCommon/FormLoading";
import {
  Box,
  Typography,
  Container,
  Stack
} from "@mui/material";

const DashboardSection = memo(({ children }: { children: React.ReactNode }) => (
  <Box sx={{ mb: 4 }}>
    {children}
  </Box>
));

export const SalesDashboard = memo(() => {
  const [selectedDistributorId, setSelectedDistributorId] = useState<string>("");
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
    return <FormLoading fullScreen />;
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
          Sales Dashboard
        </Typography>

        <Stack spacing={4}>
          <DashboardSection>
            <SalesTargetChart salesTargets={salesTargets} />
          </DashboardSection>

          <DashboardSection>
            <GrowthTrendChart growthTrends={growthTrends} />
          </DashboardSection>

          <DashboardSection>
            <DistributorPerformancePanel
              distributorPerformance={distributorPerformance}
              selectedDistributorId={selectedDistributorId}
              onDistributorChange={setSelectedDistributorId}
            />
          </DashboardSection>

          <FormGrid container spacing={3}>
            <FormGrid xs={12} lg={6}>
              <LowStockAlertsPanel lowStockAlerts={lowStockAlerts} />
            </FormGrid>
            <FormGrid xs={12} lg={6}>
              <ReturnRequestsPanel returnRequests={returnRequests} />
            </FormGrid>
          </FormGrid>

          <DashboardSection>
            <RecentOrdersTable recentOrders={recentOrders} />
          </DashboardSection>
        </Stack>
      </Box>
    </Container>
  );
});
