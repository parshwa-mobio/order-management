import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Container,
  type Theme
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useOrders } from "../../hooks/useOrders";
import { OrdersTable } from "../../components/orders/OrdersTable";
import { OrdersFilter } from "../../components/orders/OrdersFilter";
import { FormBox } from "../../components/formCommon/FormBox";

// Type definitions for better type safety
interface DateRange {
  from: string;
  to: string;
}

type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

type StatusColorMap = {
  [K in OrderStatus]: string;
};

const Orders = () => {
  // State management with proper typing
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>("all");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: "",
    to: "",
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  // Custom hook for orders with proper typing
  const { orders } = useOrders({ searchTerm, filterStatus, dateRange });

  // Status color mapping with type safety
  const statusColors: StatusColorMap = {
    pending: "warning",
    confirmed: "info",
    processing: "secondary",
    shipped: "primary",
    delivered: "success",
    cancelled: "error"
  };


  // Styles object for better organization
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
      fontWeight: 600
    },
    newOrderButton: (theme: Theme) => ({
      '&:hover': {
        backgroundColor: theme.palette.primary.dark
      }
    })
  };

  return (
    <Container maxWidth="lg">
      <Box sx={styles.container}>
        <FormBox sx={styles.header}>
          <Typography variant="h4" component="h1" sx={styles.title}>
            Orders
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/orders/new"
            startIcon={<AddIcon />}
            sx={styles.newOrderButton}
          >
            New Order
          </Button>
        </FormBox>

        <OrdersFilter
          searchTerm={searchTerm}
          filterStatus={filterStatus}
          dateRange={dateRange}
          onSearchChange={setSearchTerm}
          onStatusChange={(value: string) => setFilterStatus(value as OrderStatus)}
          onDateRangeChange={setDateRange}
          onAdvancedFilter={() => setShowAdvancedFilters(!showAdvancedFilters)}
          showAdvancedFilters={showAdvancedFilters}
        />

        <OrdersTable
          orders={orders}
          getStatusColor={(status: string) => statusColors[status as OrderStatus] || "default"}
        />
      </Box>
    </Container>
  );
};

export default Orders;









