import { useState, useEffect } from "react";
import { useToast } from "../useToast";

export interface Category {
  _id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  updatedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  __v?: number;
}

export const useCategories = (categoryId?: string) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const baseUrl = import.meta.env.VITE_API_BASE;

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      const response = await fetch(`${baseUrl}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch categories";
      setError(errorMessage);
      showToast("Failed to fetch categories", "error");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      const response = await fetch(`${baseUrl}/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) throw new Error("Failed to fetch category");
      
      const data = await response.json();
      setCategory(data);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch category";
      setError(errorMessage);
      showToast("Failed to fetch category", "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (category: Omit<Category, "_id">) => {
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      const response = await fetch(`${baseUrl}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(category),
      });

      if (!response.ok) {
        throw new Error("Failed to create category");
      }

      await fetchCategories();
      showToast("Category created successfully", "success");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create category";
      setError(errorMessage);
      showToast("Failed to create category", "error");
    }
  };

  const deleteCategory = async (id: string) => {
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      const response = await fetch(`${baseUrl}/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      setCategories((prev) => prev.filter((cat) => cat._id !== id));
      if (category && category._id === id) {
        setCategory(null);
      }
      showToast("Category deleted successfully", "success");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete category";
      setError(errorMessage);
      showToast("Failed to delete category", "error");
    }
  };

  const updateCategory = async (id: string, categoryData: Omit<Category, "_id">) => {
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      const response = await fetch(`${baseUrl}/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        throw new Error("Failed to update category");
      }

      setCategories((prev) =>
        prev.map((cat) => (cat._id === id ? { ...cat, ...categoryData } : cat))
      );
      
      if (category && category._id === id) {
        setCategory({ ...category, ...categoryData });
      }
      
      showToast("Category updated successfully", "success");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update category";
      setError(errorMessage);
      showToast("Failed to update category", "error");
    }
  };

  // Fetch all categories on initial load
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch specific category if categoryId is provided
  useEffect(() => {
    if (categoryId) {
      getCategoryById(categoryId);
    }
  }, [categoryId]);

  return {
    // List operations
    categories,
    fetchCategories,
    
    // Single category operations
    category,
    getCategoryById,
    
    // Common operations
    createCategory,
    deleteCategory,
    updateCategory,
    
    // Status
    loading,
    error,
  };
};
