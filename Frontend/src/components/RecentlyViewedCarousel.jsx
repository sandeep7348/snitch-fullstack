import React from "react";
import { useNavigate } from "react-router-dom";
import { Clock, ArrowRight, Star } from "lucide-react";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed";
import styles from "./recentlyViewed.module.scss";

export default function RecentlyViewedCarousel({ currentProductId }) {
  const navigate = useNavigate();
  const { recentlyViewed } = useRecentlyViewed();

  const items = recentlyViewed.filter(p => (p._id || p.id) !== currentProductId);

  if (items.length === 0) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <Clock size={18} className={styles.icon} />
          <h3>Recently Viewed Fits</h3>
        </div>
        <span className={styles.subtext}>{items.length} items viewed</span>
      </div>

      <div className={styles.carouselRow}>
        {items.map((item) => (
          <div 
            key={item._id || item.id} 
            className={styles.card}
            onClick={() => navigate(`/products/${item._id || item.id}`)}
          >
            <div className={styles.imageBox}>
              <img src={item.image} alt={item.title} />
            </div>
            <div className={styles.info}>
              <span className={styles.category}>{item.category}</span>
              <h4>{item.title}</h4>
              <p className={styles.price}>₹{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
