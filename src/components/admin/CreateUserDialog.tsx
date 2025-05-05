import { useState } from "react";
import { FormDialog } from "../common/FormDialog";
import { FormTextField } from "../formCommon/FormTextField";
import { FormSelect } from "../formCommon/FormSelect";
import { FormButton } from "../formCommon/FormButton";
import { FormBox } from "../formCommon/FormBox";

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (userData: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => void;
}

const roleOptions = [
  { value: "distributor", label: "Distributor" },
  { value: "dealer", label: "Dealer" },
  { value: "sales", label: "Sales" },
  { value: "exportTeam", label: "Export Team" }
];

export const CreateUserDialog = ({ open, onClose, onSubmit }: CreateUserDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: "", email: "", password: "", role: "" });
  };

  const dialogActions = (
    <>
      <FormButton 
        onClick={onClose} 
        variant="outlined" 
        color="inherit"
        sx={{
          borderColor: 'grey.300',
          color: 'text.secondary',
          '&:hover': {
            borderColor: 'grey.400',
            bgcolor: 'grey.50'
          }
        }}
      >
        Cancel
      </FormButton>
      <FormButton 
        type="submit" 
        variant="contained"
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          '&:hover': {
            bgcolor: 'primary.dark'
          }
        }}
      >
        Create User
      </FormButton>
    </>
  );

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title="Create New User"
      actions={dialogActions}
    >
      <form onSubmit={handleSubmit}>
        <FormBox 
          display="flex" 
          flexDirection="column" 
          gap={3}
          sx={{
            '& .MuiFormControl-root': {
              '& .MuiInputLabel-root': {
                color: 'text.secondary'
              },
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'primary.main'
                }
              }
            }
          }}
        >
          <FormTextField
            name="name"
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="Enter user's full name"
          />
          <FormTextField
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            placeholder="Enter user's email address"
          />
          <FormTextField
            name="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            placeholder="Enter a strong password"
          />
          <FormSelect
            id="role"
            name="role"
            label="Role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            options={roleOptions}
            required
          />
        </FormBox>
      </form>
    </FormDialog>
  );
};