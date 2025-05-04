import React, { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { Category } from "../../hooks/useCategories";
import { Stack, Box } from "@mui/material";  // Added Box import
import { FormContainer } from "../formCommon/FormContainer";
import { FormTextField } from "../formCommon/FormTextField";
import { FormButton } from "../formCommon/FormButton";

interface AddCategoryFormProps {
  onCreate: (category: Omit<Category, "_id">) => Promise<void>;
  creating: boolean;
  onCancel: () => void;  // Add this prop
}

const initialFormState = { name: "", description: "", imageUrl: "" };

const AddCategoryForm: React.FC<AddCategoryFormProps> = ({
  onCreate,
  creating,
  onCancel  // Add this prop
}) => {
  const [form, setForm] = useState(initialFormState);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreate(form);
    setForm(initialFormState);
  }, [form, onCreate]);

  const handleInputChange = useCallback((field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  }, []);

  return (
    <FormContainer title="Add New Category" onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <FormTextField
          name="name"
          label="Name"
          value={form.name}
          onChange={handleInputChange("name")}
          required
          placeholder="Enter category name"
        />
        <FormTextField
          name="description"
          label="Description"
          value={form.description}
          onChange={handleInputChange("description")}
          placeholder="Enter category description"
          multiline
          rows={3}
        />
        <FormTextField
          name="imageUrl"
          label="Image URL"
          value={form.imageUrl}
          onChange={handleInputChange("imageUrl")}
          placeholder="Enter image URL"
          helperText="Provide a URL for the category image"
        />
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <FormButton
            type="button"
            variant="outlined"
            onClick={onCancel}
          >
            Cancel
          </FormButton>
          <FormButton
            type="submit"
            disabled={creating}
            startIcon={<Plus size={20} />}
          >
            {creating ? "Saving..." : "Save Category"}
          </FormButton>
        </Box>
      </Stack>
    </FormContainer>
  );
};

export default AddCategoryForm;
