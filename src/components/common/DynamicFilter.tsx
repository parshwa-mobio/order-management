import React, { memo } from "react";
import {
  TextField,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { FormGrid } from "../formCommon/FormGrid";
import { FormBox } from "../formCommon/FormBox";
import { PaperBox } from "./PaperBox";

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    onChange(filter.field, e.target.value);
  };

  if (filter.type === 'text') {
    return (
      <TextField
        fullWidth
        placeholder={`Search ${filter.label.toLowerCase()}...`}
        value={value}
        onChange={handleChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        size="small"
      />
    );
  }

  if (filter.type === 'select') {
    return (
      <FormControl fullWidth size="small">
        <InputLabel>{filter.label}</InputLabel>
        <Select
          value={value}
          onChange={handleChange}
          label={filter.label}
        >
          <MenuItem value="">All</MenuItem>
          {filter.options?.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  return (
    <TextField
      fullWidth
      type="date"
      label={filter.label}
      value={value}
      onChange={handleChange}
      InputLabelProps={{
        shrink: true,
      }}
      size="small"
    />
  );
});

export const DynamicFilter = memo(({
  filters,
  values,
  onChange,
}: DynamicFilterProps) => {
  return (
    <PaperBox sx={{ p: 2, mb: 3 }}>
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
    </PaperBox>
  );
});