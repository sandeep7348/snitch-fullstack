import React from "react";
import { useNavigate } from "react-router-dom";
import { usePosts } from "../feature/posts/hooks/usePosts";
import styles from "./sideMenu.module.scss";

export default function SideMenu({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { categories, selectedCategory, featuredProducts } = usePosts();
  const thumbs = featuredProducts.slice(0, 4);

  const handleCategoryClick = (category) => {
    const categoryValue = category === "Discover" ? "Discover" : category;
    navigate(`/products?category=${encodeURIComponent(categoryValue)}`);
    onClose();
  };

  return (
    <div className={`${styles.overlay} ${isOpen ? styles.open : ""}`} onClick={onClose}>
      <aside className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.headerRow}>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close menu">✕</button>
          <h3 className={styles.title}>CATEGORIES</h3>
        </div>

        <div className={styles.topThumbs}>
          {thumbs.length > 0
            ? thumbs.map((product) => (
                <button
                  key={product._id}
                  type="button"
                  className={styles.thumb}
                  onClick={() => {
                    navigate(`/products/${product._id}`);
                    onClose();
                  }}
                  aria-label={`View ${product.title}`}
                >
                  <img src={product.image} alt={product.title} className={styles.thumbImage} />
                </button>
              ))
            : Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className={styles.thumb} />
              ))}
        </div>

        <nav className={styles.list} aria-label="Categories">
          {categories.map((c) => {
            const isActive = c === selectedCategory;
            return (
              <button
                key={c}
                className={`${styles.item} ${isActive ? styles.activeItem : ""}`}
                type="button"
                onClick={() => handleCategoryClick(c)}
              >
                {c}
              </button>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
