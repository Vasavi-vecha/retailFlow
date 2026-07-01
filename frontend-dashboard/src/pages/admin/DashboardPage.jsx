import { useAppContext } from "../../context/AppContext";

function DashboardPage() {
  const { state } = useAppContext();
  const { orders, inventory, alerts } = state;

  const dashboardStats = {
    totalOrders: orders.length,

    totalRevenue: orders.reduce((sum, order) => sum + (Number(order.totalPrice) || 0), 0),

    placedOrders: orders.filter((order) => order.status === "PLACED").length,
    lowStockItems: inventory.filter(
      (item) => item.stock <= item.reorderLevel
    ).length,
    openAlerts: alerts.filter((alert) => !alert.resolved).length,
  };

  const recentOrders = orders.slice(0, 3);
  const recentAlerts = alerts.slice(0, 3);

  return (
    <div className="page-wrapper">
      <div className="page-grid dashboard-page-grid">
        <section className="panel panel-wide dashboard-hero">
          <div className="dashboard-hero-content">
            <div className="dashboard-hero-text">
              <p className="section-label">Admin Dashboard</p>
              <h3>Operational Overview</h3>
              <p className="section-text">
                Live customer orders, inventory health, and smart alerts in one place.
              </p>
            </div>

            <div className="dashboard-hero-badges">
              <span className="small-badge">{dashboardStats.totalOrders} orders</span>
              <span className="small-badge">{dashboardStats.openAlerts} open alerts</span>
            </div>
          </div>

          <div className="stats-grid dashboard-summary-grid">
            <div className="stat-card">
              <span>Total Orders</span>
              <strong>{dashboardStats.totalOrders}</strong>
              <small>Orders placed by customers</small>
            </div>
            <div className="stat-card">
              <span>Total Revenue</span>
              {/* Added toLocaleString format so big figures read as professional currency rows */}
              <strong>₹ {dashboardStats.totalRevenue.toLocaleString('en-IN')}</strong>
              <small>Combined order value</small>
            </div>
            <div className="stat-card">
              <span>Placed Orders</span>
              <strong>{dashboardStats.placedOrders}</strong>
              <small>Pending fulfillment</small>
            </div>
            <div className="stat-card">
              <span>Low Stock Items</span>
              <strong>{dashboardStats.lowStockItems}</strong>
              <small>Inventory requires review</small>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="dashboard-section-head">
            <p className="section-label">Recent Orders</p>
            <h4>Latest Activity</h4>
          </div>

          <div className="dashboard-activity-list">
            {recentOrders.length === 0 ? (
              <div className="empty-box">
                <p>No recent orders yet.</p>
              </div>
            ) : (
              recentOrders.map((order) => (
                <div className="dashboard-activity-card" key={order.id}>
                  <div className="dashboard-activity-line info" />
                  <div className="dashboard-activity-content">
                    <div className="dashboard-activity-top">
                      <strong>{order.customer}</strong>
                      <span>{order.time || "Just now"}</span>
                    </div>
                    <p>
                      Ordered {order.product} ({order.quantity}) with status {order.status}.
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="panel">
          <div className="dashboard-section-head">
            <p className="section-label">Recent Alerts</p>
            <h4>System Signals</h4>
          </div>

          <div className="dashboard-activity-list">
            {recentAlerts.length === 0 ? (
              <div className="empty-box">
                <p>No alerts yet.</p>
              </div>
            ) : (
              recentAlerts.map((alert) => (
                <div className="dashboard-activity-card" key={alert.id}>
                  <div
                    className={`dashboard-activity-line ${
                      alert.severity === "Critical"
                        ? "danger"
                        : alert.severity === "High"
                        ? "warning"
                        : "success"
                    }`}
                  />
                  <div className="dashboard-activity-content">
                    <div className="dashboard-activity-top">
                      <strong>{alert.title || alert.message}</strong>
                      <span>{alert.time || alert.timestamp}</span>
                    </div>
                    <p>{alert.description || alert.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default DashboardPage;