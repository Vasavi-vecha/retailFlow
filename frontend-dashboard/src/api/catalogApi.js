// src/api/catalogApi.js
import { apiRequest, SERVICE_URLS } from "./client";

export const catalogApi = {
  getAllProducts: async () => {
    return apiRequest(SERVICE_URLS.product, "/products/all");
  },

  getProductById: async (id) => {
    return apiRequest(SERVICE_URLS.product, `/products/${id}`);
  },

  addInventoryItem: async (productData) => {
    return apiRequest(SERVICE_URLS.product, "/products/add", {
      method: "POST",
      body: JSON.stringify(productData),
    });
  },

  deleteInventoryItem: async (id) => {
    return apiRequest(SERVICE_URLS.product, `/products/${id}`, {
      method: "DELETE",
    });
  },

  adjustStock: async (id, quantity) => {
    return apiRequest(SERVICE_URLS.product, `/products/${id}/stock?quantity=${quantity}`, {
      method: "PUT",
    });
  },

  getLowStockProducts: async () => {
    return apiRequest(SERVICE_URLS.product, "/products/low-stock");
  },
};
