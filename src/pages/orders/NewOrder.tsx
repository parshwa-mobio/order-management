import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Button,
  Typography,
  Grid,
  CircularProgress
} from "@mui/material";
import { toast } from "react-hot-toast";
import { FormBox } from "../../components/formCommon/FormBox";
import { FormButton } from "../../components/formCommon/FormButton";
import { OrderForm } from "../../components/orders/OrderForm";
import { ProductList } from "../../components/orders/ProductList";
import { OrdersSummary } from "../../components/orders/OrdersSummary";

type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  moq: number;
};

type OrderItem = {
  product: Product;
  quantity: number;
};

const NewOrder = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [containerType, setContainerType] = useState("20ft");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const data = await response.json();
          setAllProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast.error("Failed to fetch products.");
      }
    };

    fetchProducts();
  }, []);

  const availableProducts = useMemo(() => {
    return allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !orderItems.find((item) => item.product.id === p.id),
    );
  }, [allProducts, searchTerm, orderItems]);

  const addToOrder = (product: Product) => {
    setOrderItems([...orderItems, { product, quantity: product.moq }]);
  };

  const removeFromOrder = (productId: string) => {
    setOrderItems(orderItems.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setOrderItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(quantity, item.product.moq) }
          : item,
      ),
    );
  };

  const validateOrder = (items: OrderItem[]): boolean => {
    if (items.length === 0) {
      toast.error("Please add at least one item to the order");
      return false;
    }

    for (const item of items) {
      if (item.quantity < item.product.moq) {
        toast.error(`Quantity for ${item.product.name} is below minimum order quantity`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateOrder(orderItems)) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: orderItems,
          containerType,
          deliveryDate,
        }),
      });

      if (response.ok) {
        toast.success("Order submitted successfully.");
        navigate("/orders");
      } else {
        toast.error("Failed to submit order.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 600 }}>
          Create New Order
        </Typography>

        <Grid container spacing={3}>
          <OrderForm
            containerType={containerType}
            deliveryDate={deliveryDate}
            onContainerTypeChange={setContainerType}
            onDeliveryDateChange={setDeliveryDate}
          />

          <ProductList
            products={availableProducts}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onAddProduct={addToOrder}
          />

          <OrdersSummary
            orderItems={orderItems}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromOrder}
          />

          <FormBox sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, ml: 'auto', width: { xs: '100%', md: '33.33%' } }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/orders")}
            >
              Cancel
            </Button>
            <FormButton
              onClick={handleSubmit}
              disabled={loading || orderItems.length === 0}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? "Submitting..." : "Submit Order"}
            </FormButton>
          </FormBox>
        </Grid>
      </Box>
    </Container>
  );
};

export default NewOrder;

