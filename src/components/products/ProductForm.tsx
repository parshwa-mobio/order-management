import React from "react";
import { ProductFormInput } from "./ProductFormInput";

interface ProductFormData {
  sku: string;
  name: string;
  category: string;
  price: number;
  moq: number;
  stock: number;
  netWeight: number;
  grossWeight: number;
  volume: number;
  container20ftCapacity?: number;
  container40ftCapacity?: number;
}

interface ProductFormProps {
  formData: ProductFormData;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onCancel: () => void;
  submitLabel: string;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  formData,
  onSubmit,
  onChange,
  onCancel,
  submitLabel,
}) => {
  const categoryOptions = [
    { value: "distributor", label: "Distributor" },
    { value: "dealer", label: "Dealer" },
    { value: "sales", label: "Sales" },
    { value: "exportTeam", label: "Export Team" },
  ];

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-2xl bg-white p-6 rounded-lg shadow"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ProductFormInput
          label="SKU"
          name="sku"
          type="text"
          value={formData.sku}
          onChange={onChange}
          required
        />
        <ProductFormInput
          label="Name"
          name="name"
          type="text"
          value={formData.name}
          onChange={onChange}
          required
        />
        <ProductFormInput
          label="Category"
          name="category"
          type="select"
          value={formData.category}
          onChange={onChange}
          required
          options={categoryOptions}
        />
        <ProductFormInput
          label="Price"
          name="price"
          type="number"
          value={formData.price}
          onChange={onChange}
          required
          min={0}
          step="0.01"
        />
        <ProductFormInput
          label="MOQ"
          name="moq"
          type="number"
          value={formData.moq}
          onChange={onChange}
          required
          min={1}
        />
        <ProductFormInput
          label="Stock"
          name="stock"
          type="number"
          value={formData.stock}
          onChange={onChange}
          required
          min={0}
        />
        <ProductFormInput
          label="Net Weight"
          name="netWeight"
          type="number"
          value={formData.netWeight}
          onChange={onChange}
          required
          min={0}
          step="0.01"
        />
        <ProductFormInput
          label="Gross Weight"
          name="grossWeight"
          type="number"
          value={formData.grossWeight}
          onChange={onChange}
          required
          min={0}
          step="0.01"
        />
        <ProductFormInput
          label="Volume"
          name="volume"
          type="number"
          value={formData.volume}
          onChange={onChange}
          required
          min={0}
          step="0.01"
        />
        <ProductFormInput
          label="20ft Container Capacity"
          name="container20ftCapacity"
          type="number"
          value={formData.container20ftCapacity || ""}
          onChange={onChange}
          min={0}
        />
        <ProductFormInput
          label="40ft Container Capacity"
          name="container40ftCapacity"
          type="number"
          value={formData.container40ftCapacity || ""}
          onChange={onChange}
          min={0}
        />
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
};
