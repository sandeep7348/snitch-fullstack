import React, { useEffect, useMemo } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { usePosts } from "../../posts/hooks/usePosts";
import styles from "./dashboard.module.scss";

export const Dashboard = () => {
  const { user, handleLogout } = useAuth();
  const { featuredProducts, fetchProducts } = usePosts();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const onSignOut = () => {
    handleLogout?.();
    navigate("/");
  };

  const menuItems = [
    { label: "Dashboard", icon: "📊", path: "/dashboard" },
    { label: "Orders", icon: "📦", path: "/orders" },
    { label: "Wishlist", icon: "❤️", path: "/wishlist" },
    { label: "Cart", icon: "🛒", path: "/cart" },
    { label: "Profile", icon: "👤", path: "/profile" },
    { label: "Addresses", icon: "📍", path: "/addresses" },
    { label: "Settings", icon: "⚙️", path: "/settings" },
  ];

  return (
    <main className={styles.pageContainer}>
      <div className={styles.dashboardLayout}>
        
        {/* Sidebar Nav */}
        <aside className={styles.sidebar}>
          <div className={styles.brand}>Snitch</div>
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
              <h1>Welcome back, {user?.fullName || user?.email || "User"}! 👋</h1>
              <p>Here's what's happening with your account.</p>
            </div>
          </header>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>3</div>
              <div className={styles.statLabel}>Total Orders</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>5</div>
              <div className={styles.statLabel}>Wishlist Items</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>2</div>
              <div className={styles.statLabel}>Items in Cart</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValueGreen}>₹12,450</div>
              <div className={styles.statLabel}>Total Spent</div>
            </div>
          </div>

          <div className={styles.shoppingSection}>
            <div className={styles.sectionHeader}>
              <h2>Continue Shopping</h2>
              <Link to="/products" className={styles.viewAll}>View All</Link>
            </div>

            <div className={styles.productGrid}>
              {featuredProducts.slice(0, 4).map(product => (
                <div key={product._id} className={styles.productCard}>
                  <div className={styles.imageWrapper}>
                    <img src={product.image} alt={product.title} />
                    <button className={styles.wishlistIcon}>❤️</button>
                  </div>
                  <div className={styles.productInfo}>
                    <h3>{product.title}</h3>
                    <p className={styles.price}>₹{product.price}</p>
                    <button 
                      className={styles.addCartBtn}
                      onClick={() => navigate(`/products/${product._id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
              
              {featuredProducts.length === 0 && (
                <p className={styles.emptyText}>Explore our new collections.</p>
              )}
            </div>
          </div>
        </section>

      </div>
    </main>
  );
};

export default Dashboard;
