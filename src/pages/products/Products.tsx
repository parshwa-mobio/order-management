import { useState } from "react";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Product, useProducts } from "../../hooks/useProducts";

const TableHeader = () => (
  <thead className="bg-gray-50">
    <tr>
      {["SKU", "Name", "Category", "Price", "Stock", "Actions"].map(
        (header) => (
          <th
            key={header}
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {header}
          </th>
        ),
      )}
    </tr>
  </thead>
);

const SearchBar = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="flex-1 relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Search className="h-5 w-5 text-gray-400" />
    </div>
    <input
      type="text"
      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      placeholder="Search products..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const CategoryFilter = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="sm:w-64">
    <select
      className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="all">All Categories</option>
      <option value="distributor">Distributor</option>
      <option value="dealer">Dealer</option>
      <option value="sales">Sales</option>
      <option value="exportTeam">Export Team</option>
    </select>
  </div>
);

const ProductRow = ({
  product,
  onDelete,
}: {
  product: Product;
  onDelete: (id: string) => void;
}) => (
  <tr key={product.id}>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
      {product.sku}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {product.name}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {product.category}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      ${product.basePrice.toFixed(2)}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {product.stock}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <Link
        to={`/products/edit/${product.id}`}
        className="text-blue-600 hover:text-blue-900 mr-4"
      >
        <Edit2 className="h-5 w-5 inline" />
      </Link>
      <button
        onClick={() => onDelete(product.id)}
        className="text-red-600 hover:text-red-900"
      >
        <Trash2 className="h-5 w-5 inline" />
      </button>
    </td>
  </tr>
);

const Products = () => {
  const { products, loading, deleteProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link
          to="/products/create"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Product
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
            <CategoryFilter
              value={filterCategory}
              onChange={setFilterCategory}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <TableHeader />
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Products;
