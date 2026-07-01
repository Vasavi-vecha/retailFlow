// src/pages/customer/ProductCatalogPage.jsx
import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { useCart } from "../../context/CartContext";

function ProductCatalogPage() {
  const { state } = useAppContext();
  const { inventory } = state;
  const { addToCart } = useCart(); 

  return (
    <div className="page-wrapper">
      <section className="panel panel-wide">
        <p className="section-label">Customer Store</p>
        <h3>Browse Products</h3>
        <p className="section-text">
          Explore products and open the details page.
        </p>

        {inventory.length === 0 ? (
          <div className="empty-box">
            <p>No products available right now. Check back soon!</p>
          </div>
        ) : (
        <div className="inventory-list-grid">
          {inventory.map((product) => {
            const isLowStock = product.stock <= product.reorderLevel;

            return (
              <article 
                className="inventory-detail-card" 
                key={product.id} 
                style={{ 
                  display: "flex !important", 
                  flexDirection: "column !important", 
                  height: "auto !important", 
                  minHeight: "580px",
                  justifyContent: "space-between !important", 
                  padding: "20px !important",
                  overflow: "visible !important"
                }}
              >
                <div>
                  {/* Product Image Wrapper */}
                  {product.image && (
                    <div style={{ width: "100%", height: "180px", display: "flex", justifyContent: "center", alignItems: "center", background: "#ffffff", padding: "10px", borderRadius: "6px", marginBottom: "16px", border: "1px solid #f1f5f9" }}>
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                      />
                    </div>
                  )}

                  {/* Top Category and Status Row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <p className="section-label" style={{ textTransform: "uppercase", color: "#2563eb", fontWeight: "bold", margin: 0 }}>
                      {product.category}
                    </p>
                    <span className={`small-badge ${isLowStock ? "danger" : ""}`} style={{ margin: 0 }}>
                      {isLowStock ? "Low Stock" : "Available"}
                    </span>
                  </div>

                  {/* FIXED PRODUCT NAME WRAPPER: Overriding CSS classes completely */}
                  <div style={{ width: "100% !important", height: "auto !important", minHeight: "75px", overflow: "visible !important", display: "block !important", marginBottom: "12px" }}>
                    <h4 style={{ 
                      fontSize: "16px !important", 
                      lineHeight: "24px !important", 
                      fontWeight: "600", 
                      color: "#0f172a", 
                      margin: "0 !important",
                      padding: "0 !important",
                      whiteSpace: "normal !important",
                      wordBreak: "break-word !important",
                      display: "block !important",
                      height: "auto !important",
                      maxHeight: "none !important",
                      overflow: "visible !important",
                      WebkitLineClamp: "unset !important",
                      WebkitBoxOrient: "unset !important"
                    }}>
                      {product.name}
                    </h4>
                  </div>

                  {/* Meta Pricing Grid */}
                  <div className="inventory-meta-grid" style={{ margin: "16px 0", borderTop: "1px solid #f1f5f9", paddingTop: "12px" }}>
                    <div>
                      <p className="mobile-order-label">Price</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <strong style={{ fontSize: "18px", color: "#0f172a" }}>
                          ₹ {product.price || 0}
                        </strong>
                        {product.mrp && (
                          <span style={{ fontSize: "11px", color: "#64748b", textDecoration: "line-through" }}>
                            M.R.P: ₹{product.mrp}
                          </span>
                        )}
                        {product.discount && (
                          <span style={{ fontSize: "11px", color: "#b91c1c", fontWeight: "bold" }}>
                            ({product.discount})
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="mobile-order-label">Stock</p>
                      <strong style={{ fontSize: "14px" }}>{product.stock} left</strong>
                    </div>
                  </div>

                  <p className="section-text" style={{ fontSize: "13px", color: "#475569", lineHeight: "18px", margin: "12px 0" }}>
                    {product.description}
                  </p>
                </div>

                {/* Bottom Interactive Controls */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "auto" }}>
                  <button 
                    onClick={() => {
                      addToCart(product);
                      alert(`Added "${product.name.substring(0, 20)}..." to your cart!`);
                    }}
                    style={{ 
                      width: "100%", 
                      padding: "10px", 
                      background: "#ffd814", 
                      border: "1px solid #fcd200", 
                      borderRadius: "20px", 
                      fontSize: "13px", 
                      fontWeight: "500", 
                      cursor: "pointer",
                      color: "#0f172a"
                    }}
                  >
                    Add to Cart
                  </button>

                  <div className="action-row" style={{ display: "flex", gap: "10px", width: "100%", margin: 0 }}>
                    <Link to={`/products/${product.id}`} className="primary-btn" style={{ flex: 1, textAlign: "center", display: "inline-block", borderRadius: "20px", lineHeight: "24px", padding: "6px 0" }}>
                      View Details
                    </Link>
                    <Link to="/cart" className="secondary-btn" style={{ flex: 1, textAlign: "center", display: "inline-block", borderRadius: "20px", lineHeight: "24px", padding: "6px 0" }}>
                      Open Cart
                    </Link>
                  </div>
                </div>

              </article>
            );
          })}
        </div>
        )}
      </section>
    </div>
  );
}

export default ProductCatalogPage;