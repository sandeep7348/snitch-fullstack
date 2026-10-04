import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Sparkles, 
  ArrowRight, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Headphones, 
  Zap,
  Star,
  Flame,
  Shirt,
  Layers,
  Sparkle
} from "lucide-react";
import { usePosts } from "../../posts/hooks/usePosts";
import { useCart } from "../../cart/hooks/useCart";
import { useWishlist } from "../../wishlist/wishlist.context.jsx";
import styles from "./home.module.scss";

export const Home = () => {
  const navigate = useNavigate();
  const { products, loading } = usePosts();
  const { handleAddToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const featuredProducts = products?.slice(0, 6) || [];

  const categories = [
    { title: "Oversized Tees", tag: "Oversized", icon: "👕", count: "34 Styles" },
    { title: "Hoodies & Sweatshirts", tag: "Hoodies", icon: "🧥", count: "28 Styles" },
    { title: "Cargo Pants", tag: "Cargo", icon: "👖", count: "19 Styles" },
    { title: "Jackets & Outerwear", tag: "Jackets", icon: "👔", count: "15 Styles" },
  ];

  return (
    <main className={styles.homeContainer}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.aiBadge}>
            <Sparkles size={16} className={styles.badgeSparkle} />
            <span>AI-Powered Streetwear Intelligence</span>
          </div>

          <h1 className={styles.heroTitle}>
            Redefining Luxury <br />
            <span className={styles.heroGradient}>Streetwear Culture</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Discover luxury oversized fits, cargos, and jackets engineered with precision. 
            Use our <strong>Mistral AI Stylist</strong> for instant outfit matching & semantic search.
          </p>

          <div className={styles.actionButtons}>
            <Link to="/products" className={styles.primaryBtn}>
              <ShoppingBag size={18} /> Explore Collection <ArrowRight size={18} />
            </Link>
            <Link to="/ai-assistant" className={styles.secondaryBtn}>
              <Sparkles size={18} /> Launch AI Stylist
            </Link>
          </div>

          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <strong>50K+</strong>
              <span>Happy Shoppers</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <strong>4.9 ★</strong>
              <span>Avg Fit Rating</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <strong>24h</strong>
              <span>Express Dispatch</span>
            </div>
          </div>
        </div>

        <div className={styles.heroImageContainer}>
          <div className={styles.imageGlow} />
          <img 
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1000" 
            alt="Snitch Luxury Streetwear Fashion" 
            className={styles.heroImg}
          />
          <div className={styles.floatingCard}>
            <div className={styles.cardHeader}>
              <Zap size={16} className={styles.zapIcon} />
              <span>Trending Drop</span>
            </div>
            <p>Oversized Heavyweight Cotton Tee</p>
            <strong>₹1,499</strong>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className={styles.sectionContainer}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.subHeading}>CURATED CATEGORIES</p>
            <h2 className={styles.headingTitle}>Shop By Collection</h2>
          </div>
          <Link to="/products" className={styles.viewAllLink}>
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className={styles.categoriesGrid}>
          {categories.map((cat, idx) => (
            <div 
              key={idx} 
              className={styles.categoryCard}
              onClick={() => navigate(`/products?category=${encodeURIComponent(cat.tag)}`)}
            >
              <div className={styles.categoryIcon}>{cat.icon}</div>
              <div className={styles.categoryInfo}>
                <h3>{cat.title}</h3>
                <p>{cat.count}</p>
              </div>
              <div className={styles.categoryArrow}>
                <ArrowRight size={18} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Stylist Spotlight Banner */}
      <section className={styles.aiSpotlightSection}>
        <div className={styles.aiSpotlightCard}>
          <div className={styles.aiSpotlightLeft}>
            <div className={styles.aiIconBubble}>
              <Sparkles size={28} />
            </div>
            <h2>Meet Your Personal AI Shopping Agent</h2>
            <p>
              Not sure what to wear? Ask Snitch AI! Search with natural prompts like 
              <em> "Black oversized tee with cargo pants under ₹3000"</em> or get smart outfit comparisons.
            </p>
            <div className={styles.promptChips}>
              <button onClick={() => navigate('/ai-assistant')}>"Suggest a casual summer outfit"</button>
              <button onClick={() => navigate('/ai-assistant')}>"Best hoodies for winter"</button>
            </div>
          </div>
          <div className={styles.aiSpotlightRight}>
            <button 
              className={styles.aiTryBtn}
              onClick={() => navigate('/ai-assistant')}
            >
              Try AI Stylist Now <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className={styles.sectionContainer}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.subHeading}>NEW ARRIVALS</p>
            <h2 className={styles.headingTitle}>Trending Drops</h2>
          </div>
          <Link to="/products" className={styles.viewAllLink}>
            Explore Shop <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className={styles.loadingState}>Loading latest drops...</div>
        ) : (
          <div className={styles.productsGrid}>
            {featuredProducts.map((product) => (
              <div key={product._id} className={styles.productCard}>
                <div className={styles.imageWrapper}>
                  <img src={product.image} alt={product.title} />
                  <button 
                    className={styles.wishlistBtn}
                    onClick={() => toggleWishlist(product)}
                    aria-label="Wishlist"
                  >
                    <span style={{ color: isInWishlist(product._id) ? '#ef4444' : '#ffffff' }}>
                      {isInWishlist(product._id) ? '❤️' : '🤍'}
                    </span>
                  </button>
                  <span className={styles.discountBadge}>NEW</span>
                </div>

                <div className={styles.productInfo}>
                  <p className={styles.categoryTag}>{product.category}</p>
                  <h3 onClick={() => navigate(`/products/${product._id}`)}>{product.title}</h3>
                  <div className={styles.priceRow}>
                    <span className={styles.price}>₹{product.price}</span>
                    <span className={styles.originalPrice}>₹{Math.floor(product.price * 1.3)}</span>
                  </div>

                  <button 
                    className={styles.addCartBtn}
                    onClick={() => handleAddToCart(product._id)}
                  >
                    <ShoppingBag size={16} /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Value Guarantees Banner */}
      <section className={styles.featuresSection}>
        <div className={styles.featureItem}>
          <div className={styles.featureIcon}><Truck size={24} /></div>
          <div className={styles.featureText}>
            <h4>Free Express Shipping</h4>
            <p>On orders above ₹999 across India</p>
          </div>
        </div>

        <div className={styles.featureItem}>
          <div className={styles.featureIcon}><ShieldCheck size={24} /></div>
          <div className={styles.featureText}>
            <h4>100% Authentic Quality</h4>
            <p>Crafted with premium cotton & fabrics</p>
          </div>
        </div>

        <div className={styles.featureItem}>
          <div className={styles.featureIcon}><RotateCcw size={24} /></div>
          <div className={styles.featureText}>
            <h4>Easy 7-Day Returns</h4>
            <p>Hassle-free replacement & refunds</p>
          </div>
        </div>

        <div className={styles.featureItem}>
          <div className={styles.featureIcon}><Sparkles size={24} /></div>
          <div className={styles.featureText}>
            <h4>AI Fit Assistant</h4>
            <p>Personalized size recommendations</p>
          </div>
        </div>
      </section>
    </main>
  );
};
