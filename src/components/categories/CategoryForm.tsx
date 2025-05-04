import React from 'react';
import {
  Box,
  Button,
  Stack,
  Typography,
  Paper,
  TextField,
  Container
} from '@mui/material';
import { Category } from '../../hooks/useCategories';

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
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {'_id' in initialData ? 'Edit Category' : 'New Category'}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 2 }}
        >
          <Stack spacing={3}>
            <TextField
              fullWidth
              required
              label="Name"
              name="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              multiline
              rows={4}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Image URL"
              name="imageUrl"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              variant="outlined"
              helperText="Enter the URL of the category image"
            />
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              justifyContent: 'flex-end',
              mt: 4 
            }}>
              <Button 
                variant="outlined" 
                onClick={onCancel}
                sx={{ px: 4 }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                sx={{ px: 4 }}
              >
                {'_id' in initialData ? 'Update' : 'Create'}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};