import { useEffect, useCallback, useState } from "react";
import { useCategories } from "../../hooks/useCategories";
import { Button, Typography, Box, Container } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { DataTable } from "../../components/common/DataTable";
import { DynamicFilter } from "../../components/common/DynamicFilter";
import AddCategoryForm from "../../components/categories/AddCategoryForm";

const Categories = () => {
  const {
    categories,
    loading,
    fetchCategories,
    createCategory,
    deleteCategory,
  } = useCategories();

  const [filterValues, setFilterValues] = useState({
    name: ""
  });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = useCallback(async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }
    await deleteCategory(id);
  }, [deleteCategory]);

  const handleFilterChange = useCallback((field: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [field]: value }));
  }, []);

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (row: any) => (
        <Button
          color="error"
          onClick={() => handleDelete(row._id)}
          size="small"
        >
          Delete
        </Button>
      ),
    },
  ];

  const filters = [
    {
      field: "name",
      label: "Search Category",
      type: "text" as const,
    }
  ];

  const filteredCategories = categories.filter(category => 
    filterValues.name ? 
      category.name.toLowerCase().includes(filterValues.name.toLowerCase()) : 
      true
  );

  const styles = {
    headerButton: {
      bgcolor: "primary.main",
      "&:hover": {
        bgcolor: "primary.dark",
      }
    }
  } as const;

  const [isAddingCategory, setIsAddingCategory] = useState(false);

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
            Categories
          </Typography>
          {!isAddingCategory && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsAddingCategory(true)}
              sx={styles.headerButton}
            >
              Add Category
            </Button>
          )}
        </Box>

        {isAddingCategory && (
          <Box mb={3}>
            <AddCategoryForm 
              onCreate={async (data) => {
                await createCategory(data);
                setIsAddingCategory(false);
              }} 
              creating={false}
              onCancel={() => setIsAddingCategory(false)}
            />
          </Box>
        )}
        
        <DynamicFilter
          filters={filters}
          values={filterValues}
          onChange={handleFilterChange}
        />
        <DataTable
          columns={columns}
          rows={filteredCategories}
          loading={loading}
          emptyMessage="No categories found"
        />
      </Box>
    </Container>
  );
};

export default Categories;
