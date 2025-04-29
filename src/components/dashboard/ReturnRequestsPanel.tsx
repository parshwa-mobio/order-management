import { ReturnRequest } from "../../hooks/useSalesDashboard";

interface ReturnRequestsPanelProps {
  returnRequests: ReturnRequest[];
}

export const ReturnRequestsPanel = ({
  returnRequests,
}: ReturnRequestsPanelProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Pending Return Requests</h2>
      <div className="space-y-4">
        {returnRequests.map((request) => (
          <div key={request.id} className="border p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">{request.distributorName}</h3>
              <span className="text-sm text-gray-500">{request.date}</span>
            </div>
            <div className="space-y-2">
              {request.products.map((product, index) => (
                <div key={index} className="text-sm">
                  <span>{product.name}</span>
                  <span className="mx-2">-</span>
                  <span>{product.quantity} units</span>
                  <p className="text-gray-600 text-xs mt-1">{product.reason}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
