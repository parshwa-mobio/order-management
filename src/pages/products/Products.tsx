import { useState, useCallback, useMemo } from "react";
import { Edit, Delete, Add } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { Product, useProducts } from "../../hooks/useProducts";
import { IconButton, Button, Typography, Box, Container } from "@mui/material";
import { DataTable } from "../../components/common/DataTable";
import { DynamicFilter } from "../../components/common/DynamicFilter";

// Update Product interface to include _id
interface ExtendedProduct extends Product {
  _id: string;
}

// Make FilterValues compatible with Record<string, string>
interface FilterValues extends Record<string, string> {
  search: string;
  category: string;
}

const Products = () => {
  const [filterValues, setFilterValues] = useState<FilterValues>({
    search: "",
    category: ""
  });

  const { products, loading } = useProducts();

  const productFilters = useMemo(() => [
    {
      field: "search",
      label: "Search Products",
      type: "text" as const
    },
    {
      field: "category",
      label: "Category",
      type: "select" as const,
      options: [
        { value: "distributor", label: "Distributor" },
        { value: "dealer", label: "Dealer" },
        { value: "sales", label: "Sales" },
        { value: "exportTeam", label: "Export Team" }
      ]
    }
  ], []);

  const handleFilterChange = useCallback((field: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [field]: value }));
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = !filterValues.search || 
        product.name.toLowerCase().includes(filterValues.search.toLowerCase());
      const matchesCategory = !filterValues.category || 
        product.category === filterValues.category;
      return matchesSearch && matchesCategory;
    });
  }, [products, filterValues]);

  const columns = useMemo(() => [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "category", headerName: "Category", flex: 1 },
    { field: "price", headerName: "Price", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (row: ExtendedProduct) => (
        <Box>
          <IconButton
            component={Link}
            to={`/products/edit/${row._id}`}
            size="small"
            color="primary"
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      )
    }
  ], []);

  const styles = {
    headerButton: {
      bgcolor: "primary.main",
      "&:hover": {
        bgcolor: "primary.dark",
      }
    }
  } as const;

  return (
    <Container maxWidth="xl">
      <Box p={3}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4" component="h1" color="primary.main">
            Products
          </Typography>
          <Button
            component={Link}
            to="/products/create"
            variant="contained"
            startIcon={<Add />}
            sx={styles.headerButton}
          >
            New Product
          </Button>
        </Box>

        <DynamicFilter
          filters={productFilters}
          values={filterValues}
          onChange={handleFilterChange}
        />

        <DataTable
          columns={columns}
          rows={filteredProducts}
          loading={loading}
          emptyMessage="No products found"
        />
      </Box>
    </Container>
  );
};

export default Products;
