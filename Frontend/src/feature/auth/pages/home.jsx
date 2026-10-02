import React from "react";
import { Link } from "react-router-dom";
import styles from "./home.module.scss";

export const Home = () => {
  return (
    <main className={styles.homeContainer}>
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <p className={styles.badge}>AI-Powered Shopping</p>
          <h1 className={styles.title}>
            Shop Smarter <br /> With AI
          </h1>
          <p className={styles.subtitle}>
            Discover, compare and buy from thousands of products with the help of our AI Shopping Assistant.
          </p>
          <div className={styles.actionButtons}>
            <Link to="/products" className={styles.primaryBtn}>Shop Now</Link>
            <Link to="/ai-assistant" className={styles.secondaryBtn}>Try AI Assistant</Link>
          </div>
        </div>

        <div className={styles.heroImageContainer}>
          <div className={styles.imageBackground}></div>
          <img 
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1000" 
            alt="Happy shopper with bags" 
            className={styles.heroImg}
          />
        </div>
      </section>

      <section className={styles.featuresSection}>
        <div className={styles.featureItem}>
          <div className={styles.featureIcon}>🚚</div>
          <div className={styles.featureText}>
            <h4>Free Delivery</h4>
            <p>On orders above ₹499</p>
          </div>
        </div>
        <div className={styles.featureItem}>
          <div className={styles.featureIcon}>🛡️</div>
          <div className={styles.featureText}>
            <h4>Secure Payments</h4>
            <p>100% secure checkout</p>
          </div>
        </div>
        <div className={styles.featureItem}>
          <div className={styles.featureIcon}>↩️</div>
          <div className={styles.featureText}>
            <h4>Easy Returns</h4>
            <p>Hassle free returns</p>
          </div>
        </div>
        <div className={styles.featureItem}>
          <div className={styles.featureIcon}>💬</div>
          <div className={styles.featureText}>
            <h4>24/7 Support</h4>
            <p>Always here to help</p>
          </div>
        </div>
      </section>
    </main>
  );
};
