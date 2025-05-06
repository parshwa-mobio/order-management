import { Alert, AlertProps, Box, Typography } from "@mui/material";
import React from "react";

interface FormAlertProps extends AlertProps {
  title?: string;
  date?: string;
  message: string;
  severity: "error" | "warning" | "info" | "success";
}

export const FormAlert: React.FC<FormAlertProps> = ({
  title,
  date,
  message,
  severity,
  ...props
}) => {
  return (
    <Alert
      severity={severity}
      variant="outlined"
      sx={{
        borderLeftWidth: 4,
        '& .MuiAlert-message': {
          width: '100%'
        },
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: (theme) => theme.shadows[1]
        }
      }}
      {...props}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {title && (
          <Typography variant="subtitle1" sx={{ m: 0, fontWeight: 500 }}>
            {title.toUpperCase()}
          </Typography>
        )}
        {date && (
          <Typography variant="caption" color="text.secondary">
            {date}
          </Typography>
        )}
      </Box>
      <Typography variant="body2" sx={{ mt: 1 }}>
        {message}
      </Typography>
    </Alert>
  );
}; 