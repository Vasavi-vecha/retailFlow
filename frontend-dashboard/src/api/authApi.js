// src/api/authApi.js
import { apiRequest, SERVICE_URLS } from "./client";

export const authApi = {
  login: async (email, password) => {
    const data = await apiRequest(SERVICE_URLS.auth, "/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (!data.success) {
      throw new Error(data.message || "Login failed");
    }
    return data;
  },

  signup: async (name, email, password) => {
    const data = await apiRequest(SERVICE_URLS.auth, "/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    if (!data.success) {
      throw new Error(data.message || "Signup failed");
    }
    return data;
  },
};
