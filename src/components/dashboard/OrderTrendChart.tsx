import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface OrderTrendChartProps {
  data: Array<{ date: string; count: number }>;
}

export const OrderTrendChart = ({ data }: OrderTrendChartProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow h-full">
      <h2 className="text-lg font-semibold mb-4">Order Trend (30 Days)</h2>
      <div className="w-full flex justify-center items-center">
        <LineChart width={400} height={250} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#8884d8" />
        </LineChart>
      </div>
    </div>
  );
};
