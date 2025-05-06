
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../hooks/product/useProducts";
import { useCategories } from "../../hooks/categories/useCategories";
import { FormTypography } from "../../components/formCommon/FormTypography";
import ProductForm from "../../components/products/ProductForm";
import { FormContainer } from "../../components/formCommon/FormContainer";

const ProductCreate = () => {
  const navigate = useNavigate();
  const { createProduct } = useProducts();
  const { categories } = useCategories();

  const initialFormData = {
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
    container20ftCapacity: undefined,
    container40ftCapacity: undefined,
  };

  const handleSubmit = async (formData: any) => {
    try {
      await createProduct(formData);
      navigate("/products");
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

  return (
    <FormContainer title="Product create">
      <FormTypography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        color="primary.main"
        sx={{ 
          fontWeight: 700,
          mb: 4,
          fontSize: { xs: '1.75rem', md: '2rem' }
        }}
      >
        Create New Product
      </FormTypography>
      
      <ProductForm
        initialData={initialFormData}
        onSubmit={handleSubmit}
        submitButtonText="Create Product"
        categories={categories}
      />
    </FormContainer>
  );
};

export default ProductCreate;
