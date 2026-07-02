import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export async function getAllProducts() {
  const response = await api.get("/api/allpost");
  return response.data?.posts || [];
}

export async function getProductById(productId) {
  const response = await api.get(`/api/post/${productId}`);
  return response.data?.post || null;
}

export async function getCategories() {
  const response = await api.get("/api/categories");
  return response.data?.categories || [];
}

export async function getProductsByCategory(category) {
  if (!category || category === "Discover") {
    return getAllProducts();
  }
  const response = await api.get(`/api/category/${category}`);
  return response.data?.posts || [];
}

export async function searchProducts(query) {
  console.debug("post.api.searchProducts: request", { query });
  // backend expects { query } in the body
  const response = await api.post("/api/search", { query });
  console.debug("post.api.searchProducts: response", { status: response.status, data: response.data });
  // backend returns { products }
  return response.data?.products || [];
}
