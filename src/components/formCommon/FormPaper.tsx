import { Paper, PaperProps, Typography, Box } from "@mui/material";
import React from "react";

interface FormPaperProps extends PaperProps {
  title?: string;
  children: React.ReactNode;
}

export const FormPaper: React.FC<FormPaperProps> = ({
  title,
  children,
  ...props
}) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 2,
        position: 'relative',
        zIndex: 1,
        boxShadow: (theme) => theme.shadows[2],
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: (theme) => theme.shadows[4]
        }
      }}
      {...props}
    >
      {title && (
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          {title}
        </Typography>
      )}
      <Box sx={{ mt: title ? 2 : 0 }}>
        {children}
      </Box>
    </Paper>
  );
}; 