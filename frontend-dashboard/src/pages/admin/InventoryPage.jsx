import { useState } from "react";
import { useAppContext } from "../../context/AppContext";

const emptyProductForm = {
  name: "",
  category: "",
  description: "",
  price: "",
  mrp: "",
  discount: "",
  stock: "",
  reorderLevel: "",
  sku: "",
  image: "",
};

function InventoryPage() {
  const { state, adjustStock, deleteInventoryItem, addInventoryItem } = useAppContext();
  const { inventory } = state;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState(emptyProductForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleAddProduct(event) {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      await addInventoryItem({
        ...formData,
        price: Number(formData.price),
        mrp: Number(formData.mrp),
        stock: Number(formData.stock),
        reorderLevel: Number(formData.reorderLevel),
      });
      setFormData(emptyProductForm);
      setIsFormOpen(false);
    } catch (error) {
      console.error("Add product failed: ", error);
      alert("Failed to add product.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="page-wrapper">
      <section className="panel panel-wide">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p className="section-label">Inventory</p>
            <h3>Stock Control</h3>
            <p className="section-text">
              Review product stock levels and update supply quantities.
            </p>
          </div>
          <button
            type="button"
            className="primary-btn"
            onClick={() => setIsFormOpen((open) => !open)}
          >
            {isFormOpen ? "Cancel" : "+ Add Product"}
          </button>
        </div>

        {isFormOpen && (
          <form className="order-form" onSubmit={handleAddProduct}>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  className="input"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Product name"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="category">Category</label>
                <input
                  id="category"
                  name="category"
                  className="input"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Electronics"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="description">Description</label>
                <input
                  id="description"
                  name="description"
                  className="input"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Short description"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="price">Price</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  className="input"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Selling price"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="mrp">MRP</label>
                <input
                  id="mrp"
                  name="mrp"
                  type="number"
                  min="0"
                  step="0.01"
                  className="input"
                  value={formData.mrp}
                  onChange={handleChange}
                  placeholder="Maximum retail price"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="discount">Discount</label>
                <input
                  id="discount"
                  name="discount"
                  className="input"
                  value={formData.discount}
                  onChange={handleChange}
                  placeholder="e.g. 20% off"
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-field">
                <label htmlFor="stock">Stock</label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  className="input"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="Available quantity"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="reorderLevel">Reorder Level</label>
                <input
                  id="reorderLevel"
                  name="reorderLevel"
                  type="number"
                  min="0"
                  className="input"
                  value={formData.reorderLevel}
                  onChange={handleChange}
                  placeholder="Low-stock threshold"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="sku">SKU</label>
                <input
                  id="sku"
                  name="sku"
                  className="input"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="e.g. SKU-001"
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-field">
                <label htmlFor="image">Image URL</label>
                <input
                  id="image"
                  name="image"
                  className="input"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://..."
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <button type="submit" className="primary-btn" disabled={isSubmitting}>
              {isSubmitting ? "Adding Product..." : "Add Product"}
            </button>
          </form>
        )}

        {inventory.length === 0 ? (
          <div className="empty-box">
            <h3>No inventory items</h3>
            <p>Inventory items will appear here when products are added.</p>
          </div>
        ) : (
          <div className="inventory-list-grid">
            {inventory.map((item) => {
              const stockPercent = Math.min((item.stock / 100) * 100, 100);

              return (
                <article className="inventory-detail-card" key={item.id}>
                  <div className="inventory-detail-top">
                    <div>
                      <p className="section-label">{item.category}</p>
                      <h4>{item.name}</h4>
                    </div>

                    <span
                      className={`small-badge ${
                        item.stock <= item.reorderLevel ? "danger" : ""
                      }`}
                    >
                      {item.stock <= item.reorderLevel ? "Low Stock" : "Stable"}
                    </span>
                  </div>

                  <div className="inventory-meta-grid">
                    <div>
                      <p className="mobile-order-label">Stock</p>
                      <strong>{item.stock}</strong>
                    </div>
                    <div>
                      <p className="mobile-order-label">Reorder Level</p>
                      <strong>{item.reorderLevel}</strong>
                    </div>
                    <div>
                      <p className="mobile-order-label">Category</p>
                      <strong>{item.category}</strong>
                    </div>
                    <div>
                      <p className="mobile-order-label">SKU</p>
                      <strong>{item.sku || `SKU-${item.id}`}</strong>
                    </div>
                  </div>

                  <div className="stock-progress-block">
                    <div className="stock-progress-row">
                      <span>Available Stock</span>
                      <span>{item.stock}</span>
                    </div>
                    <div className="stock-progress-bar">
                      <div
                        className={`stock-progress-fill ${
                          item.stock <= item.reorderLevel
                            ? "danger-fill"
                            : item.stock <= item.reorderLevel + 5
                            ? "warning-fill"
                            : "success-fill"
                        }`}
                        style={{ width: `${stockPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="inventory-actions">
                    <button
                      className="ghost-btn small-btn"
                      onClick={() => adjustStock(item.id, -1)}
                    >
                      -1 Stock
                    </button>
                    <button
                      className="ghost-btn small-btn"
                      onClick={() => adjustStock(item.id, 5)}
                    >
                      +5 Stock
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteInventoryItem(item.id)}
                    >
                      Delete
                    </button>
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

export default InventoryPage;