import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Box,
  Typography,
  Link,
} from "@mui/material";
import { Visibility as VisibilityIcon } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

interface OrderItem {
  product: any; // Accepts object as per backend response
  quantity: number;
  unitPrice: number;
  _id: string;
  sku: string;
  name: string;
  tax: number;
  discount: number;
  totalPrice: number;
}

interface Order {
  _id: string;
  orderNumber?: string;
  user: any; // Accepts object as per backend response
  orderItems: OrderItem[];
  totalAmount?: number;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  createdAt: string;
  updatedAt: string;
  orderType?: string;
}

interface OrderTableProps {
  orders: Order[];
  getStatusColor: (status: string) => string;
}

export const OrdersTable = ({ orders, getStatusColor }: OrderTableProps) => {
  if (!orders.length) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="body1" color="text.secondary">
          No orders found
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Items</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id} hover>
              <TableCell>
                <Link
                  component={RouterLink}
                  to={`/orders/${order._id}`}
                  color="primary"
                  underline="hover"
                  sx={{ fontWeight: 500 }}
                >
                  {order.orderNumber ?? order._id}
                </Link>
              </TableCell>
              <TableCell>
                {Array.isArray(order.orderItems) ? order.orderItems.length : 0}{" "}
                items
              </TableCell>
              <TableCell>
                <Chip
                  label={order.status}
                  color={getStatusColor(order.status) as any}
                  size="small"
                  sx={{ textTransform: "capitalize" }}
                />
              </TableCell>
              <TableCell>
                {new Date(order.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>${order.totalAmount?.toFixed(2) ?? "0.00"}</TableCell>
              <TableCell>
                <IconButton
                  component={RouterLink}
                  to={`/orders/${order._id}`}
                  size="small"
                >
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
