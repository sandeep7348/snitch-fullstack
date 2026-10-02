import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "../wishlist.context.jsx";
import { useCart } from "../../cart/hooks/useCart";
import styles from "./wishlist.module.scss";

export const Wishlist = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { handleAddToCart } = useCart();
  const navigate = useNavigate();

  if (wishlist.length === 0) {
    return (
      <main className={styles.pageContainer}>
        <div className={styles.emptyState}>
          <h2>Your wishlist is empty</h2>
          <p>Save items you love to review them later.</p>
          <Link to="/products" className={styles.primaryBtn}>Discover Products</Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.pageContainer}>
      <header className={styles.header}>
        <div>
          <h1>My Wishlist</h1>
          <p>{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}</p>
        </div>
      </header>
      
      <div className={styles.grid}>
        {wishlist.map(product => (
          <div className={styles.card} key={product._id}>
            <div className={styles.imageWrapper}>
              <img src={product.image} alt={product.title} onClick={() => navigate(`/products/${product._id}`)}/>
              <button 
                className={styles.removeBtn} 
                onClick={() => toggleWishlist(product)}
                title="Remove from wishlist"
              >
                ✕
              </button>
            </div>
            <div className={styles.info}>
              <h3 onClick={() => navigate(`/products/${product._id}`)}>{product.title}</h3>
              <div className={styles.priceRow}>
                <span className={styles.price}>₹{product.price}</span>
              </div>
              <button 
                className={styles.cartBtn}
                onClick={() => handleAddToCart(product._id)}
              >
                Move to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Wishlist;
