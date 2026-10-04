import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { 
  Filter, 
  ShoppingBag, 
  Heart, 
  ChevronRight, 
  SlidersHorizontal,
  Star,
  Sparkles,
  ArrowUpDown,
  Search,
  Check,
  Eye
} from "lucide-react";
import ProductQuickViewModal from "../../../components/ProductQuickViewModal";
import RecentlyViewedCarousel from "../../../components/RecentlyViewedCarousel";
import { usePosts } from "../hooks/usePosts";
import { useCart } from "../../cart/hooks/useCart";
import { useWishlist } from "../../wishlist/wishlist.context.jsx";
import styles from "./products.module.scss";

export const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryParam = searchParams.get("category");

  const {
    products,
    categories,
    selectedCategory,
    searchTerm,
    loading,
    message,
    sortOption,
    setSortOption,
    maxPrice,
    setMaxPrice,
    setSearchTerm,
    handleCategory,
    fetchProducts,
    currentPage,
    totalPages,
  } = usePosts();

  const searchParam = searchParams.get("search") || "";
  const { handleAddToCart, message: cartMessage } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const [localPriceRange, setLocalPriceRange] = useState(maxPrice || 20000);
  const [addedItems, setAddedItems] = useState({});
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    const cat = categoryParam || "Discover";
    const s = searchParam || "";
    setSearchTerm(s);
    fetchProducts(cat, s, 1, sortOption, maxPrice);
  }, [categoryParam, searchParam]);

  const handleCategorySelection = async (category) => {
    const normalizedCategory = category === "ALL" ? "Discover" : category;
    setSearchParams({ category: normalizedCategory });
    await handleCategory(normalizedCategory);
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSortOption(newSort);
    fetchProducts(selectedCategory, searchTerm, 1, newSort, maxPrice);
  };

  const handlePriceApply = () => {
    setMaxPrice(localPriceRange);
    fetchProducts(selectedCategory, searchTerm, 1, sortOption, localPriceRange);
  };

  const onAddToCart = async (productId) => {
    await handleAddToCart(productId);
    setAddedItems(prev => ({ ...prev, [productId]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [productId]: false }));
    }, 2000);
  };

  return (
    <main className={styles.pageContainer}>
      {/* Breadcrumb Header */}
      <div className={styles.breadcrumbs}>
        <Link to="/">Home</Link>
        <ChevronRight size={14} />
        <Link to="/products">Shop</Link>
        <ChevronRight size={14} />
        <span>{selectedCategory === "Discover" ? "All Streetwear" : selectedCategory}</span>
      </div>

      <div className={styles.shopLayout}>
        {/* Sidebar Filters */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h3><SlidersHorizontal size={18} /> Filters</h3>
          </div>

          <div className={styles.sidebarSection}>
            <h4>Categories</h4>
            <ul className={styles.categoryList}>
              <li 
                className={selectedCategory === "Discover" ? styles.activeCategory : ""}
                onClick={() => handleCategorySelection("ALL")}
              >
                <span>📦</span> All Categories
              </li>
              {categories.filter(c => c !== 'Discover').map(cat => (
                <li 
                  key={cat}
                  className={selectedCategory === cat ? styles.activeCategory : ""}
                  onClick={() => handleCategorySelection(cat)}
                >
                  <span>👕</span> {cat}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.sidebarSection}>
            <h4>Max Price</h4>
            <div className={styles.priceSliderBox}>
              <input 
                type="range" 
                min="500" 
                max="20000" 
                step="500"
                value={localPriceRange}
                onChange={(e) => setLocalPriceRange(Number(e.target.value))}
                onMouseUp={handlePriceApply}
                onTouchEnd={handlePriceApply}
              />
              <div className={styles.priceLabels}>
                <span>₹500</span>
                <strong>₹{localPriceRange}</strong>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <section className={styles.mainContent}>
          <div className={styles.catalogHeader}>
            <div>
              <h1 className={styles.pageTitle}>
                {selectedCategory === "Discover" ? "All Streetwear Drops" : selectedCategory}
              </h1>
              <p className={styles.resultCount}>
                Showing <strong>{products.length}</strong> products
              </p>
            </div>

            <div className={styles.sortControls}>
              <ArrowUpDown size={16} />
              <label>Sort by:</label>
              <select value={sortOption} onChange={handleSortChange}>
                <option value="popular">Popularity</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {(message || cartMessage) && (
            <div className={styles.alertBanner}>{message || cartMessage}</div>
          )}

          {loading && !products.length ? (
            <div className={styles.loadingState}>
              <Sparkles size={24} className={styles.spinner} />
              <span>Loading latest collections...</span>
            </div>
          ) : !products.length ? (
            <div className={styles.emptyState}>
              <h3>No products found matching your search.</h3>
              <p>Try resetting filters or searching for something else!</p>
              <button onClick={() => handleCategorySelection("ALL")}>Reset Filters</button>
            </div>
          ) : (
            <div className={styles.productGrid}>
              {products.map((product) => (
                <div className={styles.productCard} key={product._id}>
                  <div className={styles.imageWrapper}>
                    <img src={product.image} alt={product.title} />
                    <button 
                      className={styles.wishlistBtn} 
                      onClick={() => toggleWishlist(product)}
                      aria-label="Wishlist toggle"
                    >
                      <span style={{ color: isInWishlist(product._id) ? '#ef4444' : '#ffffff' }}>
                        {isInWishlist(product._id) ? '❤️' : '🤍'}
                      </span>
                    </button>
                    <button 
                      className={styles.quickViewOverlayBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuickViewProduct(product);
                      }}
                    >
                      <Eye size={15} /> Quick View
                    </button>
                    <span className={styles.badgeTag}>HOT</span>
                  </div>

                  <div className={styles.productInfo}>
                    <p className={styles.categoryLabel}>{product.category}</p>
                    <h3 onClick={() => navigate(`/products/${product._id}`)}>
                      {product.title}
                    </h3>

                    <div className={styles.priceRow}>
                      <span className={styles.price}>₹{product.price}</span>
                      <span className={styles.originalPrice}>
                        ₹{Math.floor(product.price * 1.3)}
                      </span>
                      <span className={styles.discountPct}>30% OFF</span>
                    </div>

                    <div className={styles.ratingRow}>
                      <Star size={14} fill="#f59e0b" color="#f59e0b" />
                      <span>4.8</span>
                      <span className={styles.reviewCount}>(42 reviews)</span>
                    </div>

                    <button 
                      className={`${styles.quickAddBtn} ${addedItems[product._id] ? styles.addedBtn : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product._id);
                      }}
                    >
                      {addedItems[product._id] ? (
                        <>
                          <Check size={16} /> Added!
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={16} /> Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => {
                  fetchProducts(selectedCategory, searchTerm, currentPage - 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={currentPage === 1}
              >
                &larr; Previous
              </button>
              <span className={styles.pageIndicator}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => {
                  fetchProducts(selectedCategory, searchTerm, currentPage + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={currentPage === totalPages}
              >
                Next &rarr;
              </button>
            </div>
          )}
        </section>
      </div>

      <RecentlyViewedCarousel />

      <ProductQuickViewModal 
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
      />
    </main>
  );
};

export default Products;
