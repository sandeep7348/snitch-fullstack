import React, { createContext, useContext, useEffect, useState } from "react";
import { getWishlist, toggleWishlistApi } from "./service/wishlist.api";
import { useAuth } from "../auth/hooks/useAuth";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  const loadWishlist = async () => {
    try {
      const data = await getWishlist();
      setWishlist(data.wishlist || []);
    } catch (error) {
      console.error("Failed to load wishlist", error);
    }
  };

  const toggleWishlist = async (product) => {
    if (!user) {
      alert("Please login to use the wishlist.");
      return;
    }
    
    // Optimistic UI update
    const isSaved = wishlist.some(item => item._id === product._id);
    let previousWishlist = [...wishlist];
    
    if (isSaved) {
      setWishlist(wishlist.filter(item => item._id !== product._id));
    } else {
      setWishlist([...wishlist, product]);
    }

    try {
      await toggleWishlistApi(product._id);
    } catch (error) {
      console.error("Failed to toggle wishlist", error);
      // Revert on failure
      setWishlist(previousWishlist);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item._id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
