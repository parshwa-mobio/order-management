import React from "react";
import { Trash2 } from "lucide-react";
import { Category } from "../../hooks/useCategories";
import { Link } from "react-router-dom";

interface CategoryTableProps {
  categories: Category[];
  loading: boolean;
  onDelete: (id: string) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  loading,
  onDelete,
}) => {
  const renderTableContent = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={4} className="px-6 py-4 text-center">
            Loading...
          </td>
        </tr>
      );
    }

    if (categories.length === 0) {
      return (
        <tr>
          <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
            No categories found.
          </td>
        </tr>
      );
    }

    return categories.map((cat) => (
      <tr key={cat._id}>
        <td className="px-6 py-4">
          <Link
            to={`/categories/${cat._id}`}
            className="text-blue-600 hover:underline"
          >
            {cat.name}
          </Link>
        </td>
        <td className="px-6 py-4">{cat.description}</td>
        <td className="px-6 py-4">
          {cat.imageUrl ? (
            <img
              src={cat.imageUrl}
              alt={cat.name}
              className="h-10 w-10 object-cover rounded"
            />
          ) : (
            <span className="text-gray-400">No image</span>
          )}
        </td>
        <td className="px-6 py-4">
          <button
            onClick={() => onDelete(cat._id)}
            className="text-red-600 hover:text-red-900"
            aria-label={`Delete ${cat.name}`}
          >
            <Trash2 className="h-5 w-5 inline" />
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Image
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {renderTableContent()}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;
