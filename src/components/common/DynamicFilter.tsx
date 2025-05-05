import React, { memo } from "react";
import {
  SelectChangeEvent,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { FormGrid } from "../formCommon/FormGrid";
import { FormBox } from "../formCommon/FormBox";
import { FormTextField } from "../formCommon/FormTextField";
import { FormSelect } from "../formCommon/FormSelect";
import { FormPaper } from "../formCommon/FormPaper";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterField {
  field: string;
  label: string;
  type: 'text' | 'select' | 'date';
  options?: FilterOption[];
}

interface DynamicFilterProps {
  filters: FilterField[];
  values: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

const FilterField = memo(({ 
  filter, 
  value, 
  onChange 
}: { 
  filter: FilterField; 
  value: string; 
  onChange: (field: string, value: string) => void;
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | SelectChangeEvent<string>
  ) => {
    onChange(filter.field, e.target.value);
  };

  if (filter.type === 'text') {
    return (
      <FormTextField
        name={filter.field}
        placeholder={`Search ${filter.label.toLowerCase()}...`}
        value={value}
        onChange={handleChange}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }
        }}
        size="small"
      />
    );
  }

  if (filter.type === 'select') {
    return (
      <FormSelect
        id={filter.field}
        name={filter.field}
        label={filter.label}
        value={value}
        onChange={handleChange}
        options={filter.options}
      />
    );
  }

  // For date type, use TextField directly from MUI instead of FormTextField
  // Updated date field to use slotProps instead of InputLabelProps
  return (
    <TextField
      name={filter.field}
      type="date"
      label={filter.label}
      value={value}
      onChange={handleChange}
      slotProps={{
        inputLabel: {
          shrink: true
        }
      }}
      size="small"
      fullWidth
    />
  );
});

export const DynamicFilter = memo(({
  filters,
  values,
  onChange,
}: DynamicFilterProps) => {
  return (
    <FormPaper sx={{ p: 2, mb: 3 }}>
      <FormBox>
        <FormGrid container spacing={2} alignItems="center">
          {filters.map((filter) => (
            <FormGrid 
              item 
              xs={12} 
              md={filter.type === 'text' ? 6 : 3} 
              key={filter.field}
            >
              <FilterField
                filter={filter}
                value={values[filter.field] || ''}
                onChange={onChange}
              />
            </FormGrid>
          ))}
        </FormGrid>
      </FormBox>
    </FormPaper>
  );
});