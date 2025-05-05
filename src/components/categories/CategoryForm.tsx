import React from 'react';
import { Stack, Box } from '@mui/material';
import { Category } from '../../hooks/categories/useCategories';
import { FormContainer } from '../formCommon/FormContainer';
import { FormTextField } from '../formCommon/FormTextField';
import { FormButton } from '../formCommon/FormButton';

interface CategoryFormProps {
  initialData: Omit<Category, '_id'>;
  onSubmit: (data: Omit<Category, '_id'>) => Promise<void>;
  onCancel: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const [form, setForm] = React.useState(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <FormContainer 
      title={'_id' in initialData ? 'Edit Category' : 'New Category'}
      onSubmit={handleSubmit}
    >
      <Stack spacing={3}>
        <FormTextField
          fullWidth
          required
          label="Name"
          name="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <FormTextField
          fullWidth
          label="Description"
          name="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          multiline
          rows={4}
        />
        <FormTextField
          fullWidth
          label="Image URL"
          name="imageUrl"
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          helperText="Enter the URL of the category image"
        />
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          justifyContent: 'flex-end',
          mt: 4 
        }}>
          <FormButton 
            variant="outlined" 
            onClick={onCancel}
          >
            Cancel
          </FormButton>
          <FormButton 
            type="submit" 
            variant="contained" 
            color="primary"
          >
            {'_id' in initialData ? 'Update' : 'Create'}
          </FormButton>
        </Box>
      </Stack>
    </FormContainer>
  );
};