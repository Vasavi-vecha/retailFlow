import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logoImg from "../assets/logo.png"; // Imported brand logo asset

function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        {/* Left Side Brand Box Header featuring logo icon */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingBottom: "10px", borderBottom: "1px solid #e0e0e0" }}>
          <img src={logoImg} alt="RetailFlow Logo" style={{ height: "32px", width: "auto" }} />
          <h2 className="logo" style={{ margin: 0, fontSize: "22px" }}>RetailFlow</h2>
        </div>

        <nav className="nav-links">
          <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Orders
          </NavLink>
          <NavLink to="/admin/inventory" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Inventory
          </NavLink>
          <NavLink to="/admin/alerts" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Alerts
          </NavLink>
          <NavLink to="/admin/metrics" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Metrics
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <p className="sidebar-user">{user?.name}</p>
          <button className="ghost-btn" onClick={logout}>Logout</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="topbar-label">Walmart-style internal frontend</p>
            <h1>Operations Control Center</h1>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;