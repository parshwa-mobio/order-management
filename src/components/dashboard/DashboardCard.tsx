import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

interface DashboardCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  trend,
}) => {
  return (
    <Card elevation={2} sx={{ height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h5" sx={{ mt: 1, fontWeight: 600 }}>
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
                {trend.isPositive ? (
                  <ArrowUpwardIcon fontSize="small" />
                ) : (
                  <ArrowDownwardIcon fontSize="small" />
                )}
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  {trend.value}%
                </Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ color: "primary.main", fontSize: 40 }}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );
};
