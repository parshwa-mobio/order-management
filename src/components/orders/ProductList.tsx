import { memo } from "react";
import {
  InputAdornment,
  List,
  ListItem,
  Box} from "@mui/material";
import { Search as SearchIcon, Add as AddIcon } from "@mui/icons-material";
import { FormGrid } from "../formCommon/FormGrid";
import { FormPaper } from "../formCommon/FormPaper";
import { FormTypography } from "../formCommon/FormTypography";
import { FormTextField } from "../formCommon/FormTextField";
import { FormButton } from "../formCommon/FormButton";

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  moq: number;
}

interface ProductListProps {
  products: Product[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddProduct: (product: Product) => void;
}

const ProductListItem = memo(({ product, onAdd }: { product: Product; onAdd: (product: Product) => void }) => (
  <ListItem 
    divider 
    sx={{
      py: 2,
      '&:hover': {
        bgcolor: 'action.hover'
      }
    }}
  >
    <Box sx={{ flex: 1 }}>
      <FormTypography 
        variant="body1"
        sx={{ fontWeight: 500 }}
      >
        {product.name}
      </FormTypography>
      <FormTypography 
        variant="body2" 
        color="text.secondary"
        sx={{ mt: 0.5 }}
      >
        SKU: {product.sku} | Price: ${product.price}
      </FormTypography>
    </Box>
    <FormButton
      variant="outlined"
      size="small"
      startIcon={<AddIcon />}
      onClick={() => onAdd(product)}
      sx={{
        borderColor: 'primary.main',
        color: 'primary.main',
        '&:hover': {
          bgcolor: 'primary.50'
        }
      }}
    >
      Add
    </FormButton>
  </ListItem>
));

export const ProductList = memo(({
  products,
  searchTerm,
  onSearchChange,
  onAddProduct
}: ProductListProps) => {
  return (
    <FormGrid item xs={12} md={8}>
      <FormPaper sx={{ 
        p: 3,
        '& .MuiList-root': {
          bgcolor: 'background.paper',
          borderRadius: 1
        }
      }}>
        <FormTypography 
          variant="h6" 
          sx={{ 
            mb: 2,
            fontWeight: 600
          }}
        >
          Products
        </FormTypography>
        
        <FormTextField
          name="search"
          fullWidth
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{ 
            mb: 2,
            '& .MuiOutlinedInput-root': {
              bgcolor: 'background.paper',
              '&:hover fieldset': {
                borderColor: 'primary.main'
              }
            }
          }}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          }
        />

        <List sx={{ 
          maxHeight: 400, 
          overflow: 'auto', 
          mb: 2,
          border: 1,
          borderColor: 'divider',
          borderRadius: 1
        }}>
          {products.length > 0 ? (
            products.map((product) => (
              <ProductListItem
                key={`${product.id}-${product.sku}`}
                product={product}
                onAdd={onAddProduct}
              />
            ))
          ) : (
            <ListItem>
              <FormTypography variant="body1">
                No products found
              </FormTypography>
            </ListItem>
          )}
        </List>
      </FormPaper>
    </FormGrid>
  );
});
