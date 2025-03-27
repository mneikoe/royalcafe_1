/*import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const { data } = await api.get("/auth/me");
        const userData = { ...data.user, role: data.user.role.toLowerCase() };
        setUser(userData);
      } catch (err) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      const userData = { ...data.user, role: data.user.role.toLowerCase() };
      setUser(userData);

      if (userData.role === "admin") {
        navigate("/admin/dashboard");
      } else if (userData.role === "student") {
        navigate("/student/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAdmin: user?.role === "admin",
        isStudent: user?.role === "student",
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
*/
/*import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize API headers with saved token on app load
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      // Set token in API headers
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        // Fetch the current user data
        const { data } = await api.get("/auth/me");
        const userData = { ...data.user, role: data.user.role.toLowerCase() };

        // Set the user state
        setUser(userData);

        // Also store user data in localStorage for persistence
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (err) {
        console.error("Auth check failed:", err);
        // Only clear token and user if there's a 401 error
        if (err.response && err.response.status === 401) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Add a fallback mechanism to use stored user data if API request fails
  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse stored user data:", e);
        }
      }
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });

      // Store the token
      localStorage.setItem("token", data.token);
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      // Process and store the user data
      const userData = { ...data.user, role: data.user.role.toLowerCase() };
      setUser(userData);

      // Store user data for persistence
      localStorage.setItem("user", JSON.stringify(userData));

      return userData;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    navigate("/login");
  };

  // Provide a function to update user
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateUser,
        isAdmin: user?.role === "admin",
        isStudent: user?.role === "student",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);*/
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize API headers with saved token on app load
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      // Set token in API headers
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        // Fetch the current user data
        const { data } = await api.get("/auth/me");

        // Safely access nested properties and provide defaults
        // This handles cases where the API response structure might vary
        const userData = {
          ...(data.user || data), // Handle both {user: {...}} and direct user data
          role: (data.user?.role || data.role || "").toLowerCase(), // Safe access with default
        };

        // Set the user state
        setUser(userData);

        // Also store user data in localStorage for persistence
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (err) {
        console.error("Auth check failed:", err);
        // Attempt to use stored user data if API request fails
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            console.error("Failed to parse stored user data:", e);
            // If both API and localStorage fail, then logout
            logout();
          }
        } else {
          // Only clear token and user if there's a 401 error or no stored user
          if (err.response && err.response.status === 401) {
            logout();
          }
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (phone, password) => {
    try {
      const { data } = await api.post("/auth/login", { phone, password });

      // Store the token
      localStorage.setItem("token", data.token);
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      // Process and store the user data, handling different response structures
      const userData = {
        ...(data.user || data), // Handle both {user: {...}} and direct user data
        role: (data.user?.role || data.role || "").toLowerCase(), // Safe access with default
      };

      setUser(userData);

      // Store user data for persistence
      localStorage.setItem("user", JSON.stringify(userData));

      return userData;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    navigate("/login");
  };

  // Provide a function to update user
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateUser,
        isAdmin: user?.role === "admin",
        isStudent: user?.role === "student",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
