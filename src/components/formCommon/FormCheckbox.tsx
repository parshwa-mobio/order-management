import { Checkbox, FormControlLabel, FormControlLabelProps } from "@mui/material";
import React, { memo } from "react";

interface FormCheckboxProps extends Omit<FormControlLabelProps, 'control'> {
  name: string;
  value: boolean;
  onChange: (event: React.SyntheticEvent, checked: boolean) => void;
  label: string;
  disabled?: boolean;
}

export const FormCheckbox: React.FC<FormCheckboxProps> = memo(({
  name,
  value,
  onChange,
  label,
  disabled = false,
  ...props
}) => (
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
));

FormCheckbox.displayName = 'FormCheckbox';