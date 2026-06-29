import React from "react";
import { Link } from "react-router-dom";
import styles from "./home.module.scss";

export const Home = () => {
  return (
    <main className={styles["home-page"]}>
      <div className={styles["home-shell"]}>
        <section className={styles.hero}>
          <p className={styles.tagline}>Secure auth built for today&apos;s apps</p>
          <h1>Welcome to Snitch</h1>
          <p className={styles.description}>
            Access your account or create a new one with a modern, compact authentication
            experience. Fast registration, smooth login, and a clean interface for every device.
          </p>

          <div className={styles.actions}>
            <Link to="/register" className={styles.primaryButton}>
              Create account
            </Link>
            <Link to="/login" className={styles.secondaryButton}>
              Log in
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};
