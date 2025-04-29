import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type Distributor = {
  id: string;
  name: string;
  email: string;
  companyName?: string;
};

type Product = {
  id: string;
  name: string;
  moq: number;
};

type OrderItem = {
  product: Product;
  quantity: number;
};

const NewDistributorOrder = () => {
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [selectedDistributor, setSelectedDistributor] = useState<string>("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [containerType, setContainerType] = useState("20ft");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch distributors
    const fetchDistributors = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/users/distributors",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        if (response.ok) {
          const data = await response.json();
          setDistributors(data);
        } else {
          toast.error("Failed to fetch distributors");
        }
      } catch (error) {
        toast.error("Failed to fetch distributors");
      }
    };

    // Fetch products
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        if (response.ok) {
          const data = await response.json();
          setAllProducts(data);
        }
      } catch (error) {
        toast.error("Failed to fetch products.");
      }
    };

    fetchDistributors();
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

  const handleSubmit = async () => {
    if (!selectedDistributor) {
      toast.warning("Please select a distributor.");
      return;
    }
    if (!deliveryDate) {
      toast.warning("Please select a delivery date.");
      return;
    }
    if (!orderItems.length) {
      toast.warning("Please add at least one product to the order.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          distributorId: selectedDistributor,
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
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">
        Place Order for Distributor
      </h2>

      {/* Distributor Selection */}
      <div className="mb-4">
        <label htmlFor="distributor" className="block mb-1 font-medium">
          Select Distributor
        </label>
        <select
          id="distributor"
          value={selectedDistributor}
          onChange={(e) => setSelectedDistributor(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">-- Select --</option>
          {distributors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.companyName || d.name} ({d.email})
            </option>
          ))}
        </select>
      </div>

      {/* Delivery Date */}
      <div className="mb-4">
        <label htmlFor="deliveryDate" className="block mb-1 font-medium">
          Delivery Date
        </label>
        <input
          id="deliveryDate"
          type="date"
          value={deliveryDate}
          onChange={(e) => setDeliveryDate(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* Container Type */}
      <div className="mb-4">
        <label htmlFor="containerType" className="block mb-1 font-medium">
          Container Type
        </label>
        <select
          id="containerType"
          value={containerType}
          onChange={(e) => setContainerType(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="20ft">20 ft</option>
          <option value="40ft">40 ft</option>
        </select>
      </div>

      {/* Search Products */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border p-2 rounded"
        />
      </div>

      {/* Product List */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Available Products</h3>
        {availableProducts.length ? (
          <ul className="grid grid-cols-2 gap-2">
            {availableProducts.map((product) => (
              <li
                key={product.id}
                className="p-3 border rounded cursor-pointer hover:bg-gray-100"
                onClick={() => addToOrder(product)}
              >
                {product.name} (MOQ: {product.moq})
              </li>
            ))}
          </ul>
        ) : (
          <p>No products match your search.</p>
        )}
      </div>

      {/* Order Items */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Order Items</h3>
        {orderItems.length ? (
          <ul className="space-y-2">
            {orderItems.map((item) => (
              <li
                key={item.product.id}
                className="flex justify-between items-center border p-2 rounded"
              >
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <input
                    type="number"
                    value={item.quantity}
                    min={item.product.moq}
                    onChange={(e) =>
                      updateQuantity(
                        item.product.id,
                        parseInt(e.target.value, 10),
                      )
                    }
                    className="border p-1 rounded mt-1 w-24"
                  />
                </div>
                <button
                  onClick={() => removeFromOrder(item.product.id)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No products added to order.</p>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Order"}
        </button>
      </div>
    </div>
  );
};

export default NewDistributorOrder;
