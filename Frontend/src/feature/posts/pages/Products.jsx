import React, { useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { usePosts } from "../hooks/usePosts";
import { useCart } from "../../cart/hooks/useCart";
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
    featuredProducts,
    setSearchTerm,
    handleCategory,
    handleSearch,
    fetchProducts,
    currentPage,
    totalPages,
  } = usePosts();

  const searchParam = searchParams.get("search") || "";

  const { handleAddToCart, message: cartMessage } = useCart();

  const heroCards = useMemo(
    () =>
      featuredProducts.length
        ? featuredProducts.map((product) => ({
            title: product.title,
            description: product.description,
            image: product.image,
            badge: product.category,
            id: product._id,
          }))
        : [],
    [featuredProducts]
  );

  useEffect(() => {
    if (categoryParam && categoryParam !== selectedCategory) {
      handleCategory(categoryParam);
    }
  }, [categoryParam, handleCategory, selectedCategory]);

  useEffect(() => {
    // If a search query is present in the URL, run the search and update context
    if (searchParam) {
      setSearchTerm(searchParam);
      fetchProducts(selectedCategory, searchParam);
    }
    // only rerun when searchParam or fetchProducts change
  }, [searchParam, fetchProducts, setSearchTerm]);

  const handleCategorySelection = async (category) => {
    const normalizedCategory = category === "ALL" ? "Discover" : category;
    setSearchParams({ category: normalizedCategory });
    await handleCategory(normalizedCategory);
  };

  const activeProductCount = useMemo(() => products.length, [products]);

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.categoryPage}>
          <aside className={styles.filters}>
            <h2 className={styles.filtersTitle}>FILTERS</h2>
            {[
              "SIZE",
              "COLOR",
              "PATTERN",
              "FIT",
              "MATERIAL",
              "COLLAR",
              "SLEEVES",
              "PRICE",
            ].map((filter) => (
              <div key={filter} className={styles.filterBlock}>
                <div className={styles.filterHeading}>{filter}</div>
                <span className={styles.filterToggle}>+</span>
              </div>
            ))}
            <div className={styles.applyRow}>
              <button type="button" className={styles.clearButton}>
                CLEAR
              </button>
              <button type="button" className={styles.applyButton}>
                APPLY ({activeProductCount})
              </button>
            </div>
          </aside>

          <div className={styles.catalog}>
            <div
              className={styles.banner}
              style={
                heroCards[0]?.image
                  ? { backgroundImage: `url(${heroCards[0].image})`, backgroundSize: "cover", backgroundPosition: "center" }
                  : undefined
              }
            >
              <div className={styles.bannerContent}>
                <p className={styles.bannerLabel}>50% OFF + 10% Extra</p>
                <h2 className={styles.bannerTitle}>Summer sale</h2>
                <p className={styles.bannerText}>Live now on selected products. Shop orders above ₹3999 for extra savings.</p>
                <button className={styles.bannerButton}>Live now</button>
              </div>
            </div>

            <div className={styles.topBar}>
              <div>
                <h1 className={styles.categoryTitle}>{selectedCategory === "Discover" ? "T-SHIRTS" : selectedCategory}</h1>
              </div>
              <div className={styles.sortBox}>
                <label htmlFor="sort">Sort</label>
                <select id="sort" className={styles.sortSelect}>
                  <option>Popular</option>
                  <option>Newest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            <div className={styles.chipRow}>
              {['ALL', ...categories.filter((category) => category !== 'Discover')].slice(0, 10).map((category) => {
                const normalizedCategory = category === 'ALL' ? 'Discover' : category;
                return (
                  <button
                    key={category}
                    type="button"
                    className={`${styles.chip} ${selectedCategory === normalizedCategory ? styles.activeChip : ""}`}
                    onClick={() => handleCategorySelection(category)}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            {message || cartMessage ? <p className={styles.message}>{message || cartMessage}</p> : null}

            {loading && !products.length ? (
              <p className={styles.message}>Loading products...</p>
            ) : !products.length ? (
              <p className={styles.message}>No products found.</p>
            ) : (
              <section className={styles.grid}>
                {products.map((product) => (
                  <article className={styles.card} key={product._id}>
                    <img src={product.image} alt={product.title} className={styles.image} />
                    <div className={styles.content}>
                      <p className={styles.category}>{product.category}</p>
                      <h3>{product.title}</h3>
                      <p className={styles.description}>{product.description}</p>
                      <div className={styles.meta}>
                        <span>₹{product.price}</span>
                        <span>Stock: {product.stock}</span>
                      </div>
                      <div className={styles.cardActions}>
                        <Link to={`/products/${product._id}`} className={styles.secondary}>
                          View details
                        </Link>
                        <button className={styles.primary} onClick={() => handleAddToCart(product._id)}>
                          Add to cart
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </section>
            )}

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.pageButton}
                  onClick={() => {
                    fetchProducts(selectedCategory, searchTerm, currentPage - 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                <span className={styles.pageInfo}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className={styles.pageButton}
                  onClick={() => {
                    fetchProducts(selectedCategory, searchTerm, currentPage + 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Products;
