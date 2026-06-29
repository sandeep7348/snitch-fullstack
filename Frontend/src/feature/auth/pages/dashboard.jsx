import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import styles from "./dashboard.module.scss";

export const Dashboard = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const onSignOut = () => {
    handleLogout?.();
    navigate("/");
  };

  return (
    <main className={styles["dashboard-page"]}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div>
            <h1>Dashboard</h1>
            <p className={styles.subtitle}>Welcome back, {user?.fullName || user?.email || "User"}</p>
          </div>

          <div className={styles.headerActions}>
            <button className={styles.signout} onClick={onSignOut}>Sign out</button>
          </div>
        </header>

        <section className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>3</div>
            <div className={styles.statLabel}>Active Projects</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statValue}>12</div>
            <div className={styles.statLabel}>Tasks</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statValue}>1</div>
            <div className={styles.statLabel}>Notifications</div>
          </div>
        </section>

        <section className={styles.panel}>
          <h2>Quick Actions</h2>
          <div className={styles.actionsRow}>
            <button className={styles.primary}>View profile</button>
            <button className={styles.ghost}>Manage settings</button>
            <button className={styles.ghost} onClick={onSignOut}>Sign out</button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
