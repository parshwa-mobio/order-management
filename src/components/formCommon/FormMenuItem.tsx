import { MenuItem, MenuItemProps } from "@mui/material";
import React from "react";

interface FormMenuItemProps extends MenuItemProps {
  value: string;
  label: string;
}

export const FormMenuItem: React.FC<FormMenuItemProps> = ({ value, label, ...props }) => {
  return (
    <MenuItem value={value} {...props}>
      {label}
    </MenuItem>
  );
};