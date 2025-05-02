import { InternationalReturn } from "../../hooks/useExportDashboard";
import {
  Paper,
  Typography,
  Box,
  Stack,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText
} from "@mui/material";

interface InternationalReturnsProps {
  returns: InternationalReturn[];
}

export const InternationalReturns = ({
  returns,
}: InternationalReturnsProps) => {
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
        International Returns
      </Typography>

      <Stack spacing={3}>
        {returns.map((returnItem) => (
          <Paper
            key={returnItem.id}
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {returnItem.distributorName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {returnItem.country}
                </Typography>
              </Box>
              <Chip
                label={returnItem.status}
                color={returnItem.status === "approved" ? "success" : "warning"}
                size="small"
                variant="outlined"
              />
            </Box>

            <Divider sx={{ my: 1.5 }} />

            <List disablePadding>
              {returnItem.items.map((item, index) => (
                <ListItem
                  key={`${returnItem.id}-${item.productName}-${index}`}
                  disablePadding
                  sx={{ py: 0.75 }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2">
                          {item.productName}
                        </Typography>
                        <Typography variant="body2" sx={{ mx: 1 }}>-</Typography>
                        <Typography variant="body2">
                          {item.quantity} units
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                        {item.reason}
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
