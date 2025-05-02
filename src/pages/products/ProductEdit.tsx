import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import { Container, SelectChangeEvent } from "@mui/material";
import { FormTypography } from "../../components/formCommon/FormTypography";
import { FormTextField } from "../../components/formCommon/FormTextField";
import { FormSelect } from "../../components/formCommon/FormSelect";
import { FormButton } from "../../components/formCommon/FormButton";
import { PaperBox } from "../../components/common/PaperBox";
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

const INITIAL_FORM_DATA: FormData = {
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
};

const CATEGORY_OPTIONS = [
  { value: "", label: "Select Category" },
  { value: "distributor", label: "Distributor" },
  { value: "dealer", label: "Dealer" },
  { value: "sales", label: "Sales" },
  { value: "exportTeam", label: "Export Team" },
] as const;

const ProductEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, updateProduct } = useProducts();
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);

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
      navigate("/products");
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  const handleChange = (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      | SelectChangeEvent<string>
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
      name.includes("price") ||
      name.includes("Weight") ||
      name.includes("volume") ||
      name.includes("Capacity")
    ) {
      return parseFloat(value);
    }

    if (name === "moq" || name === "stock") {
      return parseInt(value, 10);
    }

    return value;
  };

  const renderTextField = (props: any) => (
    <FormGrid xs={12} md={6}>
      <FormTextField
        {...props}
        onChange={handleChange}
        value={formData[props.name as keyof FormData]}
      />
    </FormGrid>
  );

  return (
    <Container maxWidth="lg">
      <FormBox p={3}>
        <FormTypography
          variant="h4"
          component="h1"
          gutterBottom
          color="primary.main"
          sx={{ fontWeight: "bold", mb: 4 }}
        >
          Edit Product
        </FormTypography>
        <PaperBox>
          <FormBox component="form" onSubmit={handleSubmit} p={3}>
            <FormBox component="div" sx={{ display: "grid", gap: 3 }}>
              {renderTextField({ label: "SKU", name: "sku", required: true })}
              {renderTextField({ label: "Name", name: "name", required: true })}

              <FormGrid xs={12} md={6}>
                <FormSelect
                  id="category-select"
                  name="category"
                  label="Category"
                  value={formData.category}
                  onChange={handleChange}
                  options={CATEGORY_OPTIONS}
                  required
                />
              </FormGrid>

              {renderTextField({
                type: "number",
                label: "Price",
                name: "price",
                required: true,
                min: "0",
                step: "0.01",
              })}
              {renderTextField({
                type: "number",
                label: "MOQ",
                name: "moq",
                required: true,
                min: "1",
              })}
              {renderTextField({
                type: "number",
                label: "Stock",
                name: "stock",
                required: true,
                min: "0",
              })}
              {renderTextField({
                type: "number",
                label: "Net Weight",
                name: "netWeight",
                required: true,
                min: "0",
                step: "0.01",
              })}
              {renderTextField({
                type: "number",
                label: "Gross Weight",
                name: "grossWeight",
                required: true,
                min: "0",
                step: "0.01",
              })}
              {renderTextField({
                type: "number",
                label: "Volume",
                name: "volume",
                required: true,
                min: "0",
              })}
              {renderTextField({
                type: "number",
                label: "20ft Container Capacity",
                name: "container20ftCapacity",
                required: true,
                min: "0",
                value: formData.container20ftCapacity ?? "",
              })}
              {renderTextField({
                type: "number",
                label: "40ft Container Capacity",
                name: "container40ftCapacity",
                required: true,
                min: "0",
                value: formData.container40ftCapacity ?? "",
              })}
            </FormBox>

            <FormBox mt={3} display="flex" justifyContent="flex-end">
              <FormButton type="submit">Save Changes</FormButton>
            </FormBox>
          </FormBox>
        </PaperBox>
      </FormBox>
    </Container>
  );
};

export default ProductEdit;
