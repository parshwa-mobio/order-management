import { Paper, PaperProps } from "@mui/material";
import React from "react";

interface PaperBoxProps extends PaperProps {
  children: React.ReactNode;
}

export const PaperBox: React.FC<PaperBoxProps> = ({ children, ...props }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 2,
        bgcolor: 'background.paper',
        '& .MuiTextField-root': {
          bgcolor: 'background.default'
        },
        ...props.sx
      }}
      {...props}
    >
      {children}
    </Paper>
  );
};