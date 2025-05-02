import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  TextField,
  IconButton,
  Alert
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { FormGrid } from "../formCommon/FormGrid";

interface Product {
  id: string;
  name: string;
  price: number;
  moq: number;
}

interface OrderItem {
  product: Product;
  quantity: number;
}

interface OrdersSummaryProps {
  orderItems: OrderItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

export const OrdersSummary = ({
  orderItems,
  onUpdateQuantity,
  onRemoveItem
}: OrdersSummaryProps) => {
  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <FormGrid item xs={12} md={4}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Order Summary
          </Typography>
          {orderItems.length > 0 ? (
            <>
              <List>
                {orderItems.map((item) => (
                  <ListItem key={item.product.id} divider>
                    <ListItemText
                      primary={item.product.name}
                      secondary={`$${item.product.price} × ${item.quantity}`}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TextField
                        type="number"
                        size="small"
                        value={item.quantity}
                        onChange={(e) =>
                          onUpdateQuantity(
                            item.product.id,
                            parseInt(e.target.value)
                          )
                        }
                        sx={{ width: 70, mr: 1 }}
                        inputProps={{ min: item.product.moq }}
                      />
                      <IconButton
                        edge="end"
                        onClick={() => onRemoveItem(item.product.id)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </ListItem>
                ))}
              </List>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Total: ${totalAmount.toFixed(2)}
                </Typography>
              </Box>
            </>
          ) : (
            <Alert severity="info">
              No products added to order yet
            </Alert>
          )}
        </CardContent>
      </Card>
    </FormGrid>
  );
};
