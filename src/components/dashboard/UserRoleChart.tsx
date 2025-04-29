import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface UserRoleChartProps {
  data: Array<{ role: string; count: number }>;
}

export const UserRoleChart = ({ data }: UserRoleChartProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow h-full">
      <h2 className="text-lg font-semibold mb-4">Users by Role</h2>
      <div className="w-full flex justify-center items-center">
        <BarChart width={400} height={250} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="role" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#82ca9d" />
        </BarChart>
      </div>
    </div>
  );
};
