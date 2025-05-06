import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api";

interface MfaVerifyResponse {
  token: string;
  role: string;
}
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "distributor" | "dealer" | "sales" | "exportTeam";
  companyName?: string;
  distributorCode?: string;
  mfaEnabled: boolean;
  permissions: string[];
  parentDistributor?: string;
  assignedCategories: string[];
  stockLevels: {
    productId: string;
    allocated: number;
    available: number;
  }[];
  assignedDistributors?: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  register: (data: {
    email: string;
    password: string;
    role: string;
  }) => Promise<void>;
  login: (
    email: string,
    password: string,
  ) => Promise<{ requiresMFA: boolean; role?: string }>;
  verifyMFA: (
    code: string,
    email?: string,
    password?: string,
  ) => Promise<{ user?: User; role?: string }>;
  logout: () => void;
  enableMFA: () => Promise<{ secret: string; qrCode: string }>;
  disableMFA: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

// Create the context with undefined as initial value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Export the context provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored auth token and user data
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token"); // Add this line
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);
  const baseUrl = import.meta.env.VITE_API_BASE;
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 429) {
        throw new Error(
          "Too many login attempts. Please wait a few minutes and try again.",
        );
      }

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();

      // If MFA is enabled, return without setting user
      if (data.requiresMFA) {
        return { requiresMFA: true };
      }

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      return { requiresMFA: false, role: data.user.role };
    } catch (error) {
      console.error("Error during login:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Login failed. Please check your credentials and try again.",
      );
    }
  };

  const verifyMFA = async (code: string, email?: string, password?: string) => {
    setLoading(true);
    setError(null);
    try {
      let response;

      if (email && password) {
        // MFA verification with credentials
        response = await api.post<MfaVerifyResponse>("/auth/mfa/verify", {
          email,
          password,
          otp: code,
        });

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        return { role: response.data.role };
      } else {
        // MFA verification with just code
        response = await fetch(`${baseUrl}/auth/verify-mfa`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          throw new Error("MFA verification failed");
        }

        const data = await response.json();
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        return { user: data.user };
      }
    } catch (err: any) {
      const message = err.response?.data?.message || "MFA verification failed";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Remove the duplicate verifyMfa function

  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  const enableMFA = async () => {
    try {
      const response = await fetch(`${baseUrl}/auth/enable-mfa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to enable MFA");
      }

      const data = await response.json();
      return {
        secret: data.secret,
        qrCode: data.qrCode,
      };
    } catch (error) {
      console.error("Failed to enable MFA", error);
      throw new Error("Failed to enable MFA");
    }
  };

  const disableMFA = async () => {
    try {
      const response = await fetch(`${baseUrl}/auth/disable-mfa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to disable MFA");
      }

      if (user) {
        const updatedUser = { ...user, mfaEnabled: false };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Failed to disable MFA", error);
      throw new Error("Failed to disable MFA");
    }
  };

  const hasPermission = (permission: string) => {
    if (!user) return false;

    const rolePermissions = {
      admin: [
        "order.create",
        "order.view.all",
        "order.manage.all",
        "stock.view.all",
        "stock.manage.all",
        "user.manage",
        "reports.access",
        "system.configure",
      ],
      distributor: [
        "order.create",
        "order.view.own",
        "order.manage.own",
        "stock.view.assigned",
      ],
      dealer: ["order.create", "order.view.own", "stock.view.allocated"],
      sales: [
        "order.view.all",
        "order.manage.assigned",
        "reports.access",
        "stock.alerts",
      ],
      exportTeam: [
        "order.view.all",
        "order.manage.international",
        "logistics.coordinate",
      ],
    };

    return rolePermissions[user.role]?.includes(permission) || false;
  };

  const register = async (data: {
    email: string;
    password: string;
    role: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const responseData = await response.json();
      setUser(responseData.user);
      localStorage.setItem("user", JSON.stringify(responseData.user));
      localStorage.setItem("token", responseData.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const contextValue = React.useMemo(
    () => ({
      user,
      token,
      loading,
      error,
      login,
      logout,
      register,
      verifyMFA,
      enableMFA,
      disableMFA,
      hasPermission,
    }),
    [user, token, loading, error],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Export the useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Export the context as default
export default AuthContext;
