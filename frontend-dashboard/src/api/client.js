// src/api/client.js

export const SERVICE_URLS = {
  auth: import.meta.env.VITE_AUTH_URL || "http://localhost:8081",
  product: import.meta.env.VITE_PRODUCT_URL || "http://localhost:8082",
  order: import.meta.env.VITE_ORDER_URL || "http://localhost:8083",
  alert: import.meta.env.VITE_ALERT_URL || "http://localhost:8084",
};

export async function apiRequest(baseUrl, path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request to ${path} failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
