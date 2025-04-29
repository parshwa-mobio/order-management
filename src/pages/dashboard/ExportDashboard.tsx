import { useExportDashboard } from "../../hooks/useExportDashboard";
import { GlobalAlerts } from "../../components/dashboard/GlobalAlerts";
import { InternationalShipments } from "../../components/dashboard/InternationalShipments";
import { OrderStatusTimeline } from "../../components/dashboard/OrderStatusTimeline";
import { InternationalReturns } from "../../components/dashboard/InternationalReturns";
import { ExportDocuments } from "../../components/dashboard/ExportDocuments";

export const ExportDashboard = () => {
  const { loading, shipments, orderStatuses, returns, documents, alerts } =
    useExportDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Export Dashboard</h1>
      <GlobalAlerts alerts={alerts} />
      <InternationalShipments shipments={shipments} />
      <OrderStatusTimeline orderStatuses={orderStatuses} />
      <InternationalReturns returns={returns} />
      <ExportDocuments documents={documents} />
    </div>
  );
};
