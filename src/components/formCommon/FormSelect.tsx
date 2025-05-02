import React from "react";
import { FormControl, InputLabel, Select, FormHelperText, SelectChangeEvent, MenuItem } from "@mui/material";

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: SelectChangeEvent) => void;
  options?: readonly SelectOption[];
  children?: React.ReactNode;
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
  options,
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
        {options ? (
          options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))
        ) : (
          children
        )}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};