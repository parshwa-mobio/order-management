import { useCallback } from "react";
import { toast, ToastOptions } from "react-toastify";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastConfig {
  position?: ToastOptions["position"];
  autoClose?: number;
  hideProgressBar?: boolean;
}

export const useToast = (config?: ToastConfig) => {
  const defaultConfig: ToastConfig = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    ...config,
  };

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const options: ToastOptions = {
      ...defaultConfig,
      type,
    };

    switch (type) {
      case "success":
        toast.success(message, options);
        break;
      case "error":
        toast.error(message, options);
        break;
      case "warning":
        toast.warning(message, options);
        break;
      default:
        toast.info(message, options);
    }
  }, [defaultConfig]);

  return { showToast };
};
