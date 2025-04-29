import { DistributorPerformance } from "../../hooks/useSalesDashboard";

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
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Distributor Performance</h2>
        <select
          value={selectedDistributorId}
          onChange={(e) => onDistributorChange(e.target.value)}
          className="border rounded-md p-2"
        >
          <option value="">Select Distributor</option>
          {distributorPerformance.map((dist) => (
            <option key={dist.id} value={dist.id}>
              {dist.name}
            </option>
          ))}
        </select>
      </div>
      {selectedDistributorId && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {distributorPerformance.find(
            (dist) => dist.id === selectedDistributorId,
          )?.metrics && (
            <>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800">Orders</h3>
                <p className="text-2xl font-bold text-blue-900">
                  {
                    distributorPerformance.find(
                      (dist) => dist.id === selectedDistributorId,
                    )?.metrics.orderCount
                  }
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="text-sm font-medium text-green-800">Revenue</h3>
                <p className="text-2xl font-bold text-green-900">
                  $
                  {distributorPerformance
                    .find((dist) => dist.id === selectedDistributorId)
                    ?.metrics.revenue.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="text-sm font-medium text-purple-800">Growth</h3>
                <p className="text-2xl font-bold text-purple-900">
                  {
                    distributorPerformance.find(
                      (dist) => dist.id === selectedDistributorId,
                    )?.metrics.growth
                  }
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
