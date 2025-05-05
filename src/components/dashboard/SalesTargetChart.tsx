import { SalesTarget } from "../../hooks/dashboard/useSalesDashboard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Paper, Typography, Box, useTheme } from "@mui/material";

interface SalesTargetChartProps {
  salesTargets: SalesTarget[];
}

export const SalesTargetChart = ({ salesTargets }: SalesTargetChartProps) => {
  const theme = useTheme();

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
        Monthly Target vs Achieved
      </Typography>
      <Box sx={{
        width: '100%',
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
          height: 8,
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: 4
        }
      }}>
        <BarChart
          width={800}
          height={300}
          data={salesTargets}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          style={{ maxWidth: '100%' }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="target"
            fill={theme.palette.primary.light}
            name="Target"
          />
          <Bar
            dataKey="achieved"
            fill={theme.palette.success.light}
            name="Achieved"
          />
        </BarChart>
      </Box>
    </Paper>
  );
};
