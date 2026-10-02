import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { usePosts } from "../../posts/hooks/usePosts";
import styles from "./adminDashboard.module.scss"; // Reusing the layout styles
import tableStyles from "./adminProducts.module.scss";

export const AdminProducts = () => {
  const { handleLogout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { products, loading, fetchProducts } = usePosts();

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProducts("ALL", "", 1);
  }, [fetchProducts]);

  const onSignOut = () => {
    handleLogout?.();
    navigate("/");
  };

  const menuItems = [
    { label: "Dashboard", icon: "📊", path: "/admin" },
    { label: "Products", icon: "👕", path: "/admin/products" },
    { label: "Orders", icon: "📦", path: "/admin/orders" },
    { label: "Users", icon: "👥", path: "/admin/users" },
    { label: "Categories", icon: "🏷️", path: "/admin/categories" },
    { label: "Analytics", icon: "📈", path: "/admin/analytics" },
    { label: "Settings", icon: "⚙️", path: "/admin/settings" },
  ];

  return (
    <main className={styles.pageContainer}>
      <div className={styles.dashboardLayout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.brand}>Snitch Admin</div>
          <nav className={styles.navMenu}>
            {menuItems.map(item => (
              <Link 
                key={item.label}
                to={item.path} 
                className={`${styles.navItem} ${location.pathname === item.path ? styles.activeNav : ""}`}
              >
                <span>{item.icon}</span> {item.label}
              </Link>
            ))}
            <button className={styles.logoutBtn} onClick={onSignOut}>
              <span>🚪</span> Logout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <section className={styles.mainContent}>
          <header className={styles.header}>
            <div>
              <h1>Products Inventory</h1>
              <p>Manage your catalog, pricing, and stock.</p>
            </div>
            <button className={styles.primaryBtn} onClick={() => setShowModal(true)}>
              + Add Product
            </button>
          </header>

          <div className={tableStyles.filtersBar}>
            <input type="text" placeholder="Search products..." className={tableStyles.searchInput} />
            <select className={tableStyles.filterSelect}>
              <option>All Categories</option>
              <option>T-Shirts</option>
              <option>Shirts</option>
              <option>Jeans</option>
            </select>
          </div>

          <div className={styles.ordersSection}>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="6" style={{textAlign:"center", padding: "20px"}}>Loading inventory...</td></tr>
                  ) : products.length === 0 ? (
                    <tr><td colSpan="6" style={{textAlign:"center", padding: "20px"}}>No products found.</td></tr>
                  ) : (
                    products.map(product => (
                      <tr key={product._id}>
                        <td>
                          <div className={tableStyles.productImg}>
                            <img src={product.image} alt={product.title} />
                          </div>
                        </td>
                        <td className={tableStyles.productTitle}>{product.title}</td>
                        <td>{product.category}</td>
                        <td className={tableStyles.productPrice}>₹{product.price}</td>
                        <td>
                          <span className={product.stock > 10 ? tableStyles.inStock : tableStyles.lowStock}>
                            {product.stock} in stock
                          </span>
                        </td>
                        <td>
                          <div className={tableStyles.actions}>
                            <button className={tableStyles.editBtn}>✏️</button>
                            <button className={tableStyles.deleteBtn}>🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      {showModal && (
        <div className={tableStyles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={tableStyles.modalContent} onClick={e => e.stopPropagation()}>
            <h2>Add New Product</h2>
            <div className={tableStyles.formGrid}>
              <div className={tableStyles.inputGroup}>
                <label>Title</label>
                <input type="text" placeholder="e.g. Classic White T-Shirt" />
              </div>
              <div className={tableStyles.inputGroup}>
                <label>Category</label>
                <input type="text" placeholder="e.g. T-SHIRT" />
              </div>
              <div className={tableStyles.inputGroup}>
                <label>Price (₹)</label>
                <input type="number" placeholder="1499" />
              </div>
              <div className={tableStyles.inputGroup}>
                <label>Stock</label>
                <input type="number" placeholder="50" />
              </div>
              <div className={tableStyles.inputGroupFull}>
                <label>Description</label>
                <textarea rows="3" placeholder="Describe the product..."></textarea>
              </div>
              <div className={tableStyles.inputGroupFull}>
                <label>Product Image</label>
                <input type="file" />
              </div>
            </div>
            <div className={tableStyles.modalActions}>
              <button className={tableStyles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
              <button className={styles.primaryBtn} onClick={() => setShowModal(false)}>Save Product</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default AdminProducts;
