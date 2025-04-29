import { Document } from "../../hooks/useExportDashboard";

interface ExportDocumentsProps {
  documents: Document[];
}

export const ExportDocuments = ({ documents }: ExportDocumentsProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Export Documents</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <div key={doc.id} className="border p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">{doc.name}</h3>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  doc.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {doc.status}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              <p>Type: {doc.type}</p>
              <p>Uploaded by: {doc.uploadedBy}</p>
              <p>Date: {doc.uploadDate}</p>
            </div>
            <button
              onClick={() => window.open(doc.url, "_blank")}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View Document
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
