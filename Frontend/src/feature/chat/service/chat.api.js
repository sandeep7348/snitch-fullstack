import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

/**
 * Send a conversation to the AI chat endpoint.
 * @param {Array<{role: string, content: string}>} messages
 * @returns {Promise<{message: string, role: string}>}
 */
export async function sendChatMessage(messages) {
  const response = await api.post("/api/chat", { messages });
  return response.data;
}
