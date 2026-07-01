/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";
import { authApi } from "../api/authApi";
import { alertsApi } from "../api/alertsApi";

// Create a local context pool instance
const AuthContext = createContext(null);

// Hook implementation to consume context parameters safely
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
}

// Main Component Provider
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("retailflow_current_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  function persistUser(nextUser) {
    setUser(nextUser);
    if (nextUser) {
      localStorage.setItem("retailflow_current_user", JSON.stringify(nextUser));
    } else {
      localStorage.removeItem("retailflow_current_user");
    }
  }

  async function login(email, password) {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    try {
      const loggedInUser = await authApi.login(email, password);
      persistUser(loggedInUser);
      return loggedInUser;
    } catch (err) {
      alertsApi
        .createAlert({
          title: "Failed login attempt",
          description: `Failed login attempt on email entry channel: ${email}`,
          severity: "High",
          category: "Security",
          source: "Authentication Router",
        })
        .catch(() => {});
      throw err;
    }
  }

  async function signup(name, email, password) {
    if (!name || !email || !password) {
      throw new Error("All fields are required");
    }

    return authApi.signup(name.trim(), email.toLowerCase().trim(), password);
  }

  function logout() {
    persistUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      login,
      signup,
      logout,
      isAuthenticated: !!user,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
