
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, SxProps, Theme } from "@mui/material";

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: SelectChangeEvent<string>) => void;
  options: Option[];
  required?: boolean;
  fullWidth?: boolean;  // Add fullWidth prop
  sx?: SxProps<Theme>;
}

export const FormSelect = ({
  id,
  name,
  label,
  value,
  onChange,
  options,
  required = false,
  fullWidth = true,  // Default to true for backward compatibility
  sx,
}: FormSelectProps) => {
  return (
    <FormControl fullWidth={fullWidth} required={required} sx={sx}>
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <Select
        labelId={`${id}-label`}
        id={id}
        name={name}
        value={value}
        label={label}
        onChange={onChange}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};