import { api } from "../../cart/service/cart.api"; // Re-using axios instance from cart.api.jsx

export async function getWishlist() {
  const response = await api.get("/api/wishlist");
  return response.data;
}

export async function toggleWishlistApi(postId) {
  const response = await api.post("/api/wishlist/toggle", { postId });
  return response.data;
}
