import React from "react";
import { TextField, SelectChangeEvent } from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { FormGrid } from "../formCommon/FormGrid";
import { FormBox } from "../formCommon/FormBox";
import { FormSelect } from "../formCommon/FormSelect";
import { FormButton } from "../formCommon/FormButton";
import { PaperBox } from "../common/PaperBox";

interface OrdersFilterProps {
  searchTerm: string;
  filterStatus: string;
  dateRange: { from: string; to: string };
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onDateRangeChange: (dateRange: { from: string; to: string }) => void;
  onAdvancedFilter: () => void;
  showAdvancedFilters: boolean;
}

export const OrdersFilter = ({
  searchTerm,
  filterStatus,
  dateRange,
  onSearchChange,
  onStatusChange,
  onDateRangeChange,
  onAdvancedFilter,
  showAdvancedFilters,
}: OrdersFilterProps) => {
  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const handleStatusChange = (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      | SelectChangeEvent<string>
  ) => {
    onStatusChange(e.target.value);
  };

  const handleDateChange =
    (field: "from" | "to") => (e: React.ChangeEvent<HTMLInputElement>) => {
      onDateRangeChange({
        ...dateRange,
        [field]: e.target.value,
      });
    };

  return (
    <PaperBox sx={{ p: 2, mb: 3 }}>
      <FormBox>
        <FormGrid container spacing={2} alignItems="center">
          <FormGrid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <SearchIcon sx={{ mr: 1, color: "action.active" }} />
                  ),
                },
              }}
              size="small"
            />
          </FormGrid>
          <FormGrid item xs={12} md={3}>
            <FormSelect
              name="status"
              label="Status"
              options={statusOptions}
              value={filterStatus}
              onChange={handleStatusChange}
              size="small"
            />
          </FormGrid>
          <FormGrid item xs={12} md={3}>
            <FormButton
              fullWidth
              variant="outlined"
              startIcon={<FilterIcon />}
              size="medium"
              onClick={onAdvancedFilter}
            >
              {showAdvancedFilters ? "Hide Filters" : "More Filters"}
            </FormButton>
          </FormGrid>

          {showAdvancedFilters && (
            <>
              <FormGrid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="From Date"
                  type="date"
                  value={dateRange.from}
                  onChange={handleDateChange("from")}
                  slotProps={{
                    inputLabel: { shrink: true },
                  }}
                  size="small"
                />
              </FormGrid>
              <FormGrid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="To Date"
                  type="date"
                  value={dateRange.to}
                  onChange={handleDateChange("to")}
                  slotProps={{
                    inputLabel: { shrink: true },
                  }}
                  size="small"
                />
              </FormGrid>
            </>
          )}
        </FormGrid>
      </FormBox>
    </PaperBox>
  );
};
