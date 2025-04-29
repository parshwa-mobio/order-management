import React, { useState, useEffect, useMemo } from "react";
import Papa, { ParseResult } from "papaparse";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type Product = {
  id: string;
  name: string;
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

  const navigate = useNavigate();

  // Replace session token access with your auth context
  const handleSubmit = async () => {
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse<{ name: string; quantity: string }>(file, {
        header: true,
        skipEmptyLines: true,
        complete: (
          results: ParseResult<{ name: string; quantity: string }>,
        ) => {
          const parsedData = results.data;
          const itemsToAdd: OrderItem[] = [];

          parsedData.forEach((row) => {
            const product = allProducts.find(
              (p) => p.name.toLowerCase() === row.name.toLowerCase(),
            );
            if (product) {
              const quantity = parseInt(row.quantity, 10);
              if (!isNaN(quantity)) {
                itemsToAdd.push({
                  product,
                  quantity: Math.max(quantity, product.moq),
                });
              }
            }
          });

          setOrderItems((prev) => [...prev, ...itemsToAdd]);
        },
        error: (error: Error) => {
          console.error("CSV parsing error:", error.message);
          toast.error("Failed to parse uploaded file.");
        },
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Create New Order</h2>

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

      {/* Search & Upload */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border p-2 rounded"
        />
        <input type="file" accept=".csv" onChange={handleFileUpload} />
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

export default NewOrder;
