import { DistributorPerformance } from "../../hooks/useSalesDashboard";
import {
  Paper,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  SelectChangeEvent,
  useTheme
} from "@mui/material";
import { FormGrid } from "../formCommon/FormGrid";

interface DistributorPerformancePanelProps {
  distributorPerformance: DistributorPerformance[];
  selectedDistributorId: string;
  onDistributorChange: (distributorId: string) => void;
}

export const DistributorPerformancePanel = ({
  distributorPerformance,
  selectedDistributorId,
  onDistributorChange,
}: DistributorPerformancePanelProps) => {
  const theme = useTheme();

  const handleChange = (event: SelectChangeEvent) => {
    onDistributorChange(event.target.value);
  };

  const selectedDistributor = distributorPerformance.find(
    (dist) => dist.id === selectedDistributorId
  );

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Distributor Performance
        </Typography>

        <FormControl
          sx={{
            minWidth: 200,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(0, 0, 0, 0.23)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(0, 0, 0, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: (theme) => theme.palette.primary.main,
              },
            },
          }}
          size="small"
        >
          <InputLabel id="distributor-select-label">Select Distributor</InputLabel>
          <Select
            labelId="distributor-select-label"
            id="distributor-select"
            value={selectedDistributorId}
            label="Select Distributor"
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>Select Distributor</em>
            </MenuItem>
            {distributorPerformance.map((dist) => (
              <MenuItem key={dist.id} value={dist.id}>
                {dist.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {selectedDistributorId && selectedDistributor?.metrics && (
        <Grid container spacing={3}>
          <FormGrid xs={12} md={4}>
            <Card sx={{
              bgcolor: theme.palette.info.light,
              color: theme.palette.info.contrastText,
              height: '100%'
            }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                  Orders
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                  {selectedDistributor.metrics.orderCount}
                </Typography>
              </CardContent>
            </Card>
          </FormGrid>

          <FormGrid xs={12} md={4}>
            <Card sx={{
              bgcolor: theme.palette.success.light,
              color: theme.palette.success.contrastText,
              height: '100%'
            }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                  Revenue
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                  ${selectedDistributor.metrics.revenue.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </FormGrid>

          <FormGrid xs={12} md={4}>
            <Card sx={{
              bgcolor: theme.palette.secondary.light,
              color: theme.palette.secondary.contrastText,
              height: '100%'
            }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                  Growth
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                  {selectedDistributor.metrics.growth}
                </Typography>
              </CardContent>
            </Card>
          </FormGrid>
        </Grid>
      )}
    </Paper>
  );
};
