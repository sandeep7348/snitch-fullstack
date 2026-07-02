import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePosts } from "../../posts/hooks/usePosts";
import styles from "./home.module.scss";

export const Home = () => {
  const navigate = useNavigate();
  const { categories, featuredProducts, loading, message } = usePosts();
  const heroCards = useMemo(
    () =>
      featuredProducts.length
        ? featuredProducts.map((product) => ({
            title: product.title,
            description: product.description,
            image: product.image,
            badge: product.category,
            id: product._id,
          }))
        : [],
    [featuredProducts]
  );
  return (
    <main className={styles["home-page"]}>

      <nav className={styles["category-nav"]}>
        {loading ? (
          <span className={styles["category-loading"]}>Loading categories…</span>
        ) : (
          categories.map((category) => (
            <button
              key={category}
              className={styles["category-item"]}
              onClick={() => navigate(`/products?category=${encodeURIComponent(category)}`)}
            >
              {category}
            </button>
          ))
        )}
      </nav>

      <section className={styles["hero-grid"]}>
        <div
          className={styles["hero-panel"]}
          style={
            heroCards[0]?.image
              ? { backgroundImage: `url(${heroCards[0].image})`, backgroundSize: "cover", backgroundPosition: "center" }
              : undefined
          }
        >
          <div className={styles["hero-copy"]}>
            <p className={styles["tagline"]}>DISCOVER</p>
            <h1>Streetwear dropped for every mood.</h1>
            <p>Explore collections built for effortless styling, elevated essentials, and signature attitude.</p>
            <div className={styles["hero-actions"]}>
              <Link to="/products" className={styles["primary-button"]}>
                Shop now
              </Link>
              <Link to="/orders" className={styles["secondary-button"]}>
                Your orders
              </Link>
            </div>
          </div>
        </div>

        <div className={styles["hero-cards"]}>
          {message ? (
            <div className={styles["message-box"]}>{message}</div>
          ) : heroCards.length ? (
            heroCards.map((card) => (
              <article key={card.id} className={styles["hero-card"]}>
                <div
                  className={styles["hero-card-image"]}
                  style={{ backgroundImage: `url(${card.image})` }}
                >
                  <span className={styles["hero-card-tag"]}>{card.badge}</span>
                </div>
                <div className={styles["hero-card-copy"]}>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
              </article>
            ))
          ) : (
            <article className={styles["hero-card"]}>
              <div className={styles["hero-card-copy"]}>
                <h3>Fresh arrivals from the store</h3>
                <p>Explore the latest items pulled from the backend catalog.</p>
              </div>
            </article>
          )}
        </div>
      </section>
    </main>
  );
};
