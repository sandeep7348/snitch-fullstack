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
  const lastFetchRef = useRef({ category: "Discover", search: "", inFlight: false });

  const fetchProducts = useCallback(async (category, search) => {
    const cat = category ?? "Discover";
    const s = search ?? "";

    if (
      lastFetchRef.current.category === cat &&
      lastFetchRef.current.search === s &&
      lastFetchRef.current.inFlight
    ) {
      console.debug("PostsProvider.fetchProducts: duplicate fetch ignored", { category: cat, search: s });
      return;
    }

    lastFetchRef.current = { category: cat, search: s, inFlight: true };
    setLoading(true);
    setMessage("");

    try {
      console.debug("PostsProvider.fetchProducts: starting", { category: cat, search: s });
      const data = s ? await searchProducts(s) : await getProductsByCategory(cat);
      console.debug("PostsProvider.fetchProducts: api returned", { length: Array.isArray(data) ? data.length : null });
      setProducts(data);
    } catch (error) {
      console.error("PostsProvider.fetchProducts: error", error);
      setMessage("Unable to load products right now.");
    } finally {
      lastFetchRef.current.inFlight = false;
      setLoading(false);
    }
    // no deps: stable function
  }, []);

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
    await fetchProducts(category, "");
  };

  const handleSearch = async (event) => {
    if (event?.preventDefault) {
      event.preventDefault();
    }
    await fetchProducts(selectedCategory, searchTerm);
  };

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      await fetchCategories();
      await fetchProducts("Discover", "");
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
        setSearchTerm,
        handleCategory,
        handleSearch,
        fetchProducts,
        loadProductById,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
}

export default PostsProvider;
