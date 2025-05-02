import { LowStockAlert } from "../../hooks/useSalesDashboard";
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider
} from "@mui/material";

interface LowStockAlertsPanelProps {
  lowStockAlerts: LowStockAlert[];
}

export const LowStockAlertsPanel = ({
  lowStockAlerts,
}: LowStockAlertsPanelProps) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 2,
        position: 'relative',
        zIndex: 1,
        height: '100%',
        boxShadow: (theme) => theme.shadows[2]
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Low Stock Alerts
      </Typography>

      <List sx={{ width: '100%' }}>
        {lowStockAlerts.map((alert, index) => (
          <Box key={alert.distributorId}>
            <ListItem
              alignItems="flex-start"
              sx={{
                borderLeft: 4,
                borderColor: 'error.main',
                pl: 2,
                mb: 1,
                borderRadius: 1,
                bgcolor: 'background.paper'
              }}
            >
              <Box sx={{ width: '100%' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {alert.distributorName}
                </Typography>

                <List disablePadding>
                  {alert.products.map((product) => (
                    <ListItem key={product.id} sx={{ py: 0.5 }}>
                      <ListItemText
                        primary={product.name}
                        sx={{ margin: 0 }}
                      />
                      <Typography variant="body2" color="error">
                        {product.currentStock} / {product.reorderPoint}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </ListItem>
            {index < lowStockAlerts.length - 1 && <Divider sx={{ my: 1 }} />}
          </Box>
        ))}
      </List>
    </Paper>
  );
};
