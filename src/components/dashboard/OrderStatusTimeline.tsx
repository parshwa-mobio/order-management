import { OrderStatus } from "../../hooks/useExportDashboard";
import { Timeline } from "../Timeline";
import {
  Paper,
  Typography,
  Box,
  Stack,
  Chip,
  Divider
} from "@mui/material";

interface OrderStatusTimelineProps {
  orderStatuses: OrderStatus[];
}

export const OrderStatusTimeline = ({
  orderStatuses,
}: OrderStatusTimelineProps) => {
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
        Order Status Timeline
      </Typography>

      <Stack spacing={3}>
        {orderStatuses.map((order) => (
          <Paper
            key={order.id}
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
                {order.distributorName}
              </Typography>
              <Chip
                label={order.status}
                color={order.status === "completed" ? "success" : "warning"}
                size="small"
                variant="outlined"
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Timeline events={order.timeline} />
          </Paper>
        ))}
      </Stack>
    </Paper>
  );
};
