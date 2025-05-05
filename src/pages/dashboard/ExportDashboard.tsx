import { useExportDashboard } from "../../hooks/dashboard/useExportDashboard";
import { FormList } from "../../components/formCommon/FormList";
import { FormAlert } from "../../components/formCommon/FormAlert";
import { FormLoading } from "../../components/formCommon/FormLoading";
import { FormTable } from "../../components/formCommon/FormTable";
import { Box, Typography, Container, Stack } from "@mui/material";

export const ExportDashboard = () => {
  const { loading, shipments, orderStatuses, returns, documents, alerts } =
    useExportDashboard();

  if (loading) {
    return <FormLoading fullScreen />;
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
          Export Dashboard
        </Typography>

        <Stack spacing={4}>
          <FormAlert
            title="Global Alerts"
            severity="info"
            message={alerts[0]?.message || "No active alerts"}
            date={alerts[0]?.date}
          />

          <FormList
            title="International Shipments"
            items={shipments.map(shipment => ({
              id: shipment.id,
              title: `Shipment #${shipment.id}`,
              subtitle: `From: ${shipment.origin} | To: ${shipment.destination}`,
              secondary: `ETA: ${new Date(shipment.eta).toLocaleDateString()}`,
              status: shipment.status === "in_transit" ? "info" : "success"
            }))}
          />

          <FormList
            title="Order Status Timeline"
            items={orderStatuses.map(status => ({
              id: status.id,
              title: status.distributorName,
              subtitle: status.timeline[0]?.description || "No status updates",
              secondary: status.timeline[0]?.date || "No date",
              status: status.status === "completed" ? "success" : "info"
            }))}
          />

          <FormList
            title="International Returns"
            items={returns.map(returnItem => ({
              id: returnItem.id,
              title: returnItem.distributorName,
              subtitle: `Country: ${returnItem.country}`,
              secondary: `Status: ${returnItem.status}`,
              status: returnItem.status === "pending" ? "warning" : "error"
            }))}
          />

          <FormTable
            title="Export Documents"
            columns={[
              { field: 'name', headerName: 'Document Name' },
              { field: 'type', headerName: 'Type' },
              { field: 'status', headerName: 'Status' },
              { field: 'uploadDate', headerName: 'Upload Date' }
            ]}
            rows={documents}
          />
        </Stack>
      </Box>
    </Container>
  );
};
