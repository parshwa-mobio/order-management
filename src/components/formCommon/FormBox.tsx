import { Box, BoxProps } from "@mui/material";
import React from "react";

interface FormBoxProps extends BoxProps {
  children: React.ReactNode;
}

export const FormBox: React.FC<FormBoxProps> = ({ children, ...props }) => {
  return (
    <Box {...props}>
      {children}
    </Box>
  );
};