import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface DraftOrder {
  id: string;
  items: Array<{
    productId: string;
    quantity: number;
    name: string;
    price: number;
  }>;
  createdAt: string;
  updatedAt: string;
  total: number;
}

const DraftOrders = () => {
  const [draftOrders, setDraftOrders] = useState<DraftOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDraftOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/orders/draft", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setDraftOrders(data);
        }
      } catch (error) {
        console.error("Failed to fetch draft orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDraftOrders();
  }, []);

  const handleResumeDraft = (draftId: string) => {
    navigate(`/orders/draft/${draftId}`);
  };

  const handleSubmitOrder = async (draftId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/orders/draft/${draftId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "submitted" }),
        },
      );

      if (response.ok) {
        setDraftOrders((drafts) => drafts.filter((d) => d.id !== draftId));
      }
    } catch (error) {
      console.error("Failed to submit order:", error);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Draft Orders</h1>

      {draftOrders.length === 0 ? (
        <p className="text-gray-500">No draft orders found.</p>
      ) : (
        <div className="grid gap-4">
          {draftOrders.map((draft) => (
            <div
              key={draft.id}
              className="bg-white p-4 rounded-lg shadow border border-gray-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(draft.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Last updated:{" "}
                    {new Date(draft.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-lg font-semibold">
                  Total: ${draft.total.toFixed(2)}
                </p>
              </div>

              <div className="mb-4">
                <h3 className="font-medium mb-2">Items:</h3>
                <ul className="space-y-2">
                  {draft.items.map((item, index) => (
                    <li key={index} className="flex justify-between text-sm">
                      <span>{item.name}</span>
                      <span>
                        {item.quantity} × ${item.price.toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleResumeDraft(draft.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Resume
                </button>
                <button
                  onClick={() => handleSubmitOrder(draft.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Submit Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DraftOrders;
