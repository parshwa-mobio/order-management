import { Box, CircularProgress } from "@mui/material";
import React from "react";

interface FormLoadingProps {
  fullScreen?: boolean;
  size?: number;
}

export const FormLoading: React.FC<FormLoadingProps> = ({
  fullScreen = false,
  size = 40
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: fullScreen ? '100vh' : '100%',
        width: '100%'
      }}
    >
      <CircularProgress size={size} />
    </Box>
  );
}; 