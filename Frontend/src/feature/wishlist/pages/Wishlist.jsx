import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, X, ChevronRight } from "lucide-react";
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
          <div className={styles.emptyIcon}>
            <Heart size={44} />
          </div>
          <h2>Your wishlist is empty</h2>
          <p>Save items you love to review and purchase them later.</p>
          <Link to="/products" className={styles.primaryBtn}>Explore Streetwear</Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.pageContainer}>
      <div className={styles.breadcrumbs}>
        <Link to="/">Home</Link>
        <ChevronRight size={14} />
        <span>My Saved Wishlist</span>
      </div>

      <header className={styles.header}>
        <div>
          <h1>My Wishlist</h1>
          <p>{wishlist.length} saved {wishlist.length === 1 ? 'item' : 'items'}</p>
        </div>
      </header>
      
      <div className={styles.grid}>
        {wishlist.map(product => (
          <div className={styles.card} key={product._id}>
            <div className={styles.imageWrapper}>
              <img 
                src={product.image} 
                alt={product.title} 
                onClick={() => navigate(`/products/${product._id}`)}
              />
              <button 
                className={styles.removeBtn} 
                onClick={() => toggleWishlist(product)}
                title="Remove from wishlist"
              >
                <X size={16} />
              </button>
            </div>
            <div className={styles.info}>
              <h3 onClick={() => navigate(`/products/${product._id}`)}>{product.title}</h3>
              <div className={styles.priceRow}>
                <span className={styles.price}>₹{product.price}</span>
                <span className={styles.originalPrice}>₹{Math.floor(product.price * 1.3)}</span>
              </div>
              <button 
                className={styles.cartBtn}
                onClick={() => handleAddToCart(product._id)}
              >
                <ShoppingBag size={16} /> Move to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Wishlist;
