import React from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  SelectChangeEvent
} from "@mui/material";

interface ProductFormInputProps {
  label: string;
  name: string;
  value: string | number;
  type: "text" | "number" | "select";
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | SelectChangeEvent<string>
  ) => void;
  required?: boolean;
  min?: number;
  step?: string;
  options?: { value: string; label: string }[];
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  sx?: Record<string, any>;
}

export const ProductFormInput: React.FC<ProductFormInputProps> = ({
  label,
  name,
  value,
  type,
  onChange,
  required = false,
  min,
  step,
  options,
  error = false,
  helperText,
  disabled = false,
  fullWidth = true,
  sx = {},
}) => {
  return (
    <Box sx={{ mb: 2, ...sx }}>
      {type === "select" ? (
        <FormControl fullWidth={fullWidth} required={required} error={error} disabled={disabled}>
          <InputLabel id={`${name}-label`}>{label}</InputLabel>
          <Select
            labelId={`${name}-label`}
            id={name}
            name={name}
            value={value.toString()}
            label={label}
            onChange={onChange as (e: SelectChangeEvent<string>) => void}
            size="small"
          >
            <MenuItem value="">
              <em>Select {label}</em>
            </MenuItem>
            {options?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {helperText && (
            <Box component="p" sx={{ color: error ? 'error.main' : 'text.secondary', mt: 0.5, fontSize: '0.75rem' }}>
              {helperText}
            </Box>
          )}
        </FormControl>
      ) : (
        <TextField
          type={type}
          name={name}
          label={label}
          value={value}
          onChange={onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
          required={required}
          error={error}
          helperText={helperText}
          disabled={disabled}
          fullWidth={fullWidth}
          variant="outlined"
          size="small"
          inputProps={{
            min: min,
            step: step
          }}
        />
      )}
    </Box>
  );
};
