import { useState, useEffect } from "react";
import { FormDialog } from "../common/FormDialog";
import { FormTextField } from "../formCommon/FormTextField";
import { FormSelect } from "../formCommon/FormSelect";
import { FormButton } from "../formCommon/FormButton";
import { FormBox } from "../formCommon/FormBox";

interface EditUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (userData: {
    name: string;
    email: string;
    role: string;
  }) => void;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

const roleOptions = [
  { value: "distributor", label: "Distributor" },
  { value: "dealer", label: "Dealer" },
  { value: "sales", label: "Sales" },
  { value: "exportTeam", label: "Export Team" }
];

export const EditUserDialog = ({ open, onClose, onSubmit, user }: EditUserDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
        Save Changes
      </FormButton>
    </>
  );

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title="Edit User"
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