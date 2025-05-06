import { Box, Typography, Chip, IconButton, Link } from "@mui/material";
import { Visibility as VisibilityIcon } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { DataTable } from "../common/DataTable";

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

  const columns = [
    {
      field: "orderNumber",
      headerName: "Order ID",
      flex: 1,
      renderCell: (row: Order) => (
        <Link
          component={RouterLink}
          to={`/orders/${row._id}`}
          color="primary"
          underline="hover"
          sx={{ fontWeight: 500 }}
        >
          {row.orderNumber ?? row._id}
        </Link>
      ),
    },
    {
      field: "items",
      headerName: "Items",
      flex: 1,
      renderCell: (row: Order) => `${Array.isArray(row.orderItems) ? row.orderItems.length : 0} items`,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (row: Order) => (
        <Chip
          label={row.status}
          color={getStatusColor(row.status) as any}
          size="small"
          sx={{ textTransform: "capitalize" }}
        />
      ),
    },
    {
      field: "createdAt",
      headerName: "Date",
      flex: 1,
      renderCell: (row: Order) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      field: "totalAmount",
      headerName: "Total",
      flex: 1,
      renderCell: (row: Order) => `$${row.totalAmount?.toFixed(2) ?? "0.00"}`,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (row: Order) => (
        <IconButton
          component={RouterLink}
          to={`/orders/${row._id}`}
          size="small"
        >
          <VisibilityIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  return (
    <Box>
      <DataTable
        columns={columns}
        rows={orders}
        emptyMessage="No orders found"
      />
    </Box>
  );
};
