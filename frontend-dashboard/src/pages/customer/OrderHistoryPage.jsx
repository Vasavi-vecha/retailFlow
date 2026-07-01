// src/pages/customer/OrderHistoryPage.jsx
import { useAppContext } from "../../context/AppContext"; 
import { useAuth } from "../../context/AuthContext"; 

export default function OrderHistoryPage() {
  const { state } = useAppContext(); 
  const { user } = useAuth(); 
  const { orders, inventory } = state; 

  // Filter the central orders system to show items matching this logged-in customer's name
  const myOrders = orders.filter((order) => order.customer === user?.name);

  return (
    <div className="page-wrapper" style={{ background: "#f8fafc", padding: "24px", minHeight: "100vh" }}>
      <div className="panel panel-wide" style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "left" }}>
        <p className="section-label" style={{ textAlign: "left" }}>Orders</p>
        <h3 style={{ textAlign: "left", margin: "4px 0 12px 0" }}>Order History</h3>
        <p className="section-text" style={{ textAlign: "left", marginBottom: "24px" }}>
          Track previously placed orders and live fulfillment updates.
        </p>

        {myOrders.length === 0 ? (
          <div className="empty-box" style={{ textAlign: "center", padding: "40px" }}>
            <p>No orders found yet.</p>
          </div>
        ) : (
          /* Main container stretching down the page */
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
            {myOrders.map((order) => {
              // Cross-reference current item details from inventory to show accurate pictures
              const productInfo = inventory?.find((item) => item.name === order.product);
              const calculatedCost = Number(order.totalPrice) || 0;

              return (
                /* 
                  NOTE: 'className="info-card"' is removed here to prevent global CSS sheets 
                  from forcing everything to center or look zigzagged.
                */
                <div 
                  key={order.id} 
                  style={{ 
                    display: "flex !important", 
                    flexDirection: "row !important", 
                    alignItems: "center !important",
                    justifyContent: "space-between !important",
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                    width: "100%",
                    boxSizing: "border-box",
                    textAlign: "left !important"
                  }}
                >
                  {/* LEFT ITEM: Fixed-width Product Picture Thumbnail */}
                  <div style={{ 
                    width: "80px", 
                    height: "80px", 
                    background: "#ffffff", 
                    border: "1px solid #f1f5f9", 
                    borderRadius: "6px", 
                    padding: "4px", 
                    display: "flex !important", 
                    justifyContent: "center !important", 
                    alignItems: "center !important", 
                    flexShrink: 0,
                    marginRight: "20px"
                  }}>
                    {productInfo?.image ? (
                      <img 
                        src={productInfo.image} 
                        alt={order.product} 
                        style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }} 
                      />
                    ) : (
                      <span style={{ fontSize: "24px" }}>🛍️</span>
                    )}
                  </div>

                  {/* MIDDLE ITEM: Text descriptions expanding straight left-to-right */}
                  <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: "6px", textAlign: "left !important" }}>
                    <strong style={{ color: "#2563eb", fontSize: "13px", fontFamily: "monospace", display: "block", textAlign: "left" }}>
                      Order ID: #{order.id}
                    </strong>
                    
                    <h4 style={{ margin: 0, fontSize: "16px", color: "#0f172a", fontWeight: "600", lineHeight: "22px", textAlign: "left" }}>
                      {order.product}
                    </h4>
                    
                    <div style={{ display: "flex", gap: "24px", alignItems: "center", marginTop: "2px", justifyContent: "flex-start" }}>
                      <p style={{ margin: "0", color: "#475569", fontSize: "13px", textAlign: "left" }}>
                        Quantity: <strong style={{ color: "#0f172a" }}>{order.quantity} units</strong>
                      </p>
                      <p style={{ margin: "0", color: "#475569", fontSize: "13px", textAlign: "left" }}>
                        Total Cost: <strong style={{ color: "#0f172a", fontWeight: "700" }}>₹ {calculatedCost.toLocaleString("en-IN")}</strong>
                      </p>
                    </div>

                    <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "left" }}>
                      CUSTOMER PROFILE: {order.customer}
                    </p>
                  </div>

                  {/* RIGHT ITEM: Clean, vertically grouped status badges */}
                  <div style={{ 
                    display: "flex !important", 
                    flexDirection: "column !important", 
                    alignItems: "flex-end !important", 
                    gap: "8px",
                    flexShrink: 0,
                    marginLeft: "20px",
                    minWidth: "120px"
                  }}>
                    <span 
                      className={`badge ${order.status.toLowerCase()}`} 
                      style={{ 
                        display: "inline-block", 
                        padding: "6px 14px", 
                        borderRadius: "12px", 
                        fontSize: "12px", 
                        fontWeight: "bold", 
                        textAlign: "center" 
                      }}
                    >
                      {order.status}
                    </span>
                    
                    <span className="small-badge neutral" style={{ margin: 0, fontSize: "11px", fontWeight: "500", display: "inline-block" }}>
                      Priority: {order.priority}
                    </span>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}