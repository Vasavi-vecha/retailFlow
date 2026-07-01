import { useAppContext } from "../../context/AppContext";

function InventoryPage() {
  const { state, adjustStock, deleteInventoryItem } = useAppContext();
  const { inventory } = state;

  return (
    <div className="page-wrapper">
      <section className="panel panel-wide">
        <p className="section-label">Inventory</p>
        <h3>Stock Control</h3>
        <p className="section-text">
          Review product stock levels and update supply quantities.
        </p>

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