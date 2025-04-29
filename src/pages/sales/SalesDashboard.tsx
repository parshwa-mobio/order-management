import { useEffect, useState } from "react";
// import your chart library here, e.g.:
// import { LineChart, BarChart } from "recharts";

const SalesDashboard = () => {
  const [targets, setTargets] = useState(null);
  const [growthTrends, setGrowthTrends] = useState([]);
  const [distributorReports, setDistributorReports] = useState([]);
  const [decliningProducts, setDecliningProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const [targetsRes, trendsRes, reportsRes, decliningRes] =
          await Promise.all([
            fetch("http://localhost:5000/api/sales/targets", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch("http://localhost:5000/api/sales/growth-trends", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch("http://localhost:5000/api/sales/reports/distributor", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch("http://localhost:5000/api/sales/declining-products", {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);
        setTargets(await targetsRes.json());
        setGrowthTrends(await trendsRes.json());
        setDistributorReports(await reportsRes.json());
        setDecliningProducts(await decliningRes.json());
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Sales Dashboard</h1>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Target</h2>
          <p className="text-2xl font-bold">
            ${(targets as any)?.target?.toLocaleString() ?? "-"}
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Actual</h2>
          <p className="text-2xl font-bold text-green-600">
            ${(targets as any)?.achieved?.toLocaleString() ?? "-"}
          </p>
        </div>
      </div>

      {/* Growth Trends Graph */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-lg font-semibold mb-4">Growth Trends</h2>
        {/* Replace with your chart component */}
        {/* <LineChart data={growthTrends} ... /> */}
        <pre>{JSON.stringify(growthTrends, null, 2)}</pre>
      </div>

      {/* Distributor Reports Table */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-lg font-semibold mb-4">Distributor Reports</h2>
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Distributor</th>
              <th className="px-4 py-2">Region</th>
              <th className="px-4 py-2">Sales</th>
              <th className="px-4 py-2">Target</th>
              <th className="px-4 py-2">Actual</th>
            </tr>
          </thead>
          <tbody>
            {distributorReports.map((report: any) => (
              <tr key={report.id}>
                <td className="px-4 py-2">{report.name}</td>
                <td className="px-4 py-2">{report.region}</td>
                <td className="px-4 py-2">${report.sales?.toLocaleString()}</td>
                <td className="px-4 py-2">
                  ${report.target?.toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  ${report.actual?.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Declining Products Table */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-lg font-semibold mb-4">Declining Products</h2>
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Sales</th>
              <th className="px-4 py-2">Trend</th>
            </tr>
          </thead>
          <tbody>
            {decliningProducts.map((prod: any) => (
              <tr key={prod.id}>
                <td className="px-4 py-2">{prod.name}</td>
                <td className="px-4 py-2">{prod.sales}</td>
                <td className="px-4 py-2 text-red-600">{prod.trend}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add more sections for fast/slow moving products, region/product/distributor drill-down, etc. */}
    </div>
  );
};

export default SalesDashboard;
