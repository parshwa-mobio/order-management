import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Notification {
  id: string;
  message: string;
  type: "low_stock" | "promotion" | "delay";
  createdAt: string;
  read: boolean;
}

const Alerts = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [isAdmin, setIsAdmin] = useState(false);
  const [newAlert, setNewAlert] = useState({
    message: "",
    type: "low_stock" as "low_stock" | "promotion" | "delay",
  });

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/api/notifications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        }
      } catch (error) {
        toast.error("Failed to fetch notifications");
      } finally {
        setLoading(false);
      }
    };

    // Check if user is admin
    const userRole = localStorage.getItem("userRole");
    setIsAdmin(userRole === "admin");

    fetchNotifications();
  }, []);

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAlert),
      });

      if (response.ok) {
        const createdAlert = await response.json();
        setNotifications((prev) => [createdAlert, ...prev]);
        setNewAlert({ message: "", type: "low_stock" });
        toast.success("Alert created successfully");
      }
    } catch (error) {
      toast.error("Failed to create alert");
    }
  };

  const filteredNotifications = notifications.filter(
    (notification) => filter === "all" || notification.type === filter,
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case "low_stock":
        return "bg-red-100 text-red-800";
      case "promotion":
        return "bg-green-100 text-green-800";
      case "delay":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Alerts & Notifications</h1>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded px-3 py-1"
          >
            <option value="all">All</option>
            <option value="low_stock">Low Stock</option>
            <option value="promotion">Promotions</option>
            <option value="delay">Delays</option>
          </select>
        </div>
      </div>

      {/* Admin Alert Creation Form */}
      {isAdmin && (
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Create New Alert</h2>
          <form onSubmit={handleCreateAlert} className="space-y-4">
            <div>
              <label className="block mb-1">Message</label>
              <input
                type="text"
                value={newAlert.message}
                onChange={(e) =>
                  setNewAlert({ ...newAlert, message: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Type</label>
              <select
                value={newAlert.type}
                onChange={(e) =>
                  setNewAlert({ ...newAlert, type: e.target.value as any })
                }
                className="border rounded px-3 py-2"
              >
                <option value="low_stock">Low Stock</option>
                <option value="promotion">Promotion</option>
                <option value="delay">Delay</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Create Alert
            </button>
          </form>
        </div>
      )}

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <p className="text-gray-500">No notifications found.</p>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border ${
                notification.read ? "bg-gray-50" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="mb-1">{notification.message}</p>
                  <div className="flex gap-2 items-center">
                    <span
                      className={`text-xs px-2 py-1 rounded ${getTypeColor(
                        notification.type,
                      )}`}
                    >
                      {notification.type.replace("_", " ")}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Alerts;
