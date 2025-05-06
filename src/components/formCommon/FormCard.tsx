import { Card, CardContent, Typography, Box, CardProps } from "@mui/material";
import React from "react";

interface FormCardProps extends CardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "primary" | "secondary" | "info" | "success" | "warning" | "error";
}

export const FormCard: React.FC<FormCardProps> = ({
  title,
  value,
  icon,
  trend,
  color = "primary",
  ...props
}) => {
  return (
    <Card 
      elevation={2} 
      sx={{ 
        height: "100%",
        bgcolor: `${color}.light`,
        color: `${color}.contrastText`,
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: (theme) => theme.shadows[4],
          transform: 'translateY(-2px)'
        }
      }}
      {...props}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
              {value}
            </Typography>
            {trend && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: 1,
                  color: trend.isPositive ? "success.main" : "error.main",
                }}
              >
                {trend.isPositive ? "↑" : "↓"}
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  {trend.value}%
                </Typography>
              </Box>
            )}
          </Box>
          {icon && (
            <Box sx={{ fontSize: 40 }}>
              {icon}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}; 