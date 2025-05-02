import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import { Container, SelectChangeEvent } from "@mui/material";
import { FormTypography } from "../../components/formCommon/FormTypography";
import { FormTextField } from "../../components/formCommon/FormTextField";
import { FormSelect } from "../../components/formCommon/FormSelect";
import { FormButton } from "../../components/formCommon/FormButton";
import { PaperBox } from "../../components/formCommon/PaperBox";
import { FormBox } from "../../components/formCommon/FormBox";
import { FormGrid } from "../../components/formCommon/FormGrid";

interface FormData {
  sku: string;
  name: string;
  category: string;
  price: number;
  moq: number;
  stock: number;
  netWeight: number;
  grossWeight: number;
  volume: number;
  container20ftCapacity: number | undefined;
  container40ftCapacity: number | undefined;
}

const ProductEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, updateProduct } = useProducts();
  const [formData, setFormData] = useState<FormData>({
    sku: "",
    name: "",
    category: "",
    price: 0,
    moq: 1,
    stock: 0,
    netWeight: 0,
    grossWeight: 0,
    volume: 0,
    container20ftCapacity: undefined,
    container40ftCapacity: undefined,
  });

  useEffect(() => {
    const product = products.find((p) => p.id === id);
    if (product) {
      setFormData({
        sku: product.sku,
        name: product.name,
        category: product.category,
        price: product.basePrice,
        moq: product.moq,
        stock: product.stock,
        netWeight: product.netWeight,
        grossWeight: product.grossWeight,
        volume: product.volume,
        container20ftCapacity: product.container20ftCapacity ?? undefined,
        container40ftCapacity: product.container40ftCapacity ?? undefined,
      });
    }
  }, [id, products]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProduct(id!, formData);
      navigate("/products"); // Changed from '/admin/products' to '/products'
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name.includes("price") ||
        name.includes("Weight") ||
        name.includes("volume") ||
        name.includes("Capacity")
          ? value === ""
            ? undefined
            : parseFloat(value)
          : name === "moq" || name === "stock"
            ? parseInt(value, 10)
            : value,
    }));
  };

  const categoryOptions = [
    { value: "", label: "Select Category" },
    { value: "distributor", label: "Distributor" },
    { value: "dealer", label: "Dealer" },
    { value: "sales", label: "Sales" },
    { value: "exportTeam", label: "Export Team" },
  ];

  return (
    <Container maxWidth="lg">
      <FormBox p={3}>
        <FormTypography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          color="primary.main"
          sx={{ fontWeight: 'bold', mb: 4 }}
        >
          Edit Product
        </FormTypography>
        <PaperBox>
          <FormBox component="form" onSubmit={handleSubmit} p={3}>
            <FormBox component="div" sx={{ display: 'grid', gap: 3 }}>
              <FormGrid xs={12} md={6}>
                <FormTextField
                  label="SKU"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                />
              </FormGrid>
              <FormGrid xs={12} md={6}>
                <FormTextField
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </FormGrid>
              <FormGrid xs={12} md={6}>
                <FormSelect
                  name="category"
                  label="Category"
                  value={formData.category}
                  onChange={handleChange}
                  options={categoryOptions}
                  required
                />
              </FormGrid>
              <FormGrid xs={12} md={6}>
                <FormTextField
                  type="number"
                  label="Price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                />
              </FormGrid>
              <FormGrid xs={12} md={6}>
                <FormTextField
                  type="number"
                  label="MOQ"
                  name="moq"
                  value={formData.moq}
                  onChange={handleChange}
                  required
                  min="1"
                />
              </FormGrid>
              <FormGrid xs={12} md={6}>
                <FormTextField
                  type="number"
                  label="Stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </FormGrid>
              <FormGrid xs={12} md={6}>
                <FormTextField
                  type="number"
                  label="Net Weight"
                  name="netWeight"
                  value={formData.netWeight}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                />
              </FormGrid>
              <FormGrid xs={12} md={6}>
                <FormTextField
                  type="number"
                  label="Gross Weight"
                  name="grossWeight"
                  value={formData.grossWeight}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                />
              </FormGrid>
              <FormGrid xs={12} md={6}>
                <FormTextField
                  type="number"
                  label="Volume"
                  name="volume"
                  value={formData.volume}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </FormGrid>
              <FormGrid xs={12} md={6}>
                <FormTextField
                  type="number"
                  label="20ft Container Capacity"
                  name="container20ftCapacity"
                  value={formData.container20ftCapacity || ""}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </FormGrid>
              <FormGrid xs={12} md={6}>
                <FormTextField
                  type="number"
                  label="40ft Container Capacity"
                  name="container40ftCapacity"
                  value={formData.container40ftCapacity || ""}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </FormGrid>
            </FormBox>
            <FormBox mt={3} display="flex" justifyContent="flex-end">
              <FormButton type="submit">
                Save Changes
              </FormButton>
            </FormBox>
          </FormBox>
        </PaperBox>
      </FormBox>
    </Container>
  );
};

export default ProductEdit;
