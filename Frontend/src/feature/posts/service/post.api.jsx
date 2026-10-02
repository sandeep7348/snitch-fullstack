import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export async function getAllProducts(page = 1, limit = 10) {
  const response = await api.get(`/api/allpost?page=${page}&limit=${limit}`);
  return response.data || { posts: [], totalPages: 1, currentPage: 1, totalPosts: 0 };
}

export async function getProductById(productId) {
  const response = await api.get(`/api/post/${productId}`);
  return response.data?.post || null;
}

export async function getCategories() {
  const response = await api.get("/api/categories");
  return response.data?.categories || [];
}

export async function getProductsByCategory(category, page = 1, limit = 10) {
  if (!category || category === "Discover") {
    return getAllProducts(page, limit);
  }
  const response = await api.get(`/api/category/${category}?page=${page}&limit=${limit}`);
  return response.data || { posts: [], totalPages: 1, currentPage: 1, totalPosts: 0 };
}

export async function searchProducts(query) {
  console.debug("post.api.searchProducts: request", { query });
  // backend expects { query } in the body
  const response = await api.post("/api/search", { query });
  console.debug("post.api.searchProducts: response", { status: response.status, data: response.data });
  const data = response.data || {};
  return {
    posts: data.products || [],
    totalPages: 1,
    currentPage: 1,
    totalPosts: data.totalProducts || 0
  };
}
