import {
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Typography,
  Paper
} from "@mui/material";
import { Search as SearchIcon, Add as AddIcon } from "@mui/icons-material";
import { FormGrid } from "../formCommon/FormGrid";
import { PaperBox } from "../formCommon/PaperBox";

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

export const ProductList = ({
  products,
  searchTerm,
  onSearchChange,
  onAddProduct
}: ProductListProps) => {
  return (
    <FormGrid item xs={12} md={8}>
      <PaperBox sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Products
        </Typography>
        <TextField
          fullWidth
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <List sx={{ maxHeight: 300, overflow: 'auto', mb: 2 }}>
          {products.length > 0 ? (
            products.map((product) => (
              <ListItem key={product.id} divider>
                <ListItemText
                  primary={product.name}
                  secondary={`SKU: ${product.sku} | Price: $${product.price}`}
                />
                <ListItemSecondaryAction>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => onAddProduct(product)}
                  >
                    Add
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No products found" />
            </ListItem>
          )}
        </List>
      </PaperBox>
    </FormGrid>
  );
};
