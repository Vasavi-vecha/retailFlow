// src/api/alertsApi.js
import { apiRequest, SERVICE_URLS } from "./client";

export const alertsApi = {
  createAlert: async (alert) => {
    return apiRequest(SERVICE_URLS.alert, "/alerts/create", {
      method: "POST",
      body: JSON.stringify(alert),
    });
  },

  getAllAlerts: async () => {
    return apiRequest(SERVICE_URLS.alert, "/alerts/all");
  },

  getOpenAlerts: async () => {
    return apiRequest(SERVICE_URLS.alert, "/alerts/open");
  },

  acknowledgeAlert: async (id) => {
    return apiRequest(SERVICE_URLS.alert, `/alerts/${id}/acknowledge`, {
      method: "PUT",
    });
  },

  resolveAlert: async (id) => {
    return apiRequest(SERVICE_URLS.alert, `/alerts/${id}/resolve`, {
      method: "PUT",
    });
  },

  deleteAlert: async (id) => {
    return apiRequest(SERVICE_URLS.alert, `/alerts/${id}`, {
      method: "DELETE",
    });
  },
};
