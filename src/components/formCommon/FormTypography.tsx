import { Typography, TypographyProps } from "@mui/material";
import React from "react";

interface FormTypographyProps extends TypographyProps {
  children: React.ReactNode;
}

export const FormTypography: React.FC<FormTypographyProps> = ({ children, ...props }) => {
  return (
    <Typography {...props}>
      {children}
    </Typography>
  );
};