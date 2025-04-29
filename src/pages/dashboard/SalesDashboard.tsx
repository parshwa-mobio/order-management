import { useState } from "react";
import { useSalesDashboard } from "../../hooks/useSalesDashboard";
import { SalesTargetChart } from "../../components/dashboard/SalesTargetChart";
import { GrowthTrendChart } from "../../components/dashboard/GrowthTrendChart";
import { DistributorPerformancePanel } from "../../components/dashboard/DistributorPerformancePanel";
import { LowStockAlertsPanel } from "../../components/dashboard/LowStockAlertsPanel";
import { ReturnRequestsPanel } from "../../components/dashboard/ReturnRequestsPanel";
import { RecentOrdersTable } from "../../components/dashboard/RecentOrdersTable";

export const SalesDashboard = () => {
  const [selectedDistributorId, setSelectedDistributorId] =
    useState<string>("");
  const {
    loading,
    salesTargets,
    growthTrends,
    distributorPerformance,
    lowStockAlerts,
    returnRequests,
    recentOrders,
  } = useSalesDashboard(selectedDistributorId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Sales Dashboard</h1>

      <SalesTargetChart salesTargets={salesTargets} />
      <GrowthTrendChart growthTrends={growthTrends} />

      <DistributorPerformancePanel
        distributorPerformance={distributorPerformance}
        selectedDistributorId={selectedDistributorId}
        onDistributorChange={setSelectedDistributorId}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LowStockAlertsPanel lowStockAlerts={lowStockAlerts} />
        <ReturnRequestsPanel returnRequests={returnRequests} />
      </div>

      <RecentOrdersTable recentOrders={recentOrders} />
    </div>
  );
};
