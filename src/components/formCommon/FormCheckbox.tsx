import { Checkbox, FormControlLabel, FormControlLabelProps, FormHelperText, Box } from "@mui/material";
import React, { memo } from "react";

interface FormCheckboxProps extends Omit<FormControlLabelProps, 'control'> {
  name: string;
  value: boolean;
  onChange: (event: React.SyntheticEvent, checked: boolean) => void;
  label: string;
  disabled?: boolean;
  helperText?: string;
}

export const FormCheckbox: React.FC<FormCheckboxProps> = memo(({
  name,
  value,
  onChange,
  label,
  disabled = false,
  helperText,
  ...props
}) => (
  <Box>
    <FormControlLabel
      control={
        <Checkbox
          name={name}
          checked={value}
          onChange={onChange}
          disabled={disabled}
        />
      }
      label={label}
      {...props}
    />
    {helperText && (
      <FormHelperText sx={{ ml: 4 }}>{helperText}</FormHelperText>
    )}
  </Box>
));

FormCheckbox.displayName = 'FormCheckbox';