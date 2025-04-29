import { useState, useEffect } from "react";
import axios from "axios";

interface Settings {
  notifications: boolean;
  emailUpdates: boolean;
  language: string;
  theme?: string;
  timezone?: string;
  currency?: string;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response: ApiResponse<Settings> = await axios.get("/api/settings");
      setSettings(response.data);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        apiError.message ||
        "Failed to fetch settings";
      setError(errorMessage);
      console.error("Error fetching settings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      setIsLoading(true);
      setError(null);
      const response: ApiResponse<Settings> = await axios.put(
        "/api/settings",
        newSettings
      );
      setSettings(response.data);
      return response.data;
    } catch (err: unknown) {
      const apiError = err as ApiError;
      const errorMessage =
        apiError.response?.data?.message ||
        apiError.message ||
        "Failed to update settings";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resetError = () => setError(null);

  return {
    settings,
    updateSettings,
    isLoading,
    error,
    resetError,
  };
};
