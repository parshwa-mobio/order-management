import { useState, useEffect } from "react";
import { useToast } from "./useToast";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  companyName?: string;
  distributorCode?: string;
  mfaEnabled: boolean;
  status?: "active" | "inactive";
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const baseUrl = import.meta.env.VITE_API_BASE;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${baseUrl}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      // Extract users array from the response
      setUsers(
        data.users.map((user: any) => ({
          ...user,
          id: user._id, // Map _id to id for frontend compatibility
          status: user.status || "active", // Provide default status if not present
        })),
      );
    } catch (error) {
      showToast("Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (
    userId: string,
    status: "active" | "inactive",
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${baseUrl}/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user status");
      }

      setUsers(
        users.map((user) => (user.id === userId ? { ...user, status } : user)),
      );
      showToast("User status updated successfully", "success");
    } catch (error) {
      showToast("Failed to update user status", "error");
    }
  };

  return { users, loading, updateUserStatus };
};
