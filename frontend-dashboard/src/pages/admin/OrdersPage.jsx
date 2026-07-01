import { useAppContext } from "../../context/AppContext";

function OrdersPage() {
  const { state, updateOrderStatus, deleteOrder } = useAppContext();
  const { orders } = state;

  return (
    <div className="page-wrapper">
      <section className="panel panel-wide">
        <div className="toolbar-header">
          <div>
            <p className="section-label">Orders</p>
            <h3>Manage Customer Orders</h3>
            <p className="section-text">
              Review, update, and remove customer orders from the admin portal.
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="empty-box">
            <h3>No orders yet</h3>
            <p>Customer orders will appear here after checkout.</p>
          </div>
        ) : (
          <div className="table-wrap desktop-orders">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.product}</td>
                    <td>{order.quantity}</td>
                    <td>
                      <span className={`badge ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`small-badge ${
                          order.priority === "High" ? "danger" : "neutral"
                        }`}
                      >
                        {order.priority}
                      </span>
                    </td>
                    <td>
                      <div className="inventory-actions">
                        <select
                          className="table-select"
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(order.id, e.target.value)
                          }
                        >
                          <option value="PLACED">PLACED</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                        </select>

                        <button
                          className="delete-btn"
                          onClick={() => deleteOrder(order.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {orders.length > 0 && (
          <div className="mobile-orders">
            {orders.map((order) => (
              <article className="mobile-order-card" key={order.id}>
                <div className="mobile-order-top">
                  <div>
                    <p className="mobile-order-label">Order</p>
                    <strong>#{order.id}</strong>
                  </div>
                  <span className={`badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>

                <div className="mobile-order-grid">
                  <div>
                    <p className="mobile-order-label">Customer</p>
                    <strong>{order.customer}</strong>
                  </div>
                  <div>
                    <p className="mobile-order-label">Product</p>
                    <strong>{order.product}</strong>
                  </div>
                  <div>
                    <p className="mobile-order-label">Quantity</p>
                    <strong>{order.quantity}</strong>
                  </div>
                  <div>
                    <p className="mobile-order-label">Priority</p>
                    <strong>{order.priority}</strong>
                  </div>
                </div>

                <div className="mobile-order-actions">
                  <select
                    className="table-select"
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order.id, e.target.value)
                    }
                  >
                    <option value="PLACED">PLACED</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                  </select>

                  <button
                    className="delete-btn"
                    onClick={() => deleteOrder(order.id)}
                  >
                    Delete Order
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default OrdersPage;