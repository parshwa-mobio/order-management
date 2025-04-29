import React, { useState } from "react";
import { Calendar, Download } from "lucide-react";

interface SalesData {
  category: string;
  revenue: number;
  orders: number;
  growth: number;
}

const Reports = () => {
  const [dateRange, setDateRange] = useState("month");

  // Sample sales data - will be replaced with API call
  const salesData: SalesData[] = [
    {
      category: "Frozen Foods",
      revenue: 125000,
      orders: 450,
      growth: 12.5,
    },
    {
      category: "Spices",
      revenue: 85000,
      orders: 320,
      growth: 8.2,
    },
    {
      category: "Ready Meals",
      revenue: 95000,
      orders: 280,
      growth: 15.8,
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sales Reports</h1>
        <div className="flex gap-4">
          <select
            className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Total Revenue
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            $
            {salesData
              .reduce((sum, item) => sum + item.revenue, 0)
              .toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">vs. previous period</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Total Orders
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {salesData
              .reduce((sum, item) => sum + item.orders, 0)
              .toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">vs. previous period</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Average Growth
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {(
              salesData.reduce((sum, item) => sum + item.growth, 0) /
              salesData.length
            ).toFixed(1)}
            %
          </p>
          <p className="text-sm text-gray-500 mt-1">vs. previous period</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Sales by Category
          </h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Growth
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salesData.map((item) => (
                <tr key={item.category} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${item.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.orders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span
                      className={`${item.growth >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {item.growth >= 0 ? "+" : ""}
                      {item.growth}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
