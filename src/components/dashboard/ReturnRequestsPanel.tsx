import { ReturnRequest } from "../../hooks/dashboard/useSalesDashboard";
import {
  Paper,
  Typography,
  Box,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText
} from "@mui/material";

interface ReturnRequestsPanelProps {
  returnRequests: ReturnRequest[];
}

export const ReturnRequestsPanel = ({
  returnRequests,
}: ReturnRequestsPanelProps) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 2,
        height: '100%',
        position: 'relative',
        zIndex: 1,
        boxShadow: (theme) => theme.shadows[2]
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Pending Return Requests
      </Typography>

      <Stack spacing={2}>
        {returnRequests.map((request) => (
          <Paper
            key={request.id}
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 2,
              transition: 'all 0.2s',
              '&:hover': {
                boxShadow: (theme) => theme.shadows[1],
                bgcolor: 'background.default'
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {request.distributorName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {request.date}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <List disablePadding>
              {request.products.map((product, index) => (
                <ListItem
                  key={`${request.id}-${product.name}-${index}`}
                  disablePadding
                  sx={{ py: 0.5 }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2">
                          {product.name}
                        </Typography>
                        <Typography variant="body2" sx={{ mx: 1 }}>-</Typography>
                        <Typography variant="body2">
                          {product.quantity} units
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                        {product.reason}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        ))}
      </Stack>
    </Paper>
  );
};
