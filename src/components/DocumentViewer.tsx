interface DocumentViewerProps {
  url: string;
  type?: string;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  url,
  type,
}) => {
  const isImage =
    type?.startsWith("image/") || url.match(/\.(jpg|jpeg|png|gif)$/i);
  const isPDF = type === "application/pdf" || url.endsWith(".pdf");

  return (
    <div className="border rounded-lg overflow-hidden">
      {isImage ? (
        <img src={url} alt="Document preview" className="max-w-full h-auto" />
      ) : isPDF ? (
        <iframe
          src={url}
          className="w-full h-[600px]"
          title="PDF document viewer"
        />
      ) : (
        <div className="p-4 text-center">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View Document
          </a>
        </div>
      )}
    </div>
  );
};
