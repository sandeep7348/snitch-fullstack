import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { usePosts } from "../hooks/usePosts";
import { useCart } from "../../cart/hooks/useCart";
import { useAuth } from "../../auth/hooks/useAuth";
import { useWishlist } from "../../wishlist/wishlist.context.jsx";
import CommentSection from "../../comment/components/CommentSection";
import styles from "./productDetail.module.scss";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  
  // Mock UI States to match design
  const [selectedSize, setSelectedSize] = useState(8);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);
  const colors = ["#000000", "#ef4444", "#3b82f6", "#10b981"];
  const sizes = [6, 7, 8, 9, 10];

  const loadedIdRef = useRef(null);

  const { loadProductById } = usePosts();
  const { handleAddToCart } = useCart();
  const { user } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setMessage("");
      try {
        const data = await loadProductById(id);
        setProduct(data);
        loadedIdRef.current = id;
      } catch (error) {
        setMessage(error?.response?.data?.message || "Product not found.");
      } finally {
        setLoading(false);
      }
    };

    if (id && loadedIdRef.current !== id) {
      loadProduct();
    }
  }, [id, loadProductById]);

  if (loading) {
    return <main className={styles.pageContainer}><div className={styles.loadingState}>Loading product...</div></main>;
  }

  if (!product) {
    return (
      <main className={styles.pageContainer}>
        <div className={styles.emptyState}>
          <p>Product not available.</p>
          <Link to="/products" className={styles.linkButton}>Back to Products</Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.pageContainer}>
      <div className={styles.breadcrumbs}>
        <Link to="/">Home</Link> &gt; <Link to="/products">Shop</Link> &gt; <span>{product.category}</span> &gt; <span>{product.title}</span>
      </div>

      <div className={styles.productLayout}>
        {/* Left Side: Images */}
        <div className={styles.imageGallery}>
          <div className={styles.thumbnailList}>
            {/* Mock thumbnails duplicating main image */}
            {[1,2,3,4].map((i) => (
              <div key={i} className={`${styles.thumbnail} ${i === 1 ? styles.activeThumb : ''}`}>
                <img src={product.image} alt="Thumbnail" />
              </div>
            ))}
          </div>
          <div className={styles.mainImage}>
            <button 
              className={styles.wishlistBtn}
              onClick={() => toggleWishlist(product)}
              style={{ color: isInWishlist(product._id) ? '#ef4444' : 'var(--text-gray)' }}
            >
              {isInWishlist(product._id) ? '❤️' : '🤍'}
            </button>
            <img src={product.image} alt={product.title} />
          </div>
        </div>

        {/* Right Side: Info */}
        <div className={styles.productInfo}>
          <h1 className={styles.title}>{product.title}</h1>
          
          <div className={styles.ratingRow}>
            <span className={styles.stars}>⭐⭐⭐⭐⭐</span>
            <span className={styles.ratingScore}>4.5</span>
            <span className={styles.reviewCount}>(1,234 reviews)</span>
          </div>

          <div className={styles.priceRow}>
            <span className={styles.price}>₹{product.price}</span>
            <span className={styles.originalPrice}>₹{Math.floor(product.price * 1.31)}</span>
            <span className={styles.discountBadge}>31% off</span>
          </div>

          <p className={styles.description}>{product.description}</p>

          <div className={styles.selectorGroup}>
            <h4>Size</h4>
            <div className={styles.sizeOptions}>
              {sizes.map(size => (
                <button 
                  key={size}
                  className={`${styles.sizeBtn} ${selectedSize === size ? styles.activeSize : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.selectorGroup}>
            <h4>Color</h4>
            <div className={styles.colorOptions}>
              {colors.map((color, idx) => (
                <button 
                  key={idx}
                  className={`${styles.colorBtn} ${selectedColor === idx ? styles.activeColor : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(idx)}
                />
              ))}
            </div>
          </div>

          <div className={styles.selectorGroup}>
            <h4>Quantity</h4>
            <div className={styles.quantityBox}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>

          {message && <div className={styles.alertMessage}>{message}</div>}

          <div className={styles.actionButtons}>
            <button
              className={styles.primaryBtn}
              onClick={async () => {
                if (!user) { navigate("/login", { state: { from: location }, replace: true }); return; }
                try {
                  for(let i=0; i<quantity; i++) await handleAddToCart(product._id);
                  setMessage("Added to cart successfully!");
                } catch (error) {
                  setMessage(error?.response?.data?.message || "Could not add to cart.");
                }
              }}
            >
              Add to Cart
            </button>
            <button
              className={styles.secondaryBtn}
              onClick={async () => {
                if (!user) { navigate("/login", { state: { from: location }, replace: true }); return; }
                try {
                  for(let i=0; i<quantity; i++) await handleAddToCart(product._id);
                  navigate("/cart");
                } catch (error) {
                  setMessage(error?.response?.data?.message || "Could not add to cart.");
                }
              }}
            >
              Buy Now
            </button>
          </div>

          <div className={styles.trustBadges}>
            <div className={styles.badgeItem}>
              <span className={styles.icon}>🚚</span>
              <div>
                <strong>Free Delivery</strong>
                <p>On orders above ₹499</p>
              </div>
            </div>
            <div className={styles.badgeItem}>
              <span className={styles.icon}>📦</span>
              <div>
                <strong>Easy Returns</strong>
                <p>7 days return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.commentsSectionWrapper}>
         <CommentSection postId={product._id} />
      </div>
    </main>
  );
};

export default ProductDetail;