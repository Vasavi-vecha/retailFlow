import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { useCart } from "../../context/CartContext"; // 1. Imported our custom hook

function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useAppContext();
  const { addToCart } = useCart(); // 2. Extracted our global function
  const { inventory } = state;

  const product = inventory.find((item) => String(item.id) === String(id));

  if (!product) {
    return (
      <div className="page-wrapper">
        <section className="panel">
          <p className="section-label">Product</p>
          <h3>Product not found</h3>
          <div className="action-row">
            <Link to="/products" className="secondary-btn">Back to Products</Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <section className="panel product-details-card">
        <p className="section-label">{product.category}</p>
        <h3>{product.name}</h3>
        <p className="section-text product-description">{product.description}</p>

        <div className="product-meta-grid">
          <div className="info-card"><strong>Price</strong><p>₹ {product.price}</p></div>
          <div className="info-card"><strong>Stock Available</strong><p>{product.stock}</p></div>
          <div className="info-card"><strong>SKU</strong><p>{product.sku || `SKU-${product.id}`}</p></div>
          <div className="info-card">
            <strong>Status</strong>
            <p>{product.stock <= product.reorderLevel ? "Low Stock" : "Available"}</p>
          </div>
        </div>

        <div className="action-row">
          <button
            className="primary-btn"
            onClick={() => {
              addToCart(product); // 3. Dispatched natively to our global context state
              navigate("/cart");
            }}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
          <Link to="/products" className="secondary-btn">Back to Products</Link>
        </div>
      </section>
    </div>
  );
}

export default ProductDetailsPage;