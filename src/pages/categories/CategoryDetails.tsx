import { useParams } from "react-router-dom";
import { useState } from "react";
import { Box, Typography, Button, Container, CircularProgress } from "@mui/material";
import { Category, useCategories } from "../../hooks/useCategories";
import { useCategoryDetails } from "../../hooks/useCategoryDetails";
import { CategoryForm } from "../../components/categories/CategoryForm";

const CategoryDetails = () => {
  const { id } = useParams();
  const { updateCategory } = useCategories();
  const { category, loading, fetchCategory } = useCategoryDetails(id);
  const [editing, setEditing] = useState(false);

  const handleSubmit = async (formData: Omit<Category, '_id'>) => {
    if (!id) return;
    try {
      await updateCategory(id, formData);
      setEditing(false);
      await fetchCategory();
    } catch (err) {
      console.error('Failed to update category:', err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (!category) {
    return (
      <Box p={3}>
        <Typography color="error">Category not found.</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box p={3}>
        {editing ? (
          <CategoryForm
            initialData={{
              name: category.name,
              description: category.description,
              imageUrl: category.imageUrl || ''
            }}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h4" component="h1">
                {category.name}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setEditing(true)}
              >
                Edit Category
              </Button>
            </Box>
            <Typography variant="body1" paragraph>
              {category.description}
            </Typography>
            {category.imageUrl && (
              <Box
                component="img"
                src={category.imageUrl}
                alt={category.name}
                sx={{
                  height: 128,
                  width: 128,
                  objectFit: 'cover',
                  borderRadius: 1
                }}
              />
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default CategoryDetails;
