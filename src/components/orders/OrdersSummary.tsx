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
      <Card sx={{ 
        mb: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '& .MuiCardContent-root': {
          flex: 1
        }
      }}>
        <CardContent>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 2,
              fontWeight: 600,
              color: 'text.primary'
            }}
          >
            Order Summary
          </Typography>
          {orderItems.length > 0 ? (
            <>
              <List sx={{ mb: 2 }}>
                {orderItems.map((item) => (
                  <ListItem 
                    key={item.product.id} 
                    divider
                    sx={{
                      py: 2,
                      px: 2,
                      '&:hover': {
                        bgcolor: 'action.hover'
                      }
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {item.product.name}
                        </Typography>
                      }
                      secondary={`$${item.product.price} × ${item.quantity}`}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                        sx={{ 
                          width: 70,
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: 'primary.main'
                            }
                          }
                        }}
                        inputProps={{ min: item.product.moq }}
                      />
                      <IconButton
                        edge="end"
                        onClick={() => onRemoveItem(item.product.id)}
                        color="error"
                        size="small"
                        sx={{
                          '&:hover': {
                            bgcolor: 'error.lighter'
                          }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </ListItem>
                ))}
              </List>
              <Box sx={{ 
                mt: 'auto', 
                pt: 2,
                borderTop: 1,
                borderColor: 'divider'
              }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600,
                    color: 'primary.main'
                  }}
                >
                  Total: ${totalAmount.toFixed(2)}
                </Typography>
              </Box>
            </>
          ) : (
            <Alert 
              severity="info"
              sx={{
                bgcolor: 'info.lighter',
                color: 'info.dark'
              }}
            >
              No products added to order yet
            </Alert>
          )}
        </CardContent>
      </Card>
    </FormGrid>
  );
};
