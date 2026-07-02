import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export async function getCart() {
  const response = await api.get("/api/cart/");
  return response.data;
}

export async function addToCart(postId, quantity = 1) {
  const response = await api.post("/api/cart/add", { postId, quantity });
  return response.data;
}

export async function updateCartQuantity(postId, quantity) {
  const response = await api.put(`/api/cart/update/${postId}`, { quantity });
  return response.data;
}

export async function removeFromCart(postId) {
  const response = await api.delete(`/api/cart/remove/${postId}`);
  return response.data;
}

export async function clearCart() {
  const response = await api.delete("/api/cart/clear");
  return response.data;
}
