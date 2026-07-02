import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export async function placeOrder(payload) {
  const response = await api.post("/api/orders/", payload);
  return response.data;
}

export async function getOrders() {
  const response = await api.get("/api/orders/");
  return response.data?.orders || [];
}

export async function getOrderById(orderId) {
  const response = await api.get(`/api/orders/${orderId}`);
  return response.data;
}

export async function cancelOrder(orderId) {
  const response = await api.put(`/api/orders/cancel/${orderId}`);
  return response.data;
}
