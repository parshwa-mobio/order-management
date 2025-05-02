import React from "react";
import { FormControl, InputLabel, Select, FormHelperText, SelectChangeEvent } from "@mui/material";

interface FormSelectProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: SelectChangeEvent) => void;
  children: React.ReactNode;
  fullWidth?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  sx?: any;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  children,
  fullWidth = true,
  required = false,
  error = false,
  helperText,
  sx,
}) => {
  return (
    <FormControl fullWidth={fullWidth} required={required} error={error} sx={sx}>
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <Select
        labelId={`${id}-label`}
        id={id}
        name={name}
        value={value}
        label={label}
        onChange={onChange}
      >
        {children}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};