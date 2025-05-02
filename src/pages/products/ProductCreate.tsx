
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import { Container, Box, Paper } from "@mui/material";
import { FormTypography } from "../../components/formCommon/FormTypography";
import { ProductForm } from "../../components/products/ProductForm";

const ProductCreate = () => {
  const navigate = useNavigate();
  const { createProduct } = useProducts();

  const handleSubmit = async (formData: any) => {
    try {
      await createProduct(formData);
      navigate("/products");
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

  const initialFormData = {
    sku: "",
    name: "",
    category: "",
    basePrice: 0,
    moq: 1,
    stock: 0,
    netWeight: 0,
    grossWeight: 0,
    volume: 0,
    container20ftCapacity: undefined,
    container40ftCapacity: undefined,
  };

  return (
    <Container maxWidth="lg">
      <Box p={3}>
        <FormTypography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          color="primary.main"
          sx={{ 
            fontWeight: 'bold',
            mb: 4 
          }}
        >
          Create New Product
        </FormTypography>
        <Paper 
          elevation={3} 
          sx={{ 
            borderRadius: 2,
            bgcolor: 'background.paper' 
          }}
        >
          <ProductForm
            initialData={initialFormData}
            onSubmit={handleSubmit}
            submitButtonText="Create Product"
          />
        </Paper>
      </Box>
    </Container>
  );
};

export default ProductCreate;
