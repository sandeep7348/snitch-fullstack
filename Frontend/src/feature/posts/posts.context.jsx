import { createContext, useEffect, useMemo, useRef, useState } from "react";
import {
  getAllProducts,
  getCategories,
  getProductsByCategory,
  getProductById,
  searchProducts,
} from "./service/post.api";
import { useCallback } from "react";

export const PostsContext = createContext();

function PostsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState(["Discover"]);
  const [selectedCategory, setSelectedCategory] = useState("Discover");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [sortOption, setSortOption] = useState("newest");
  const [maxPrice, setMaxPrice] = useState(20000);
  const lastFetchRef = useRef({ category: "Discover", search: "", page: 1, sort: "newest", price: 20000, inFlight: false });

  const fetchProducts = useCallback(async (category, search, page = 1, sortOverride, maxPriceOverride) => {
    const cat = category ?? "Discover";
    const s = search ?? "";
    const currentSort = sortOverride || sortOption;
    const currentMaxPrice = maxPriceOverride ?? maxPrice;

    setSelectedCategory(cat);

    if (
      lastFetchRef.current.category === cat &&
      lastFetchRef.current.search === s &&
      lastFetchRef.current.page === page &&
      lastFetchRef.current.sort === currentSort &&
      lastFetchRef.current.price === currentMaxPrice &&
      lastFetchRef.current.inFlight
    ) {
      console.debug("PostsProvider.fetchProducts: duplicate fetch ignored", { category: cat, search: s, page, sort: currentSort, price: currentMaxPrice });
      return;
    }

    lastFetchRef.current = { category: cat, search: s, page, sort: currentSort, price: currentMaxPrice, inFlight: true };
    setLoading(true);
    setMessage("");

    try {
      console.debug("PostsProvider.fetchProducts: starting", { category: cat, search: s, page, sort: currentSort, price: currentMaxPrice });
      const data = s ? await searchProducts(s) : await getProductsByCategory(cat, page, 10, currentSort, currentMaxPrice);
      console.debug("PostsProvider.fetchProducts: api returned", { length: Array.isArray(data.posts) ? data.posts.length : null });
      setProducts(data.posts || []);
      setCurrentPage(data.currentPage || 1);
      setTotalPages(data.totalPages || 1);
      setTotalPosts(data.totalPosts || 0);
    } catch (error) {
      console.error("PostsProvider.fetchProducts: error", error);
      setMessage("Unable to load products right now.");
    } finally {
      lastFetchRef.current.inFlight = false;
      setLoading(false);
    }
  }, [sortOption, maxPrice]);

  const loadProductById = useCallback(async (productId) => {
    setLoading(true);
    setMessage("");
    setProduct(null);

    try {
      const data = await getProductById(productId);
      setProduct(data);
      return data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error.message || "Product not found.";
      setMessage(errorMessage);
      setProduct(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const featuredProducts = useMemo(
    () => products.filter((productItem) => productItem.isFeatured).slice(0, 3),
    [products]
  );

  const fetchCategories = async () => {
    try {
      const categoryList = await getCategories();
      setCategories(["Discover", ...categoryList]);
    } catch (error) {
      setMessage("Unable to load product categories.");
      setCategories(["Discover"]);
    }
  };

  const handleCategory = async (category) => {
    setSelectedCategory(category);
    setSearchTerm("");
    await fetchProducts(category, "", 1, sortOption, maxPrice);
  };

  const handleSearch = async (event) => {
    if (event?.preventDefault) {
      event.preventDefault();
    }
    await fetchProducts(selectedCategory, searchTerm, 1);
  };

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      await fetchCategories();
      await fetchProducts("Discover", "", 1);
      setLoading(false);
    };

    initialize();
  }, []);

  return (
    <PostsContext.Provider
      value={{
        products,
        product,
        categories,
        selectedCategory,
        searchTerm,
        loading,
        message,
        featuredProducts,
        sortOption,
        setSortOption,
        maxPrice,
        setMaxPrice,
        setSearchTerm,
        handleCategory,
        handleSearch,
        fetchProducts,
        loadProductById,
        currentPage,
        totalPages,
        totalPosts,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
}

export default PostsProvider;
