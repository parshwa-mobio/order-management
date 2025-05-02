import { GlobalAlert } from "../../hooks/useExportDashboard";
import {
  Paper,
  Typography,
  Box,
  Stack,
  Alert,
  AlertTitle
} from "@mui/material";

export const GlobalAlerts = ({ alerts }: { alerts: GlobalAlert[] }) => {
  // Map severity to MUI Alert severity
  const getSeverity = (severity: string) => {
    switch (severity) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      default:
        return "info";
    }
  };

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
        Global Alerts
      </Typography>

      <Stack spacing={2}>
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            severity={getSeverity(alert.severity)}
            variant="outlined"
            sx={{
              borderLeftWidth: 4,
              '& .MuiAlert-message': {
                width: '100%'
              },
              transition: 'all 0.2s',
              '&:hover': {
                boxShadow: (theme) => theme.shadows[1]
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <AlertTitle sx={{ m: 0, fontWeight: 500 }}>
                {alert.type.toUpperCase()}
              </AlertTitle>
              <Typography variant="caption" color="text.secondary">
                {alert.date}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {alert.message}
            </Typography>
          </Alert>
        ))}
      </Stack>
    </Paper>
  );
};
