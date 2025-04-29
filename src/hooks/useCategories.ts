import { useState, useCallback } from "react";

export interface Category {
  _id: string;
  name: string;
  description: string;
  imageUrl?: string;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const baseUrl = import.meta.env.VITE_API_BASE;

  const handleApiError = (err: unknown, customMessage: string) => {
    const errorMessage = err instanceof Error ? err.message : customMessage;
    setError(errorMessage);
    throw new Error(errorMessage);
  };

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      const res = await fetch(`${baseUrl}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch categories: ${res.statusText}`);
      }
      
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      handleApiError(err, "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  const createCategory = async (category: Omit<Category, "_id">) => {
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      const res = await fetch(`${baseUrl}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(category),
      });

      if (!res.ok) {
        throw new Error(`Failed to create category: ${res.statusText}`);
      }

      await fetchCategories();
    } catch (err) {
      handleApiError(err, "Failed to create category");
    }
  };

  const deleteCategory = async (id: string) => {
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      const res = await fetch(`${baseUrl}/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error(`Failed to delete category: ${res.statusText}`);
      }

      // Optimistically update the UI
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
    } catch (err) {
      handleApiError(err, "Failed to delete category");
    }
  };

  const updateCategory = async (id: string, category: Omit<Category, "_id">) => {
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      const res = await fetch(`${baseUrl}/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(category),
      });

      if (!res.ok) {
        throw new Error(`Failed to update category: ${res.statusText}`);
      }

      // Optimistically update the UI
      setCategories((prev) =>
        prev.map((cat) => (cat._id === id ? { ...cat, ...category } : cat))
      );
    } catch (err) {
      handleApiError(err, "Failed to update category");
    }
  };

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    deleteCategory,
    updateCategory,
  };
};
