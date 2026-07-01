// src/pages/customer/CartPage.jsx
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext"; // Connected directly to your CartContext hook

export default function CartPage() {
  const navigate = useNavigate();
  
  // Destructure everything from our centralized state manager hook
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    totalAmount 
  } = useCart();

  return (
    <div className="page-wrapper">
      <div className="panel panel-wide">
        <p className="section-label">Customer Cart</p>
        <h3>Your Shopping Cart</h3>
        <p className="section-text">
          Review selected products, update quantities, and continue to checkout.
        </p>

        {cartItems.length === 0 ? (
          <div className="empty-box">
            <p>Your cart is empty.</p>
            <div className="action-row centered-row">
              <Link to="/products" className="secondary-btn">
                Browse Products
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="cart-list" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {cartItems.map((item) => (
                <div className="cart-card" key={item.id} style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                  
                  {/* Amazon-Style Boxed Image Canvas */}
                  {item.image && (
                    <div style={{ width: "100px", height: "100px", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "6px", display: "flex", justifyContent: "center", alignItems: "center", flexShrink: 0 }}>
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }} 
                      />
                    </div>
                  )}

                  <div className="cart-card-main" style={{ flexGrow: 1 }}>
                    <p className="section-label" style={{ textTransform: "uppercase", color: "#2563eb", fontWeight: "bold" }}>{item.category}</p>
                    <h4 style={{ margin: "4px 0" }}>{item.name}</h4>
                    <p className="section-text" style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 8px 0" }}>{item.description}</p>
                    
                    {/* Price Breakdown Container featuring M.R.P cross-outs */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <span className="small-badge neutral">
                        ₹ {item.price} each
                      </span>
                      {item.mrp && (
                        <span style={{ fontSize: "12px", color: "#64748b", textDecoration: "line-through" }}>
                          M.R.P: ₹{item.mrp}
                        </span>
                      )}
                      {item.discount && (
                        <span style={{ fontSize: "12px", color: "#b91c1c", fontWeight: "bold" }}>
                          ({item.discount})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="cart-card-side" style={{ flexShrink: 0, textAlign: "right" }}>
                    <strong style={{ fontSize: "18px", color: "#0f172a", display: "block", marginBottom: "8px" }}>
                      ₹ {item.price * item.quantity}
                    </strong>

                    <div className="qty-row" style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "flex-end", marginBottom: "12px" }}>
                      <button
                        className="ghost-btn small-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span style={{ fontWeight: "600", minWidth: "20px", textAlign: "center" }}>{item.quantity}</span>
                      <button
                        className="ghost-btn small-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="delete-btn"
                      onClick={() => removeFromCart(item.id)}
                      style={{ padding: "4px 12px", fontSize: "12px" }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary" style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid #e2e8f0" }}>
              <div className="info-card" style={{ marginBottom: "16px" }}>
                <strong>Total Amount</strong>
                <p style={{ fontSize: "24px", fontWeight: "bold", color: "#0f172a", margin: "4px 0 0 0" }}>
                  ₹ {totalAmount.toLocaleString("en-IN")}
                </p>
                <span style={{ fontSize: "12px", color: "#059669", display: "block", marginTop: "4px", fontWeight: "500" }}>
                  ✓ Your basket qualifies for FREE Delivery.
                </span>
              </div>

              <div className="action-row" style={{ display: "flex", gap: "12px" }}>
                <button
                  className="primary-btn"
                  onClick={() => navigate("/checkout")}
                  style={{ borderRadius: "20px", padding: "10px 24px" }}
                >
                  Proceed to Checkout
                </button>

                <Link to="/products" className="secondary-btn" style={{ borderRadius: "20px", padding: "10px 24px", display: "inline-block", textAlign: "center", textDecoration: "none" }}>
                  Continue Shopping
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}