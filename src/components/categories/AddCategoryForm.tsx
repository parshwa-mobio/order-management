import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Category } from "../../hooks/useCategories";

interface AddCategoryFormProps {
  onCreate: (category: Omit<Category, "_id">) => Promise<void>;
  creating: boolean;
}

const AddCategoryForm: React.FC<AddCategoryFormProps> = ({
  onCreate,
  creating,
}) => {
  const [form, setForm] = useState({ name: "", description: "", imageUrl: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreate(form);
    setForm({ name: "", description: "", imageUrl: "" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 sm:flex-row sm:items-end"
    >
      <input
        type="text"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="border rounded px-3 py-2 flex-1"
        required
      />
      <input
        type="text"
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="border rounded px-3 py-2 flex-1"
      />
      <input
        type="text"
        placeholder="Image URL"
        value={form.imageUrl}
        onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
        className="border rounded px-3 py-2 flex-1"
      />
      <button
        type="submit"
        className="inline-flex items-center px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
        disabled={creating}
      >
        <Plus className="h-4 w-4 mr-2" />
        {creating ? "Creating..." : "Add"}
      </button>
    </form>
  );
};

export default AddCategoryForm;
