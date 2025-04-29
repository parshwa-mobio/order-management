import { useEffect, useState } from "react";
import { useCategories } from "../../hooks/useCategories";
import AddCategoryForm from "../../components/categories/AddCategoryForm";
import CategoryTable from "../../components/categories/CategoryTable";

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

  const handleCreate = async (category: {
    name: string;
    description: string;
    imageUrl?: string;
  }) => {
    setCreating(true);
    try {
      await createCategory(category);
    } catch (err) {
      // Optionally show error toast
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      await deleteCategory(id);
    } catch (err) {
      // Optionally show error toast
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Categories</h1>
      <div className="bg-white rounded-lg shadow mb-8 p-6">
        <h2 className="text-lg font-semibold mb-4">Add New Category</h2>
        <AddCategoryForm onCreate={handleCreate} creating={creating} />
      </div>
      <CategoryTable
        categories={categories}
        loading={loading}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Categories;
