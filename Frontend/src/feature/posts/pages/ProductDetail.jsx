import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { 
  Heart, 
  ShoppingBag, 
  Zap, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  ChevronRight,
  Star,
  Check,
  Sparkles
} from "lucide-react";
import { usePosts } from "../hooks/usePosts";
import { useCart } from "../../cart/hooks/useCart";
import { useAuth } from "../../auth/hooks/useAuth";
import { useWishlist } from "../../wishlist/wishlist.context.jsx";
import { useComments } from "../../comment/hooks/useComments.jsx";
import { useRecentlyViewed } from "../../../hooks/useRecentlyViewed";
import CommentSection from "../../comment/components/CommentSection";
import AiFitFinderModal from "../../../components/AiFitFinderModal";
import RecentlyViewedCarousel from "../../../components/RecentlyViewedCarousel";
import styles from "./productDetail.module.scss";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [fitFinderOpen, setFitFinderOpen] = useState(false);
  
  const [selectedSize, setSelectedSize] = useState("L");
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);
  const colors = ["#090a0f", "#475569", "#1e3a8a", "#831843"];
  const sizes = ["S", "M", "L", "XL", "XXL"];

  const loadedIdRef = useRef(null);

  const { loadProductById } = usePosts();
  const { handleAddToCart } = useCart();
  const { user } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { comments = [] } = useComments();
  const { addRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    let isMounted = true;
    const loadProduct = async () => {
      setLoading(true);
      setMessage("");
      try {
        const data = await loadProductById(id);
        if (isMounted) {
          setProduct(data);
          if (data) addRecentlyViewed(data);
        }
      } catch (error) {
        if (isMounted) {
          setMessage(error?.response?.data?.message || "Product not found.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      loadProduct();
    }

    return () => {
      isMounted = false;
    };
  }, [id, loadProductById, addRecentlyViewed]);

  if (loading) {
    return (
      <main className={styles.pageContainer}>
        <div className={styles.loadingState}>
          <Sparkles size={28} className={styles.spinner} />
          <p>Loading product details...</p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className={styles.pageContainer}>
        <div className={styles.emptyState}>
          <h2>Product Not Found</h2>
          <p>The product you are looking for does not exist or has been removed.</p>
          <Link to="/products" className={styles.linkButton}>Explore Streetwear</Link>
        </div>
      </main>
    );
  }

  const reviewScore = comments.length > 0 ? (4.2 + Math.min(0.7, comments.length * 0.1)).toFixed(1) : "4.8";

  return (
    <main className={styles.pageContainer}>
      {/* Breadcrumb Trail */}
      <div className={styles.breadcrumbs}>
        <Link to="/">Home</Link>
        <ChevronRight size={14} />
        <Link to="/products">Shop</Link>
        <ChevronRight size={14} />
        <span>{product.category}</span>
        <ChevronRight size={14} />
        <span>{product.title}</span>
      </div>

      <div className={styles.productLayout}>
        {/* Gallery Column */}
        <div className={styles.imageGallery}>
          <div className={styles.thumbnailList}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`${styles.thumbnail} ${i === 1 ? styles.activeThumb : ''}`}>
                <img src={product.image} alt={`${product.title} view ${i}`} />
              </div>
            ))}
          </div>

          <div className={styles.mainImage}>
            <button 
              className={styles.wishlistBtn}
              onClick={() => toggleWishlist(product)}
              aria-label="Wishlist toggle"
            >
              <span style={{ color: isInWishlist(product._id) ? '#ef4444' : '#ffffff' }}>
                {isInWishlist(product._id) ? '❤️' : '🤍'}
              </span>
            </button>
            <img src={product.image} alt={product.title} />
          </div>
        </div>

        {/* Product Details Info Column */}
        <div className={styles.productInfo}>
          <div className={styles.categoryBadge}>{product.category}</div>
          <h1 className={styles.title}>{product.title}</h1>

          <div className={styles.ratingRow}>
            <div className={styles.stars}>
              {[...Array(5)].map((_, idx) => (
                <Star key={idx} size={16} fill="#f59e0b" color="#f59e0b" />
              ))}
            </div>
            <span className={styles.ratingScore}>{reviewScore}</span>
            <span className={styles.reviewCount}>
              ({comments.length} customer {comments.length === 1 ? 'review' : 'reviews'})
            </span>
          </div>

          <div className={styles.priceRow}>
            <span className={styles.price}>₹{product.price}</span>
            <span className={styles.originalPrice}>₹{Math.floor(product.price * 1.35)}</span>
            <span className={styles.discountBadge}>35% OFF</span>
          </div>

          <div className={styles.stockNotice}>
            <span className={styles.stockDot} />
            <span>In Stock — Ready to ship within 24 hours</span>
          </div>

          <p className={styles.description}>{product.description}</p>

          {/* Selectors */}
          <div className={styles.selectorGroup}>
            <div className={styles.selectorHeader}>
              <h4>Select Size</h4>
              <button 
                className={styles.sizeGuideBtn}
                onClick={() => setFitFinderOpen(true)}
              >
                <Sparkles size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                AI Fit Finder & Size Guide
              </button>
            </div>
            <div className={styles.sizeOptions}>
              {sizes.map((size) => (
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
            <h4>Select Color</h4>
            <div className={styles.colorOptions}>
              {colors.map((color, idx) => (
                <button 
                  key={idx}
                  className={`${styles.colorBtn} ${selectedColor === idx ? styles.activeColor : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(idx)}
                >
                  {selectedColor === idx && <Check size={14} color="#ffffff" />}
                </button>
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

          {/* Action CTAs */}
          <div className={styles.actionButtons}>
            <button
              className={styles.primaryBtn}
              onClick={async () => {
                if (!user) { navigate("/login", { state: { from: location }, replace: true }); return; }
                try {
                  for (let i = 0; i < quantity; i++) await handleAddToCart(product._id);
                  setMessage("Item added to cart successfully!");
                } catch (error) {
                  setMessage(error?.response?.data?.message || "Could not add to cart.");
                }
              }}
            >
              <ShoppingBag size={18} /> Add to Cart
            </button>

            <button
              className={styles.secondaryBtn}
              onClick={async () => {
                if (!user) { navigate("/login", { state: { from: location }, replace: true }); return; }
                try {
                  for (let i = 0; i < quantity; i++) await handleAddToCart(product._id);
                  navigate("/cart");
                } catch (error) {
                  setMessage(error?.response?.data?.message || "Could not add to cart.");
                }
              }}
            >
              <Zap size={18} /> Buy Now
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className={styles.trustBadges}>
            <div className={styles.badgeItem}>
              <Truck size={20} className={styles.badgeIcon} />
              <div>
                <strong>Free Express Shipping</strong>
                <p>On all orders across India</p>
              </div>
            </div>
            <div className={styles.badgeItem}>
              <RotateCcw size={20} className={styles.badgeIcon} />
              <div>
                <strong>7-Day Returns</strong>
                <p>Hassle-free exchange policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className={styles.commentsSectionWrapper}>
        <CommentSection postId={product._id} />
      </div>

      <RecentlyViewedCarousel currentProductId={product._id} />

      <AiFitFinderModal 
        isOpen={fitFinderOpen}
        onClose={() => setFitFinderOpen(false)}
        onSelectSize={(size) => setSelectedSize(size)}
      />
    </main>
  );
};

export default ProductDetail;