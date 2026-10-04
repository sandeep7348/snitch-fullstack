import { useState, useEffect } from "react";

const STORAGE_KEY = "snitch_recently_viewed";

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setRecentlyViewed(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Could not read recently viewed items", e);
    }
  }, []);

  const addRecentlyViewed = (product) => {
    if (!product || (!product._id && !product.id)) return;

    setRecentlyViewed((prev) => {
      const productId = product._id || product.id;
      const filtered = prev.filter((p) => (p._id || p.id) !== productId);
      const updated = [product, ...filtered].slice(0, 10);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn("Could not save recently viewed item", e);
      }

      return updated;
    });
  };

  return { recentlyViewed, addRecentlyViewed };
}
