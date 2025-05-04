import { useState, useEffect } from 'react';
import { Category } from './useCategories';

export const useCategoryDetails = (id: string | undefined) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategory = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch category");
      const data = await res.json();
      setCategory(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch category');
      setCategory(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [id]);

  return {
    category,
    loading,
    error,
    fetchCategory
  };
};