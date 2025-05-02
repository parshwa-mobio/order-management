import {
  Typography,
  Box,
  Grid,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import { FormGrid } from "../formCommon/FormGrid";
import { PaperBox } from "../formCommon/PaperBox";

interface OrderItem {
  _id: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  totalAmount: number;
  user: {
    name: string;
    email: string;
  };
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod?: string;
  notes?: string;
}

interface OrderDetailsProps {
  order: Order;
  getStatusColor: (status: string) => string;
}

export const OrderDetails = ({ order, getStatusColor }: OrderDetailsProps) => {
  return (
    <Box sx={{ py: 3 }}>
      <Grid container spacing={3}>
        <FormGrid item xs={12}>
          <PaperBox sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" component="h2">
                Order #{order.orderNumber || order._id}
              </Typography>
              <Chip 
                label={order.status} 
                color={getStatusColor(order.status) as any}
                sx={{ textTransform: 'capitalize' }}
              />
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <FormGrid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">Date Placed</Typography>
                <Typography variant="body1">{new Date(order.createdAt).toLocaleDateString()}</Typography>
              </FormGrid>
              <FormGrid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">Customer</Typography>
                <Typography variant="body1">{order.user?.name || 'N/A'}</Typography>
                <Typography variant="body2" color="text.secondary">{order.user?.email || 'N/A'}</Typography>
              </FormGrid>
              <FormGrid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">Total Amount</Typography>
                <Typography variant="body1" fontWeight="bold">${order.totalAmount?.toFixed(2) || '0.00'}</Typography>
              </FormGrid>
            </Grid>
          </PaperBox>
        </FormGrid>

        <FormGrid item xs={12}>
          <PaperBox sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Order Items</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>SKU</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">${item.unitPrice?.toFixed(2) || '0.00'}</TableCell>
                      <TableCell align="right">${item.totalPrice?.toFixed(2) || '0.00'}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={4} align="right" sx={{ fontWeight: 'bold' }}>Total:</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>${order.totalAmount?.toFixed(2) || '0.00'}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </PaperBox>
        </FormGrid>

        {order.shippingAddress && (
          <FormGrid item xs={12} md={6}>
            <PaperBox sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Shipping Information</Typography>
              <Typography variant="body1">
                {order.shippingAddress.street}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                {order.shippingAddress.country}
              </Typography>
            </PaperBox>
          </FormGrid>
        )}

        {order.paymentMethod && (
          <FormGrid item xs={12} md={6}>
            <PaperBox sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Payment Information</Typography>
              <Typography variant="body1">
                Method: {order.paymentMethod}
              </Typography>
            </PaperBox>
          </FormGrid>
        )}

        {order.notes && (
          <FormGrid item xs={12}>
            <PaperBox sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Notes</Typography>
              <Typography variant="body1">{order.notes}</Typography>
            </PaperBox>
          </FormGrid>
        )}
      </Grid>
    </Box>
  );
};
