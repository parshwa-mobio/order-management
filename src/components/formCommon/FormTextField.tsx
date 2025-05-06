import { TextField, TextFieldProps } from "@mui/material";
import React from "react";

interface FormTextFieldProps extends Omit<TextFieldProps, 'onChange'> {
  name: string;
  value: string | number | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  type?: "text" | "number" | "email" | "password";
  min?: string;
  step?: string;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  placeholder?: string;
  size?: "small" | "medium";
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  readOnly?: boolean;
}

export const FormTextField: React.FC<FormTextFieldProps> = ({
  name,
  value,
  onChange,
  type = "text",
  min,
  step,
  helperText,
  error,
  disabled,
  placeholder,
  startAdornment,
  endAdornment,
  readOnly,
  ...props
}) => {
  return (
    <TextField
      fullWidth
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      helperText={helperText}
      error={error}
      disabled={disabled}
      placeholder={placeholder}
      slotProps={{
        input: {
          readOnly,
          ...(type === 'number' && { min, step }),
          ...props.slotProps?.input
        }
      }}
      {...props}
    />
  );
};