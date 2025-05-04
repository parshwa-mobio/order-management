import { useState, useCallback } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Typography, Button, Container } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useOrders } from "../../hooks/useOrders";
import { OrdersTable } from "../../components/orders/OrdersTable";
import { DynamicFilter } from "../../components/common/DynamicFilter";

type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

type StatusColorMap = {
  [K in OrderStatus]: string;
};

const orderFilters = [
  {
    field: "searchTerm",
    label: "Search Orders",
    type: "text" as const
  },
  {
    field: "status",
    label: "Status",
    type: "select" as const,
    options: [
      { value: "all", label: "All Statuses" },
      { value: "pending", label: "Pending" },
      { value: "confirmed", label: "Confirmed" },
      { value: "processing", label: "Processing" },
      { value: "shipped", label: "Shipped" },
      { value: "delivered", label: "Delivered" },
      { value: "cancelled", label: "Cancelled" }
    ]
  },
  {
    field: "from",
    label: "From Date",
    type: "date" as const
  },
  {
    field: "to",
    label: "To Date",
    type: "date" as const
  }
];

const statusColors: StatusColorMap = {
  pending: "warning",
  confirmed: "info",
  processing: "secondary",
  shipped: "primary",
  delivered: "success",
  cancelled: "error"
} as const;

const styles = {
  container: {
    py: 4
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 3
  },
  title: {
    fontWeight: 600,
    color: "primary.main"
  },
  headerButton: {
    bgcolor: "primary.main",
    "&:hover": {
      bgcolor: "primary.dark",
    }
  }
} as const;

const Orders = () => {
  const [filterValues, setFilterValues] = useState({
    searchTerm: "",
    status: "all",
    from: "",
    to: ""
  });

  const { orders } = useOrders({
    searchTerm: filterValues.searchTerm,
    filterStatus: filterValues.status,
    dateRange: { from: filterValues.from, to: filterValues.to }
  });

  const handleFilterChange = useCallback((field: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [field]: value }));
  }, []);

  const getStatusColor = useCallback((status: string) => 
    statusColors[status as OrderStatus] || "default"
  , []);

  return (
    <Container maxWidth="xl">
      <Box p={3}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4" component="h1" sx={styles.title}>
            Orders
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/orders/new"
            startIcon={<AddIcon />}
            sx={styles.headerButton}
          >
            New Order
          </Button>
        </Box>

        <DynamicFilter
          filters={orderFilters}
          values={filterValues}
          onChange={handleFilterChange}
        />

        <OrdersTable
          orders={orders}
          getStatusColor={getStatusColor}
        />
      </Box>
    </Container>
  );
};

export default Orders;









