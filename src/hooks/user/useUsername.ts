import { useState, useEffect } from "react";

interface User {
  _id: string;
  name: string;
}

export const useUsername = (userId: string | undefined) => {
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsername = async () => {
      if (!userId) {
        setUsername("");
        return;
      }

      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const baseUrl = import.meta.env.VITE_API_BASE;
        const response = await fetch(`${baseUrl}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }

        const data: User = await response.json();
        setUsername(data.name);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch username");
        setUsername("");
      } finally {
        setLoading(false);
      }
    };

    fetchUsername();
  }, [userId]);

  return { username, loading, error };
};