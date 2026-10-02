import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import styles from "./adminDashboard.module.scss";

export const AdminDashboard = () => {
  const { handleLogout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  const recentOrders = [
    { id: "#ORD-0921", customer: "Sandeep Choudhary", date: "Oct 2, 2026", amount: "₹4,299", status: "Delivered" },
    { id: "#ORD-0922", customer: "Rahul Sharma", date: "Oct 2, 2026", amount: "₹1,499", status: "Processing" },
    { id: "#ORD-0923", customer: "Priya Singh", date: "Oct 1, 2026", amount: "₹8,999", status: "Shipped" },
    { id: "#ORD-0924", customer: "Amit Patel", date: "Oct 1, 2026", amount: "₹2,150", status: "Pending" },
    { id: "#ORD-0925", customer: "Neha Gupta", date: "Sep 30, 2026", amount: "₹5,600", status: "Delivered" },
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
              <h1>Overview</h1>
              <p>Here's what's happening in your store today.</p>
            </div>
            <button className={styles.primaryBtn}>+ Add Product</button>
          </header>

          {/* Stats Grid */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Total Sales</div>
              <div className={styles.statValueGreen}>₹1,24,500</div>
              <div className={styles.statTrend}>+12.5% from last month</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Total Orders</div>
              <div className={styles.statValue}>248</div>
              <div className={styles.statTrend}>+5.2% from last month</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Total Users</div>
              <div className={styles.statValue}>1,425</div>
              <div className={styles.statTrend}>+18 new this week</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Products</div>
              <div className={styles.statValue}>320</div>
              <div className={styles.statTrend}>12 out of stock</div>
            </div>
          </div>

          <div className={styles.contentGrid}>
            {/* Chart Area */}
            <div className={styles.chartSection}>
              <div className={styles.sectionHeader}>
                <h2>Sales Overview</h2>
                <select className={styles.filterSelect}>
                  <option>Last 7 Days</option>
                  <option>This Month</option>
                  <option>This Year</option>
                </select>
              </div>
              <div className={styles.chartPlaceholder}>
                {/* Mocking a line chart with CSS and SVG */}
                <svg viewBox="0 0 800 300" className={styles.lineChart}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="rgba(79, 70, 229, 0.2)" />
                      <stop offset="100%" stopColor="rgba(79, 70, 229, 0)" />
                    </linearGradient>
                  </defs>
                  <path 
                    d="M 0,250 C 100,200 200,280 300,150 C 400,50 500,220 600,100 C 700,0 800,80 800,80 L 800,300 L 0,300 Z" 
                    fill="url(#chartGradient)" 
                  />
                  <path 
                    d="M 0,250 C 100,200 200,280 300,150 C 400,50 500,220 600,100 C 700,0 800,80 800,80" 
                    fill="none" 
                    stroke="var(--primary-color)" 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                  <circle cx="300" cy="150" r="6" fill="var(--white)" stroke="var(--primary-color)" strokeWidth="3" />
                  <circle cx="600" cy="100" r="6" fill="var(--white)" stroke="var(--primary-color)" strokeWidth="3" />
                </svg>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className={styles.ordersSection}>
              <div className={styles.sectionHeader}>
                <h2>Recent Orders</h2>
                <Link to="/admin/orders" className={styles.viewAll}>View All</Link>
              </div>
              
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(order => (
                      <tr key={order.id}>
                        <td className={styles.orderId}>{order.id}</td>
                        <td>{order.customer}</td>
                        <td>{order.date}</td>
                        <td className={styles.amount}>{order.amount}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${styles[order.status.toLowerCase()]}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
};

export default AdminDashboard;
