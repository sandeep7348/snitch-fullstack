import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, ShoppingBag, Heart, Star, Check, ExternalLink, Zap } from "lucide-react";
import { useCart } from "../feature/cart/hooks/useCart";
import { useWishlist } from "../feature/wishlist/wishlist.context.jsx";
import styles from "./productQuickView.module.scss";

export default function ProductQuickViewModal({ product, isOpen, onClose }) {
  const navigate = useNavigate();
  const { handleAddToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState("L");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!isOpen || !product) return null;

  const sizes = ["S", "M", "L", "XL", "XXL"];

  const onAddToCart = async () => {
    for (let i = 0; i < quantity; i++) {
      await handleAddToCart(product._id || product.id);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className={styles.grid}>
          {/* Left: Product Image */}
          <div className={styles.imageBox}>
            <span className={styles.badge}>QUICK VIEW</span>
            <img src={product.image} alt={product.title} />
          </div>

          {/* Right: Info & Controls */}
          <div className={styles.infoBox}>
            <span className={styles.category}>{product.category}</span>
            <h2 className={styles.title}>{product.title}</h2>

            <div className={styles.ratingRow}>
              <div className={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <span className={styles.ratingScore}>4.8</span>
            </div>

            <div className={styles.priceRow}>
              <span className={styles.price}>₹{product.price}</span>
              <span className={styles.originalPrice}>₹{Math.floor(product.price * 1.3)}</span>
              <span className={styles.discount}>30% OFF</span>
            </div>

            <p className={styles.description}>{product.description}</p>

            <div className={styles.selectorGroup}>
              <label>Select Size</label>
              <div className={styles.sizeGrid}>
                {sizes.map((s) => (
                  <button
                    key={s}
                    className={`${styles.sizeBtn} ${selectedSize === s ? styles.activeSize : ''}`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.selectorGroup}>
              <label>Quantity</label>
              <div className={styles.quantityBox}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            <div className={styles.actionRow}>
              <button 
                className={`${styles.addCartBtn} ${added ? styles.addedState : ''}`}
                onClick={onAddToCart}
              >
                {added ? (
                  <>
                    <Check size={16} /> Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} /> Add to Cart
                  </>
                )}
              </button>

              <button 
                className={styles.buyNowModalBtn}
                onClick={async () => {
                  await onAddToCart();
                  navigate("/cart");
                  onClose();
                }}
              >
                <Zap size={16} /> Buy Now
              </button>

              <button 
                className={styles.wishlistBtn}
                onClick={() => toggleWishlist(product)}
                aria-label="Wishlist"
              >
                <Heart size={18} fill={isInWishlist(product._id || product.id) ? '#ef4444' : 'none'} color={isInWishlist(product._id || product.id) ? '#ef4444' : '#ffffff'} />
              </button>
            </div>

            <Link 
              to={`/products/${product._id || product.id}`}
              className={styles.fullDetailLink}
              onClick={onClose}
            >
              View Full Product Page <ExternalLink size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
