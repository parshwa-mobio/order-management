import { useState } from "react";
import { Search, Add, Edit, Delete } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { Product, useProducts } from "../../hooks/useProducts";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Button,
  Typography,
  Box,
  Container,
  InputAdornment,
  FormControl,
  InputLabel,
} from "@mui/material";

const TableHeader = () => (
  <TableHead sx={{ bgcolor: 'primary.light' }}>
    <TableRow>
      {["SKU", "Name", "Category", "Price", "Stock", "Actions"].map((header) => (
        <TableCell key={header} sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>
          {header}
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
);

const SearchBar = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => (
  <TextField
    fullWidth
    placeholder="Search products..."
    value={value}
    onChange={(e) => onChange(e.target.value)}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <Search color="primary" />
        </InputAdornment>
      ),
    }}
    sx={{ bgcolor: 'background.paper' }}
  />
);

const CategoryFilter = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => (
  <FormControl fullWidth>
    <InputLabel>Category</InputLabel>
    <Select value={value} onChange={(e) => onChange(e.target.value as string)} label="Category">
      <MenuItem value="all">All Categories</MenuItem>
      <MenuItem value="distributor">Distributor</MenuItem>
      <MenuItem value="dealer">Dealer</MenuItem>
      <MenuItem value="sales">Sales</MenuItem>
      <MenuItem value="exportTeam">Export Team</MenuItem>
    </Select>
  </FormControl>
);

const ProductRow = ({
  product,
  onDelete,
}: {
  product: Product;
  onDelete: (id: string) => void;
}) => (
  <TableRow>
    <TableCell>{product.sku}</TableCell>
    <TableCell>{product.name}</TableCell>
    <TableCell>{product.category}</TableCell>
    <TableCell>${product.basePrice.toFixed(2)}</TableCell>
    <TableCell>{product.stock}</TableCell>
    <TableCell>
      <IconButton
        component={Link}
        to={`/products/edit/${product.id}`}
        color="primary"
      >
        <Edit />
      </IconButton>
      <IconButton onClick={() => onDelete(product.id)} color="error">
        <Delete />
      </IconButton>
    </TableCell>
  </TableRow>
);

const Products = () => {
  const { products, loading, deleteProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
    }
  };

  if (loading) {
    return <Box p={3}>Loading...</Box>;
  }

  return (
    <Container maxWidth="xl">
      <Box p={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1" color="primary.main">
            Products
          </Typography>
          <Button
            component={Link}
            to="/products/create"
            variant="contained"
            startIcon={<Add />}
            sx={{ 
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark',
              }
            }}
          >
            New Product
          </Button>
        </Box>

        <Paper elevation={3} sx={{ borderRadius: 2 }}>
          <Box p={3} borderBottom={1} borderColor="divider">
            <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2}>
              <SearchBar value={searchTerm} onChange={setSearchTerm} />
              <Box width={{ xs: "100%", sm: 240 }}>
                <CategoryFilter
                  value={filterCategory}
                  onChange={setFilterCategory}
                />
              </Box>
            </Box>
          </Box>

          <TableContainer>
            <Table>
              <TableHeader />
              <TableBody>
                {filteredProducts.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    onDelete={handleDelete}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Container>
  );
};

export default Products;
