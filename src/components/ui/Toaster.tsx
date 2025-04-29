import { useState, useEffect } from "react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface ToasterProps {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

export const Toaster = ({ position = "bottom-right" }: ToasterProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setToasts((currentToasts) => currentToasts.slice(1));
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const positionClasses = {
    "top-right": "top-0 right-0",
    "top-left": "top-0 left-0",
    "bottom-right": "bottom-0 right-0",
    "bottom-left": "bottom-0 left-0",
  };

  return (
    <div
      className={`fixed z-50 m-8 w-72 space-y-4 ${positionClasses[position]}`}
      role="alert"
      aria-live="assertive"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg p-4 ${
            toast.type === "success"
              ? "bg-green-50 text-green-800"
              : toast.type === "error"
                ? "bg-red-50 text-red-800"
                : "bg-blue-50 text-blue-800"
          } shadow-lg transform transition-all duration-300 ease-in-out`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default Toaster;
