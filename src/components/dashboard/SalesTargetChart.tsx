import { SalesTarget } from "../../hooks/useSalesDashboard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface SalesTargetChartProps {
  salesTargets: SalesTarget[];
}

export const SalesTargetChart = ({ salesTargets }: SalesTargetChartProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Monthly Target vs Achieved</h2>
      <BarChart width={800} height={300} data={salesTargets}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="target" fill="#8884d8" name="Target" />
        <Bar dataKey="achieved" fill="#82ca9d" name="Achieved" />
      </BarChart>
    </div>
  );
};
