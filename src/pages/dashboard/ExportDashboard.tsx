import { useExportDashboard } from "../../hooks/useExportDashboard";
import { GlobalAlerts } from "../../components/dashboard/GlobalAlerts";
import { InternationalShipments } from "../../components/dashboard/InternationalShipments";
import { OrderStatusTimeline } from "../../components/dashboard/OrderStatusTimeline";
import { InternationalReturns } from "../../components/dashboard/InternationalReturns";
import { ExportDocuments } from "../../components/dashboard/ExportDocuments";
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  Stack
} from "@mui/material";

export const ExportDashboard = () => {
  const { loading, shipments, orderStatuses, returns, documents, alerts } =
    useExportDashboard();

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
          Export Dashboard
        </Typography>

        <Stack spacing={4}>
          <GlobalAlerts alerts={alerts} />
          <InternationalShipments shipments={shipments} />
          <OrderStatusTimeline orderStatuses={orderStatuses} />
          <InternationalReturns returns={returns} />
          <ExportDocuments documents={documents} />
        </Stack>
      </Box>
    </Container>
  );
};
