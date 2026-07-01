// src/api/monitoringApi.js

export const monitoringApi = {
  getSystemMetrics: async () => {
    return [
      { id: 1, service: "Orders API Subsystem", environment: "Simulation", requestsPerMin: 210, latency: 45, uptime: 100, errorRate: 0.0 },
      { id: 2, service: "Inventory Control Engine", environment: "Simulation", requestsPerMin: 148, latency: 30, uptime: 100, errorRate: 0.0 },
      { id: 3, service: "Auth Security Gateway", environment: "Simulation", requestsPerMin: 98, latency: 15, uptime: 100, errorRate: 0.0 },
      { id: 4, service: "Shipping Telemetry Tracker", environment: "Simulation", requestsPerMin: 72, latency: 60, uptime: 100, errorRate: 0.0 }
    ];
  }
};