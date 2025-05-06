import { useState, useEffect } from "react";
import { Alert, Snackbar, Box, Stack, SnackbarOrigin } from "@mui/material";

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

  // Convert position to MUI anchor origin
  const getAnchorOrigin = (pos: string): SnackbarOrigin => {
    switch (pos) {
      case "top-right":
        return { vertical: "top", horizontal: "right" };
      case "top-left":
        return { vertical: "top", horizontal: "left" };
      case "bottom-right":
        return { vertical: "bottom", horizontal: "right" };
      case "bottom-left":
        return { vertical: "bottom", horizontal: "left" };
      default:
        return { vertical: "bottom", horizontal: "right" };
    }
  };

  const anchorOrigin = getAnchorOrigin(position);

  return (
    <Box sx={{ position: "fixed", zIndex: 9999 }}>
      <Stack spacing={2} sx={{ width: "100%", maxWidth: 300 }}>
        {toasts.map((toast) => (
          <Snackbar
            key={toast.id}
            open={true}
            anchorOrigin={anchorOrigin}
            sx={{ position: "relative" }}
          >
            <Alert
              severity={toast.type}
              variant="filled"
              sx={{ width: "100%" }}
            >
              {toast.message}
            </Alert>
          </Snackbar>
        ))}
      </Stack>
    </Box>
  );
};

export default Toaster;
