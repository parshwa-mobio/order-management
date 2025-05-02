import { Box, Paper } from "@mui/material";
import { ReactNode } from "react";
import { FormTypography } from "./FormTypography";

interface FormContainerProps {
  title: string;
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
}

export const FormContainer = ({
  title,
  children,
  onSubmit,
}: FormContainerProps) => {
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <FormTypography variant="h5" component="h1" sx={{ mb: 3 }}>
        {title}
      </FormTypography>
      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
      >
        {children}
      </Box>
    </Paper>
  );
};
