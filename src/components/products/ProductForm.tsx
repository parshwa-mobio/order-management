import React from "react";
import { useState } from "react";
import { Grid, Paper, SelectChangeEvent } from "@mui/material";
import { FormGrid } from "../formCommon/FormGrid";
import { FormTextField } from "../formCommon/FormTextField";
import { FormSelect } from "../formCommon/FormSelect";
import { FormBox } from "../formCommon/FormBox";
import { Button } from "@mui/material";

interface ProductFormData {
  sku: string;
  name: string;
  category: string;
  basePrice: number;
  moq: number;
  stock: number;
  netWeight: number;
  grossWeight: number;
  volume: number;
  container20ftCapacity?: number;
  container40ftCapacity?: number;
}

interface ProductFormProps {
  initialData: ProductFormData;
  onSubmit: (data: ProductFormData) => void;
  submitButtonText: string;
}

export const ProductForm = ({ initialData, onSubmit, submitButtonText }: ProductFormProps) => {
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleTextFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFieldValue(name, value)
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const parseFieldValue = (name: string, value: string) => {
    if (value === "") {
      return name.includes("Capacity") ? undefined : value;
    }

    if (name.includes("basePrice") || 
        name.includes("Weight") || 
        name.includes("volume") || 
        name.includes("Capacity")) {
      return parseFloat(value);
    }

    if (name === "moq" || name === "stock") {
      return parseInt(value, 10);
    }

    return value;
  };

  const categoryOptions = [
    { value: "", label: "Select Category" },
    { value: "distributor", label: "Distributor" },
    { value: "dealer", label: "Dealer" },
    { value: "sales", label: "Sales" },
    { value: "exportTeam", label: "Export Team" },
  ];

  return (
    <Paper>
      <FormBox component="form" onSubmit={handleSubmit} p={3}>
        <Grid container spacing={3}>
        <FormGrid item xs={12} md={6}>
            <FormTextField
              label="SKU"
              name="sku"
              value={formData.sku}
              onChange={handleTextFieldChange}
              required
            />
          </FormGrid>
          <FormGrid item xs={12} md={6}>
            <FormTextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleTextFieldChange}
              required
            />
          </FormGrid>
          <FormGrid item xs={12} md={6}>
            <FormSelect
              id="category"
              name="category"
              label="Category"
              value={formData.category}
              onChange={handleSelectChange}
              options={categoryOptions}
              required
            />
          </FormGrid>
          <FormGrid item xs={12} md={6}>
            <FormTextField
              type="number"
              label="Price"
              name="basePrice"
              value={formData.basePrice}
              onChange={handleTextFieldChange}
              required
              min="0"
              step="0.01"
            />
          </FormGrid>
          <FormGrid item xs={12} md={6}>
            <FormTextField
              type="number"
              label="MOQ"
              name="moq"
              value={formData.moq}
              onChange={handleTextFieldChange}
              required
              min="1"
            />
          </FormGrid>
          <FormGrid item xs={12} md={6}>
            <FormTextField
              type="number"
              label="Stock"
              name="stock"
              value={formData.stock}
              onChange={handleTextFieldChange}
              required
              min="0"
            />
          </FormGrid>
          <FormGrid item xs={12} md={6}>
            <FormTextField
              type="number"
              label="Net Weight"
              name="netWeight"
              value={formData.netWeight}
              onChange={handleTextFieldChange}
              required
              min="0"
              step="0.01"
            />
          </FormGrid>
          <FormGrid item xs={12} md={6}>
            <FormTextField
              type="number"
              label="Gross Weight"
              name="grossWeight"
              value={formData.grossWeight}
              onChange={handleTextFieldChange}
              required
              min="0"
              step="0.01"
            />
          </FormGrid>
          <FormGrid item xs={12} md={6}>
            <FormTextField
              type="number"
              label="Volume"
              name="volume"
              value={formData.volume}
              onChange={handleTextFieldChange}
              required
              min="0"
            />
          </FormGrid>
          <FormGrid item xs={12} md={6}>
            <FormTextField
              type="number"
              label="20ft Container Capacity"
              name="container20ftCapacity"
              value={formData.container20ftCapacity}
              onChange={handleTextFieldChange}
              required
              min="0"
            />
          </FormGrid>
          <FormGrid item xs={12} md={6}>
            <FormTextField
              type="number"
              label="40ft Container Capacity"
              name="container40ftCapacity"
              value={formData.container40ftCapacity}
              onChange={handleTextFieldChange}
              required
              min="0"
            />
          </FormGrid>
        </Grid>
        <FormBox mt={3}>
          <Button type="submit" variant="contained" color="primary">
            {submitButtonText}
          </Button>
        </FormBox>
      </FormBox>
    </Paper>
  );
};
