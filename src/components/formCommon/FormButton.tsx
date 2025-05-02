import { Button, ButtonProps } from "@mui/material";
import React from "react";

interface FormButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export const FormButton: React.FC<FormButtonProps> = ({ children, ...props }) => {
  return (
    <Button
      variant="contained"
      color="primary"
      sx={{
        px: 4,
        py: 1.5,
        '&:hover': {
          bgcolor: 'primary.dark'
        },
        ...props.sx
      }}
      {...props}
    >
      {children}
    </Button>
  );
};