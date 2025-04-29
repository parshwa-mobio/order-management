import { useState, useEffect } from "react";
import { useToast } from "./useToast";

export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  imageUrl?: string;
  category: string;
  netWeight: number;
  grossWeight: number;
  volume: number;
  shelfLife?: string;
  basePrice: number;
  tax?: number;
  discount?: number;
  moq: number;
  containerTypes?: string[];
  stockByDistributor?: Array<{
    distributorId: string;
    quantity: number;
    _id?: string;
  }>;
  // Add these computed properties
  stock: number;
  container20ftCapacity?: number;
  container40ftCapacity?: number;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const baseUrl = import.meta.env.VITE_API_BASE;

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${baseUrl}/products`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();

      // Transform API response to match Product interface
      const transformedProducts = data.products.map((p: any) => ({
        id: p._id,
        sku: p.sku,
        name: p.name,
        category: p.category,
        basePrice: p.basePrice,
        moq: p.moq,
        stock:
          p.stockByDistributor?.reduce(
            (total: number, item: any) => total + item.quantity,
            0,
          ) || 0,
        netWeight: p.netWeight,
        grossWeight: p.grossWeight,
        volume: p.volume,
        container20ftCapacity: p.containerTypes?.includes("20ft")
          ? 1
          : undefined,
        container40ftCapacity: p.containerTypes?.includes("40ft")
          ? 1
          : undefined,
        containerTypes: p.containerTypes || [],
        stockByDistributor: p.stockByDistributor || [],
      }));

      setProducts(transformedProducts);
    } catch (error) {
      showToast("Failed to fetch products", "error");
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: Omit<Product, "id">) => {
    try {
      const transformedData = {
        sku: productData.sku,
        name: productData.name,
        description: productData.description,
        imageUrl: productData.imageUrl,
        category: productData.category,
        netWeight: productData.netWeight,
        grossWeight: productData.grossWeight,
        volume: productData.volume,
        shelfLife: productData.shelfLife,
        basePrice: productData.basePrice,
        tax: productData.tax,
        discount: productData.discount,
        moq: productData.moq,
        containerTypes: [
          ...(productData.container20ftCapacity ? ["20ft"] : []),
          ...(productData.container40ftCapacity ? ["40ft"] : []),
        ],
        stockByDistributor: productData.stockByDistributor || [],
      };

      const response = await fetch(`${baseUrl}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(transformedData),
      });

      if (!response.ok) throw new Error("Failed to create product");
      const newProduct = await response.json();

      // Transform the response to match our frontend Product interface
      const transformedProduct: Product = {
        id: newProduct._id,
        sku: newProduct.sku,
        name: newProduct.name,
        description: newProduct.description,
        imageUrl: newProduct.imageUrl,
        category: newProduct.category,
        netWeight: newProduct.netWeight,
        grossWeight: newProduct.grossWeight,
        volume: newProduct.volume,
        shelfLife: newProduct.shelfLife,
        basePrice: newProduct.basePrice,
        tax: newProduct.tax,
        discount: newProduct.discount,
        moq: newProduct.moq,
        container20ftCapacity: newProduct.containerTypes?.includes("20ft")
          ? 1
          : undefined,
        container40ftCapacity: newProduct.containerTypes?.includes("40ft")
          ? 1
          : undefined,
        stockByDistributor: newProduct.stockByDistributor,
        // Calculate total stock from stockByDistributor
        stock:
          newProduct.stockByDistributor?.reduce(
            (total: number, item: any) => total + item.quantity,
            0,
          ) || 0,
      };

      setProducts([...products, transformedProduct]);
      showToast("Product created successfully", "success");
      return transformedProduct;
    } catch (error) {
      showToast("Failed to create product", "error");
      throw error;
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const response = await fetch(`${baseUrl}/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(productData),
      });
      if (!response.ok) throw new Error("Failed to update product");
      const updatedProduct = await response.json();
      setProducts(products.map((p) => (p.id === id ? updatedProduct : p)));
      showToast("Product updated successfully", "success");
      return updatedProduct;
    } catch (error) {
      showToast("Failed to update product", "error");
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch(`${baseUrl}/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete product");
      setProducts(products.filter((p) => p.id !== id));
      showToast("Product deleted successfully", "success");
    } catch (error) {
      showToast("Failed to delete product", "error");
      throw error;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    createProduct,
    updateProduct,
    deleteProduct,
    refreshProducts: fetchProducts,
  };
};
