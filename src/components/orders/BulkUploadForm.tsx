import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Error as ErrorIcon,
  FilePresent as FileIcon,
} from "@mui/icons-material";
import { PaperBox } from "../common/PaperBox";
import { FormButton } from "../formCommon/FormButton";
import { ChangeEvent, memo } from "react";

interface ValidationError {
  row: number;
  sku: string;
  message: string;
}

interface OrderItem {
  sku: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface OrderSummary {
  totalItems: number;
  totalAmount: number;
  items: OrderItem[];
}

interface BulkUploadFormProps {
  onFileUpload: (file: File) => void;
  onConfirmOrder: () => void;
  validationErrors: ValidationError[];
  orderSummary: OrderSummary | null;
  loading: boolean;
  file: File | null;
}

const ValidationErrorsList = memo(
  ({ errors }: { errors: ValidationError[] }) => (
    <Box sx={{ mt: 3 }}>
      <Typography
        variant="subtitle1"
        color="error"
        sx={{ mb: 1, fontWeight: 500 }}
      >
        Validation Errors
      </Typography>
      <List dense>
        {errors.map((error) => (
          <ListItem key={`${error.row}-${error.sku}`}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <ErrorIcon color="error" fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography color="error">
                  Row {error.row}: {error.message} (SKU: {error.sku})
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  )
);

const OrderSummaryTable = memo(({ summary }: { summary: OrderSummary }) => (
  <Box sx={{ mt: 4 }}>
    <Typography variant="h6" sx={{ mb: 2 }}>
      Order Summary
    </Typography>
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>SKU</TableCell>
            <TableCell>Name</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {summary.items.map((item) => (
            <TableRow key={`${item.sku}-${item.quantity}`}>
              <TableCell>{item.sku}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell align="right">{item.quantity}</TableCell>
              <TableCell align="right">${item.price.toFixed(2)}</TableCell>
              <TableCell align="right">${item.total.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} align="right" sx={{ fontWeight: "bold" }}>
              Total Amount:
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              ${summary.totalAmount.toFixed(2)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  </Box>
));

export const BulkUploadForm = memo(
  ({
    onFileUpload,
    onConfirmOrder,
    validationErrors,
    orderSummary,
    loading,
    file,
  }: BulkUploadFormProps) => {
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
      const uploadedFile = event.target.files?.[0];
      if (!uploadedFile) return;
      onFileUpload(uploadedFile);
    };

    return (
      <Box sx={{ maxWidth: "lg", mx: "auto", py: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 600 }}>
          Bulk Upload Orders
        </Typography>

        <PaperBox sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Upload File
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            CSV or Excel with columns: sku, quantity
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              sx={{ mr: 2 }}
            >
              Select File
              <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileChange} hidden />
            </Button>
            {file && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <FileIcon sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="body2" color="text.secondary">
                  {file.name}
                </Typography>
              </Box>
            )}
          </Box>

          {validationErrors.length > 0 && (
            <ValidationErrorsList errors={validationErrors} />
          )}

          {orderSummary && (
            <>
              <OrderSummaryTable summary={orderSummary} />
              <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                <FormButton
                  onClick={onConfirmOrder}
                  disabled={loading}
                  variant="contained"
                >
                  {loading ? "Processing..." : "Confirm Order"}
                </FormButton>
              </Box>
            </>
          )}
        </PaperBox>
      </Box>
    );
  }
);
