// src/api/ordersApi.js
import { apiRequest, SERVICE_URLS } from "./client";

export const ordersApi = {
  placeOrder: async (order) => {
    return apiRequest(SERVICE_URLS.order, "/orders/place", {
      method: "POST",
      body: JSON.stringify(order),
    });
  },

  getAllOrders: async () => {
    return apiRequest(SERVICE_URLS.order, "/orders/all");
  },

  getOrdersByCustomer: async (customerName) => {
    return apiRequest(SERVICE_URLS.order, `/orders/customer/${encodeURIComponent(customerName)}`);
  },

  updateOrderStatus: async (orderId, status) => {
    return apiRequest(SERVICE_URLS.order, `/orders/${orderId}/status?status=${encodeURIComponent(status)}`, {
      method: "PUT",
    });
  },

  deleteOrder: async (orderId) => {
    return apiRequest(SERVICE_URLS.order, `/orders/${orderId}`, {
      method: "DELETE",
    });
  },
};
