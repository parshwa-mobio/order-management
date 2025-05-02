import { useEffect, useState, useCallback } from "react";
import { useCategories } from "../../hooks/useCategories";
import { PageContainer } from "../../components/formCommon/PageContainer";
import { DataTable } from "../../components/formCommon/DataTable";
import { Button, Box } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import AddCategoryForm from "../../components/categories/AddCategoryForm";

const Categories = () => {
  const {
    categories,
    loading,
    fetchCategories,
    createCategory,
    deleteCategory,
  } = useCategories();
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreate = useCallback(async (category: {
    name: string;
    description: string;
    imageUrl?: string;
  }) => {
    setCreating(true);
    try {
      await createCategory(category);
    } finally {
      setCreating(false);
    }
  }, [createCategory]);

  const handleDelete = useCallback(async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }
    await deleteCategory(id);
  }, [deleteCategory]);

  const columns = [
    { field: "name", headerName: "Name" },
    { field: "description", headerName: "Description" },
    {
      field: "actions",
      headerName: "Actions",
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

  const toggleCreating = useCallback(() => {
    setCreating(prev => !prev);
  }, []);

  return (
    <PageContainer
      title="Categories"
      actions={
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={toggleCreating}
        >
          Add Category
        </Button>
      }
    >
      <AddCategoryForm onCreate={handleCreate} creating={creating} />
      <Box sx={{ mt: 3 }}>
        <DataTable
          columns={columns}
          rows={categories}
          loading={loading}
          emptyMessage="No categories found"
        />
      </Box>
    </PageContainer>
  );
};

export default Categories;
