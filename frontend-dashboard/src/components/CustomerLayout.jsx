// src/components/CustomerLayout.jsx
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import logoImg from "../assets/logo.png"; // Imported brand logo asset

function CustomerLayout() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();

  return (
    <div className="customer-shell">
      {/* Walmart / Flipkart Style Sticky Header Bar */}
      <header className="topbar" style={{ borderRadius: "0", margin: "0 0 24px 0", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          {/* Integrated Dynamic Graphic Logo Wrapper */}
          <Link to="/products" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img src={logoImg} alt="RetailFlow Logo" style={{ height: "32px", width: "auto" }} />
            <span style={{ fontSize: "22px", fontWeight: "bold", color: "#212121" }}>
              RetailFlow
            </span>
          </Link>
          <span style={{ color: "#878787", fontSize: "14px" }}>Hello, {user?.name}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <NavLink to="/products" className={({ isActive }) => isActive ? "small-badge" : "ghost-btn small-btn"}>
            Browse
          </NavLink>
          <NavLink to="/orders/history" className={({ isActive }) => isActive ? "small-badge" : "ghost-btn small-btn"}>
              My Orders
          </NavLink>
          <Link to="/cart" className="primary-btn small-btn" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              Cart <span className="status-pill" style={{ padding: "2px 6px", background: "#ffffff", color: "#212121" }}>{totalItems}</span>
          </Link>
          <button className="delete-btn" style={{ padding: "8px 12px" }} onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {/* This is where the actual page content loads */}
      <main className="main-content" style={{ padding: "0 24px 24px 24px" }}>
        <Outlet />
      </main>
    </div>
  );
}

export default CustomerLayout;