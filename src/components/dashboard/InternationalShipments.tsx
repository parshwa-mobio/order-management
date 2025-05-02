import { Shipment } from "../../hooks/useExportDashboard";
import {
  Paper,
  Typography,
  Box,
  Stack,
  Chip,
  Grid
} from "@mui/material";

interface InternationalShipmentsProps {
  shipments: Shipment[];
}

export const InternationalShipments = ({
  shipments,
}: InternationalShipmentsProps) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 2,
        position: 'relative',
        zIndex: 1,
        boxShadow: (theme) => theme.shadows[2]
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        International Shipments
      </Typography>

      <Stack spacing={3}>
        {shipments.map((shipment) => (
          <Paper
            key={shipment.id}
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: 2,
              transition: 'all 0.2s',
              '&:hover': {
                boxShadow: (theme) => theme.shadows[1],
                bgcolor: 'background.default'
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                Tracking #{shipment.trackingNumber}
              </Typography>
              <Chip
                label={shipment.status}
                color={shipment.status === "delivered" ? "success" : "info"}
                size="small"
                variant="outlined"
              />
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 1.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Origin
                  </Typography>
                  <Typography variant="body1">
                    {shipment.origin}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 1.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Destination
                  </Typography>
                  <Typography variant="body1">
                    {shipment.destination}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Carrier
                  </Typography>
                  <Typography variant="body1">
                    {shipment.carrier}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    ETA
                  </Typography>
                  <Typography variant="body1">
                    {shipment.eta}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Stack>
    </Paper>
  );
};
