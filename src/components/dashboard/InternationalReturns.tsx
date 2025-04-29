import { InternationalReturn } from "../../hooks/useExportDashboard";

interface InternationalReturnsProps {
  returns: InternationalReturn[];
}

export const InternationalReturns = ({
  returns,
}: InternationalReturnsProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">International Returns</h2>
      <div className="space-y-6">
        {returns.map((returnItem) => (
          <div key={returnItem.id} className="border p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="font-medium">{returnItem.distributorName}</h3>
                <p className="text-sm text-gray-600">{returnItem.country}</p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  returnItem.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {returnItem.status}
              </span>
            </div>
            <div className="mt-4 space-y-2">
              {returnItem.items.map((item, index) => (
                <div key={index} className="text-sm">
                  <span>{item.productName}</span>
                  <span className="mx-2">-</span>
                  <span>{item.quantity} units</span>
                  <p className="text-gray-600 text-xs mt-1">{item.reason}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
