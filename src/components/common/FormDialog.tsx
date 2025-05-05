import { ReactNode } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import { FormBox } from "../formCommon/FormBox";

interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const FormDialog = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm'
}: FormDialogProps) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth={maxWidth} 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: (theme) => theme.shadows[3]
        }
      }}
    >
      <DialogTitle>
        <Typography 
          variant="h6" 
          component="h2" 
          sx={{ 
            fontWeight: 600,
            color: 'primary.main',
            fontSize: '1.25rem'
          }}
        >
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <FormBox sx={{ pt: 1 }}>
          {children}
        </FormBox>
      </DialogContent>
      {actions && (
        <DialogActions sx={{ px: 3, pb: 3 }}>
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};