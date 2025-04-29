import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";

interface FormData {
  sku: string;
  name: string;
  category: string;
  price: number;
  moq: number;
  stock: number;
  netWeight: number;
  grossWeight: number;
  volume: number;
  container20ftCapacity: number | undefined;
  container40ftCapacity: number | undefined;
}

const ProductEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, updateProduct } = useProducts();
  const [formData, setFormData] = useState<FormData>({
    sku: "",
    name: "",
    category: "",
    price: 0,
    moq: 1,
    stock: 0,
    netWeight: 0,
    grossWeight: 0,
    volume: 0,
    container20ftCapacity: undefined,
    container40ftCapacity: undefined,
  });

  useEffect(() => {
    const product = products.find((p) => p.id === id);
    if (product) {
      setFormData({
        sku: product.sku,
        name: product.name,
        category: product.category,
        price: product.basePrice,
        moq: product.moq,
        stock: product.stock,
        netWeight: product.netWeight,
        grossWeight: product.grossWeight,
        volume: product.volume,
        container20ftCapacity: product.container20ftCapacity ?? undefined,
        container40ftCapacity: product.container40ftCapacity ?? undefined,
      });
    }
  }, [id, products]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProduct(id!, formData);
      navigate("/products"); // Changed from '/admin/products' to '/products'
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name.includes("price") ||
        name.includes("Weight") ||
        name.includes("volume") ||
        name.includes("Capacity")
          ? value === ""
            ? undefined
            : parseFloat(value)
          : name === "moq" || name === "stock"
            ? parseInt(value, 10)
            : value,
    }));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl bg-white p-6 rounded-lg shadow"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              SKU
            </label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select Category</option>
              <option value="distributor">Distributor</option>
              <option value="dealer">Dealer</option>
              <option value="sales">Sales</option>
              <option value="exportTeam">Export Team</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              MOQ
            </label>
            <input
              type="number"
              name="moq"
              value={formData.moq}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Stock
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Net Weight
            </label>
            <input
              type="number"
              name="netWeight"
              value={formData.netWeight}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gross Weight
            </label>
            <input
              type="number"
              name="grossWeight"
              value={formData.grossWeight}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Volume
            </label>
            <input
              type="number"
              name="volume"
              value={formData.volume}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              20ft Container Capacity
            </label>
            <input
              type="number"
              name="container20ftCapacity"
              value={formData.container20ftCapacity || ""}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              40ft Container Capacity
            </label>
            <input
              type="number"
              name="container40ftCapacity"
              value={formData.container40ftCapacity || ""}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="0"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEdit;
