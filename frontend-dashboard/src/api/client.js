// src/api/client.js

export const SERVICE_URLS = {
  auth: "http://localhost:8081",
  product: "http://localhost:8082",
  order: "http://localhost:8083",
  alert: "http://localhost:8084",
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
