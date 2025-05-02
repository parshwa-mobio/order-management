import { Paper, Typography, Box } from "@mui/material";
import React from "react";

interface FormChartProps {
  title: string;
  children: React.ReactNode;
  height?: number;
  width?: number;
}

export const FormChart: React.FC<FormChartProps> = ({
  title,
  children,
  height = 300,
  width = 800
}) => {
  const scrollbarStyles = {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 4
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 2,
        position: 'relative',
        zIndex: 1,
        boxShadow: 2
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        {title}
      </Typography>
      <Box sx={{
        width: '100%',
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
          height: scrollbarStyles.height,
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: scrollbarStyles.backgroundColor,
          borderRadius: scrollbarStyles.borderRadius
        }
      }}>
        <Box sx={{ 
          width,
          height,
          maxWidth: '100%',
          margin: '0 auto'
        }}>
          {children}
        </Box>
      </Box>
    </Paper>
  );
};