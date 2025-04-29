import { Shipment } from "../../hooks/useExportDashboard";

interface InternationalShipmentsProps {
  shipments: Shipment[];
}

export const InternationalShipments = ({
  shipments,
}: InternationalShipmentsProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">International Shipments</h2>
      <div className="space-y-6">
        {shipments.map((shipment) => (
          <div key={shipment.id} className="border p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">
                Tracking #{shipment.trackingNumber}
              </h3>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  shipment.status === "delivered"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {shipment.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Origin</p>
                <p>{shipment.origin}</p>
              </div>
              <div>
                <p className="text-gray-600">Destination</p>
                <p>{shipment.destination}</p>
              </div>
              <div>
                <p className="text-gray-600">Carrier</p>
                <p>{shipment.carrier}</p>
              </div>
              <div>
                <p className="text-gray-600">ETA</p>
                <p>{shipment.eta}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
