import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import CustomerLayout from "./components/CustomerLayout"; // Imported your new header bar layout

import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";

import DashboardPage from "./pages/admin/DashboardPage";
import OrdersPage from "./pages/admin/OrdersPage";
import InventoryPage from "./pages/admin/InventoryPage";
import AlertsPage from "./pages/admin/AlertsPage";
import MetricsPage from "./pages/admin/MetricsPage";

import ProductCatalogPage from "./pages/customer/ProductCatalogPage";
import ProductDetailsPage from "./pages/customer/ProductDetailsPage";
import CartPage from "./pages/customer/CartPage";
import CheckoutPage from "./pages/customer/CheckoutPage";
import OrderHistoryPage from "./pages/customer/OrderHistoryPage";
import IndexPage from "./pages/public/IndexPage";

function App() {
  return (
    <Routes>
      {/* Public Authentication Channels */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Admin Panel Console Layout Group */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="alerts" element={<AlertsPage />} />
        <Route path="metrics" element={<MetricsPage />} />
      </Route>

      {/* Customer E-Commerce Shopping Core Layout Group */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "CUSTOMER"]}>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        {/* All customer path view nodes load inside CustomerLayout's <Outlet /> slot */}
        <Route path="/products" element={<ProductCatalogPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders/history" element={<OrderHistoryPage />} />
      </Route>

      {/* Global Fallback Route Redirects */}
      <Route path="/" element={<IndexPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;