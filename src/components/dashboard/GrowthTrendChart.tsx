import { GrowthTrend } from "../../hooks/useSalesDashboard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface GrowthTrendChartProps {
  growthTrends: GrowthTrend[];
}

export const GrowthTrendChart = ({ growthTrends }: GrowthTrendChartProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Growth Trends</h2>
      <LineChart width={800} height={300} data={growthTrends}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="growth"
          stroke="#8884d8"
          name="Growth %"
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#82ca9d"
          name="Revenue"
        />
      </LineChart>
    </div>
  );
};
