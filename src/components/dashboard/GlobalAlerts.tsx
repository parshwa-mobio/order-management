import { GlobalAlert } from "../../hooks/useExportDashboard";

export const GlobalAlerts = ({ alerts }: { alerts: GlobalAlert[] }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-lg font-semibold mb-4">Global Alerts</h2>
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`p-4 rounded-lg ${
            alert.severity === "high"
              ? "bg-red-50 border-l-4 border-red-500"
              : alert.severity === "medium"
                ? "bg-yellow-50 border-l-4 border-yellow-500"
                : "bg-blue-50 border-l-4 border-blue-500"
          }`}
        >
          <div className="flex justify-between items-center">
            <span
              className={`text-sm font-medium ${
                alert.severity === "high"
                  ? "text-red-800"
                  : alert.severity === "medium"
                    ? "text-yellow-800"
                    : "text-blue-800"
              }`}
            >
              {alert.type.toUpperCase()}
            </span>
            <span className="text-sm text-gray-500">{alert.date}</span>
          </div>
          <p className="mt-1 text-sm">{alert.message}</p>
        </div>
      ))}
    </div>
  </div>
);
