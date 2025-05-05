import { GrowthTrend } from "../../hooks/dashboard/useSalesDashboard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  Paper,
  Typography,
  Box,
  useTheme
} from "@mui/material";

interface GrowthTrendChartProps {
  growthTrends: GrowthTrend[];
}

export const GrowthTrendChart = ({ growthTrends }: GrowthTrendChartProps) => {
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
        Growth Trends
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
        <LineChart
          width={800}
          height={300}
          data={growthTrends}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          style={{ maxWidth: '100%' }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="growth"
            stroke={theme.palette.primary.main}
            name="Growth %"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke={theme.palette.success.main}
            name="Revenue"
          />
        </LineChart>
      </Box>
    </Paper>
  );
};
