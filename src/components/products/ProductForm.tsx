import {
  Box,
  Typography,
  Divider,
  SelectChangeEvent,
} from "@mui/material";
import { useState, useEffect } from "react";
import { FormTextField } from "../formCommon/FormTextField";
import { FormSelect } from "../formCommon/FormSelect";
import { FormButton } from "../formCommon/FormButton";
import { FormBox } from "../formCommon/FormBox";

interface ProductFormData {
  sku: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  netWeight: number;
  grossWeight: number;
  volume: number;
  shelfLife: string;
  basePrice: number;
  tax: number;
  discount: number;
  moq: number;
  stock: number;
  container20ftCapacity?: number;
  container40ftCapacity?: number;
}

interface ProductFormProps {
  initialData: ProductFormData;
  onSubmit: (data: ProductFormData) => void;
  submitButtonText: string;
  categories: Array<{ _id: string; name: string }>;
}

export default function ProductForm({
  initialData,
  onSubmit,
  submitButtonText,
  categories
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseFieldValue(name, value),
    }));
  };

  const parseFieldValue = (name: string, value: string) => {
    if (value === "") {
      return name.includes("Capacity") ? undefined : value;
    }

    if (
      name === "basePrice" ||
      name.includes("Weight") ||
      name === "volume" ||
      name.includes("Capacity") ||
      name === "tax" ||
      name === "discount"
    ) {
      return parseFloat(value);
    }

    if (name === "moq" || name === "stock") {
      return parseInt(value, 10);
    }

    return value;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const categoryOptions = [
    { value: "", label: "Select Category" },
    ...categories.map(cat => ({
      value: cat._id,
      label: cat.name
    }))
  ];

  return (
    <FormBox component="form" onSubmit={handleSubmit} sx={{ maxWidth: 900, p: 4 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {/* Basic Info */}
        <Box>
          <Typography variant="h6" gutterBottom align="left">
            Basic Information
          </Typography>
          <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "repeat(2, 1fr)" }}>
            <FormTextField
              name="sku"
              label="SKU"
              value={formData.sku}
              onChange={handleChange}
              required
              sx={{ justifyContent: "flex-start" }}
            />
            <FormTextField
              name="name"
              label="Product Name"
              value={formData.name}
              onChange={handleChange}
              required
              sx={{ justifyContent: "flex-start" }}
            />
          </Box>
          <Divider sx={{ mt: 2 }} />
        </Box>

        {/* Category & Description */}
        <Box>
          <Typography variant="h6" gutterBottom align="left">
            Category & Description
          </Typography>
          <Box sx={{ display: "grid", gap: 2 }}>
            <FormSelect
              id="category-select"
              name="category"
              label="Category"
              value={formData.category}
              onChange={handleChange}
              options={categoryOptions}
              required
              sx={{ textAlign: "left" }}
            />
            <FormTextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              sx={{ textAlign: "left" }}
            />
            <FormTextField
              name="imageUrl"
              label="Image URL"
              value={formData.imageUrl}
              onChange={handleChange}
              sx={{ textAlign: "left" }}
            />
          </Box>
          <Divider sx={{ mt: 2 }} />
        </Box>

        {/* Pricing & Stock */}
        <Box>
          <Typography variant="h6" gutterBottom align="left">
            Pricing & Stock
          </Typography>
          <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "repeat(2, 1fr)" }}>
            <FormTextField
              type="number"
              name="basePrice"
              label="Base Price"
              value={formData.basePrice}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              sx={{ textAlign: "left" }}
            />
            <FormTextField
              type="number"
              name="tax"
              label="Tax (%)"
              value={formData.tax}
              onChange={handleChange}
              required
              min="0"
              inputProps={{ max: 100 }}
            />
            <FormTextField
              type="number"
              name="discount"
              label="Discount (%)"
              value={formData.discount}
              onChange={handleChange}
              min="0"
              inputProps={{ max: 100 }}
            />
            <FormTextField
              type="number"
              name="moq"
              label="Minimum Order Quantity"
              value={formData.moq}
              onChange={handleChange}
              required
              min="1"
            />
            <FormTextField
              type="number"
              name="stock"
              label="Stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
            />
          </Box>
          <Divider sx={{ mt: 2 }} />
        </Box>

        {/* Physical Properties */}
        <Box>
          <Typography variant="h6" gutterBottom align="left">
            Physical Properties
          </Typography>
          <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "repeat(2, 1fr)" }}>
            <FormTextField
              type="number"
              name="netWeight"
              label="Net Weight (kg)"
              value={formData.netWeight}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              sx={{ textAlign: "left" }}
            />
            <FormTextField
              type="number"
              name="grossWeight"
              label="Gross Weight (kg)"
              value={formData.grossWeight}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
            <FormTextField
              type="number"
              name="volume"
              label="Volume (m³)"
              value={formData.volume}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
            <FormTextField
              name="shelfLife"
              label="Shelf Life"
              value={formData.shelfLife}
              onChange={handleChange}
              required
            />
            <FormTextField
              type="number"
              name="container20ftCapacity"
              label="20ft Container Capacity"
              value={formData.container20ftCapacity ?? ""}
              onChange={handleChange}
              min="0"
            />
            <FormTextField
              type="number"
              name="container40ftCapacity"
              label="40ft Container Capacity"
              value={formData.container40ftCapacity ?? ""}
              onChange={handleChange}
              min="0"
            />
          </Box>
        </Box>

        {/* Submit Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
          <FormButton type="submit" variant="contained" color="primary">
            {submitButtonText}
          </FormButton>
        </Box>
      </Box>
    </FormBox>
  );
}
