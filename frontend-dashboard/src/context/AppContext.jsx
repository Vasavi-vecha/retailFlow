/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useCallback, useEffect, useMemo, useState } from "react";
import { catalogApi } from "../api/catalogApi";
import { ordersApi } from "../api/ordersApi";
import { alertsApi } from "../api/alertsApi";

// Create a local context pool instance
const AppContext = createContext(null);

// Hook implementation to consume application values safely
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used inside an AppProvider");
  }
  return context;
}

export function AppProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const refreshInventory = useCallback(async () => {
    setInventory(await catalogApi.getAllProducts());
  }, []);

  const refreshOrders = useCallback(async () => {
    setOrders(await ordersApi.getAllOrders());
  }, []);

  const refreshAlerts = useCallback(async () => {
    setAlerts(await alertsApi.getAllAlerts());
  }, []);

  useEffect(() => {
    refreshInventory().catch(() => {});
    refreshOrders().catch(() => {});
    refreshAlerts().catch(() => {});
  }, [refreshInventory, refreshOrders, refreshAlerts]);

  // Alerts page auto-refreshes to reflect low-stock signals raised by other admins/customers
  useEffect(() => {
    const interval = setInterval(() => {
      refreshAlerts().catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, [refreshAlerts]);

  async function adjustStock(id, amount) {
    await catalogApi.adjustStock(id, amount);
    await refreshInventory();
  }

  async function deleteInventoryItem(id) {
    await catalogApi.deleteInventoryItem(id);
    await refreshInventory();
  }

  async function addInventoryItem(productData) {
    await catalogApi.addInventoryItem(productData);
    await refreshInventory();
  }

  async function updateOrderStatus(orderId, status) {
    await ordersApi.updateOrderStatus(orderId, status);
    await refreshOrders();
  }

  async function deleteOrder(orderId) {
    await ordersApi.deleteOrder(orderId);
    await refreshOrders();
  }

  async function acknowledgeAlert(id) {
    await alertsApi.acknowledgeAlert(id);
    await refreshAlerts();
  }

  async function resolveAlert(id) {
    await alertsApi.resolveAlert(id);
    await refreshAlerts();
  }

  async function placeCustomerOrder(customerName, items, deliveryInfo) {
    const openAlerts = await alertsApi.getOpenAlerts();
    let knownLowStockNames = openAlerts
      .filter((a) => a.category === "Inventory" && a.title === "Low inventory alert")
      .map((a) => a.description);

    for (const item of items) {
      await ordersApi.placeOrder({
        customer: customerName,
        product: item.name,
        quantity: item.quantity,
        totalPrice: item.price * item.quantity,
        address: deliveryInfo.address,
        city: deliveryInfo.city,
        pincode: deliveryInfo.pincode,
        paymentMethod: deliveryInfo.paymentMethod,
      });

      const updatedProduct = await catalogApi.adjustStock(item.id, -item.quantity);

      const description = `${updatedProduct.name} stock dropped below the reorder threshold.`;
      const alreadyAlerted = knownLowStockNames.some((desc) => desc === description);

      if (updatedProduct.stock <= updatedProduct.reorderLevel && !alreadyAlerted) {
        await alertsApi.createAlert({
          title: "Low inventory alert",
          description,
          severity: updatedProduct.stock === 0 ? "Critical" : "High",
          category: "Inventory",
          source: "Inventory Service",
        });
        knownLowStockNames = [...knownLowStockNames, description];
      }
    }

    await Promise.all([refreshOrders(), refreshInventory(), refreshAlerts()]);
  }

  const value = useMemo(
    () => ({
      state: { orders, inventory, alerts },
      adjustStock,
      deleteInventoryItem,
      addInventoryItem,
      updateOrderStatus,
      deleteOrder,
      acknowledgeAlert,
      resolveAlert,
      placeCustomerOrder,
      refreshInventory,
      refreshOrders,
      refreshAlerts,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [orders, inventory, alerts]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
