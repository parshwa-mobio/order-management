import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../../hooks/product/useProducts";
import { useCategories } from "../../hooks/categories/useCategories";
import { Container } from "@mui/material";
import { FormTypography } from "../../components/formCommon/FormTypography";
import { FormBox } from "../../components/formCommon/FormBox";
import { PaperBox } from "../../components/common/PaperBox";
import ProductForm from "../../components/products/ProductForm";

const ProductEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, updateProduct } = useProducts();
  const { categories } = useCategories();
  const [initialData, setInitialData] = useState({
    sku: "",
    name: "",
    description: "",
    imageUrl: "",
    category: "",
    netWeight: 0,
    grossWeight: 0,
    volume: 0,
    shelfLife: "",
    basePrice: 0,
    tax: 0,
    discount: 0,
    moq: 1,
    stock: 0,
    container20ftCapacity: undefined as number | undefined,
    container40ftCapacity: undefined as number | undefined,
  });

  useEffect(() => {
    const product = products.find((p) => p.id === id);
    if (product) {
      setInitialData({
        sku: product.sku,
        name: product.name,
        description: product.description || "",
        imageUrl: product.imageUrl || "",
        category: product.category,
        netWeight: product.netWeight,
        grossWeight: product.grossWeight,
        volume: product.volume,
        shelfLife: product.shelfLife || "",
        basePrice: product.basePrice,
        tax: product.tax || 0,
        discount: product.discount || 0,
        moq: product.moq,
        stock: product.stock,
        container20ftCapacity: product.container20ftCapacity || undefined,
        container40ftCapacity: product.container40ftCapacity || undefined,
      });
    }
  }, [id, products]);

  const handleSubmit = async (formData: any) => {
    try {
      await updateProduct(id!, formData);
      navigate("/products");
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

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
          <ProductForm
            initialData={initialData}
            onSubmit={handleSubmit}
            submitButtonText="Save Changes"
            categories={categories}
          />
        </PaperBox>
      </FormBox>
    </Container>
  );
};

export default ProductEdit;
