import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
  
  // UI states for sidebar (local state for smooth sliding)
  const [localPriceRange, setLocalPriceRange] = useState(maxPrice || 20000);

  useEffect(() => {
    if (categoryParam && categoryParam !== selectedCategory) {
      handleCategory(categoryParam);
    }
  }, [categoryParam, handleCategory, selectedCategory]);

  useEffect(() => {
    if (searchParam) {
      setSearchTerm(searchParam);
      fetchProducts(selectedCategory, searchParam);
    }
  }, [searchParam, fetchProducts, setSearchTerm]);

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

  const activeProductCount = products.length;

  return (
    <main className={styles.pageContainer}>
      <div className={styles.breadcrumbs}>
        <Link to="/">Home</Link> &gt; <span>Shop</span> &gt; <span>{selectedCategory === "Discover" ? "All Categories" : selectedCategory}</span>
      </div>

      <div className={styles.shopLayout}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarSection}>
            <h3>Categories</h3>
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
            <h3>Price Range</h3>
            <div className={styles.priceSlider}>
              <input 
                type="range" 
                min="0" 
                max="20000" 
                step="500"
                value={localPriceRange}
                onChange={(e) => setLocalPriceRange(Number(e.target.value))}
                onMouseUp={handlePriceApply}
                onTouchEnd={handlePriceApply}
              />
              <div className={styles.priceLabels}>
                <span>₹0</span>
                <span>₹{localPriceRange}</span>
              </div>
            </div>
          </div>

          <div className={styles.sidebarSection}>
            <h3>Brand</h3>
            <div className={styles.checkboxList}>
              <label><input type="checkbox" defaultChecked /> Nike</label>
              <label><input type="checkbox" /> Adidas</label>
              <label><input type="checkbox" /> Puma</label>
              <label><input type="checkbox" /> Levi's</label>
            </div>
          </div>
        </aside>

        <section className={styles.mainContent}>
          <div className={styles.catalogHeader}>
            <div>
              <h1 className={styles.pageTitle}>{selectedCategory === "Discover" ? "All Products" : selectedCategory}</h1>
              <p className={styles.resultCount}>Showing 1-{activeProductCount} results</p>
            </div>
            <div className={styles.sortControls}>
              <label>Sort by:</label>
              <select value={sortOption} onChange={handleSortChange}>
                <option value="popular">Popularity</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {message || cartMessage ? <div className={styles.alertMessage}>{message || cartMessage}</div> : null}

          {loading && !products.length ? (
            <div className={styles.loadingState}>Loading products...</div>
          ) : !products.length ? (
            <div className={styles.emptyState}>No products found matching your criteria.</div>
          ) : (
            <div className={styles.productGrid}>
              {products.map((product) => (
                <div className={styles.productCard} key={product._id}>
                  <div className={styles.imageWrapper}>
                    <img src={product.image} alt={product.title} />
                    <button 
                      className={styles.wishlistBtn} 
                      onClick={() => toggleWishlist(product)}
                      title="Toggle Wishlist"
                      style={{ color: isInWishlist(product._id) ? '#ef4444' : 'var(--text-gray)' }}
                    >
                      {isInWishlist(product._id) ? '❤️' : '🤍'}
                    </button>
                  </div>
                  <div className={styles.productInfo}>
                    <h3 onClick={() => navigate(`/products/${product._id}`)}>{product.title}</h3>
                    <div className={styles.priceRow}>
                      <span className={styles.price}>₹{product.price}</span>
                      <span className={styles.originalPrice}>₹{Math.floor(product.price * 1.3)}</span>
                    </div>
                    <div className={styles.ratingRow}>
                      <span className={styles.stars}>⭐⭐⭐⭐⭐</span>
                    </div>
                    <button 
                      className={styles.quickAddBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product._id);
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => {
                  fetchProducts(selectedCategory, searchTerm, currentPage - 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={currentPage === 1}
              >
                &larr; Prev
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
    </main>
  );
};

export default Products;
