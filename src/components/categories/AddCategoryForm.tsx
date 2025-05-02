import React, { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { Category } from "../../hooks/useCategories";

interface AddCategoryFormProps {
  onCreate: (category: Omit<Category, "_id">) => Promise<void>;
  creating: boolean;
}

const initialFormState = { name: "", description: "", imageUrl: "" };

const AddCategoryForm: React.FC<AddCategoryFormProps> = ({
  onCreate,
  creating,
}) => {
  const [form, setForm] = useState(initialFormState);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreate(form);
    setForm(initialFormState);
  }, [form, onCreate]);

  const handleInputChange = useCallback((field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  }, []);

  const inputClasses = "border rounded px-3 py-2 flex-1";
  const buttonClasses = "inline-flex items-center px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 sm:flex-row sm:items-end"
    >
      <input
        type="text"
        placeholder="Name"
        value={form.name}
        onChange={handleInputChange("name")}
        className={inputClasses}
        required
      />
      <input
        type="text"
        placeholder="Description"
        value={form.description}
        onChange={handleInputChange("description")}
        className={inputClasses}
      />
      <input
        type="text"
        placeholder="Image URL"
        value={form.imageUrl}
        onChange={handleInputChange("imageUrl")}
        className={inputClasses}
      />
      <button
        type="submit"
        className={buttonClasses}
        disabled={creating}
      >
        <Plus className="h-4 w-4 mr-2" />
        {creating ? "Creating..." : "Add"}
      </button>
    </form>
  );
};

export default AddCategoryForm;
