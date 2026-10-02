import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios from "axios";

// ---------------------------------------------------------------------------
// Config — change BASE_URL if your backend runs on a different host/port
// ---------------------------------------------------------------------------
const BASE_URL = process.env.SNITCH_API_URL ?? "http://localhost:3000";

const http = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
});

/** Attach a JWT cookie to authenticated requests */
function authHeaders(cookie) {
  return cookie ? { headers: { Cookie: cookie } } : {};
}

// ---------------------------------------------------------------------------
// MCP Server
// ---------------------------------------------------------------------------
const server = new McpServer({
  name: "snitch-api",
  version: "1.0.0",
  description: "MCP tools for the Snitch Fullstack e-commerce API",
});

// ─────────────────────────────────────────────────────────────────────────────
// AUTH TOOLS
// ─────────────────────────────────────────────────────────────────────────────

server.tool(
  "auth_register",
  "Register a new user account",
  {
    fullName: z.string().describe("User's full name"),
    email: z.string().email().describe("User's email address"),
    password: z.string().min(6).describe("Password (min 6 chars)"),
  },
  async ({ fullName, email, password }) => {
    try {
      const res = await http.post("/api/auth/register", { fullName, email, password });
      return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
    } catch (err) {
      return { content: [{ type: "text", text: `Error: ${err.response?.data?.message ?? err.message}` }] };
    }
  }
);

server.tool(
  "auth_login",
  "Login with email and password — returns a session cookie",
  {
    email: z.string().email().describe("Registered email"),
    password: z.string().describe("Account password"),
  },
  async ({ email, password }) => {
    try {
      const res = await http.post("/api/auth/login", { email, password });
      const setCookie = res.headers["set-cookie"]?.join("; ") ?? "";
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ ...res.data, _cookie: setCookie }, null, 2),
          },
        ],
      };
    } catch (err) {
      return { content: [{ type: "text", text: `Error: ${err.response?.data?.message ?? err.message}` }] };
    }
  }
);

server.tool(
  "auth_get_me",
  "Get the currently authenticated user's profile",
  {
    cookie: z.string().describe("Session cookie string from auth_login (_cookie field)"),
  },
  async ({ cookie }) => {
    try {
      const res = await http.get("/api/auth/getMe", authHeaders(cookie));
      return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
    } catch (err) {
      return { content: [{ type: "text", text: `Error: ${err.response?.data?.message ?? err.message}` }] };
    }
  }
);

server.tool(
  "auth_logout",
  "Log out the current user",
  {
    cookie: z.string().describe("Session cookie string"),
  },
  async ({ cookie }) => {
    try {
      const res = await http.post("/api/auth/logout", {}, authHeaders(cookie));
      return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
    } catch (err) {
      return { content: [{ type: "text", text: `Error: ${err.response?.data?.message ?? err.message}` }] };
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT TOOLS
// ─────────────────────────────────────────────────────────────────────────────

server.tool(
  "get_all_products",
  "Fetch a paginated list of all in-stock products",
  {
    page: z.number().int().min(1).default(1).describe("Page number (default: 1)"),
    limit: z.number().int().min(1).max(100).default(10).describe("Items per page (default: 10)"),
  },
  async ({ page, limit }) => {
    try {
      const res = await http.get(`/api/allpost?page=${page}&limit=${limit}`);
      return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
    } catch (err) {
      return { content: [{ type: "text", text: `Error: ${err.response?.data?.message ?? err.message}` }] };
    }
  }
);

server.tool(
  "get_product_by_id",
  "Fetch full details of a single product",
  {
    productId: z.string().describe("MongoDB ObjectId of the product"),
  },
  async ({ productId }) => {
    try {
      const res = await http.get(`/api/post/${productId}`);
      return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
    } catch (err) {
      return { content: [{ type: "text", text: `Error: ${err.response?.data?.message ?? err.message}` }] };
    }
  }
);

server.tool(
  "get_products_by_category",
  "Fetch paginated products for a specific category",
  {
    category: z.string().describe("Category name, e.g. 'T-SHIRTS'"),
    page: z.number().int().min(1).default(1).describe("Page number"),
    limit: z.number().int().min(1).max(100).default(10).describe("Items per page"),
  },
  async ({ category, page, limit }) => {
    try {
      const res = await http.get(`/api/category/${encodeURIComponent(category)}?page=${page}&limit=${limit}`);
      return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
    } catch (err) {
      return { content: [{ type: "text", text: `Error: ${err.response?.data?.message ?? err.message}` }] };
    }
  }
);

server.tool(
  "get_categories",
  "List all distinct product categories",
  {},
  async () => {
    try {
      const res = await http.get("/api/categories");
      return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
    } catch (err) {
      return { content: [{ type: "text", text: `Error: ${err.response?.data?.message ?? err.message}` }] };
    }
  }
);

server.tool(
  "search_products",
  "AI-powered semantic product search using Mistral embeddings + Pinecone",
  {
    query: z.string().describe("Natural-language search query, e.g. 'black oversized cotton t-shirt'"),
  },
  async ({ query }) => {
    try {
      const res = await http.post("/api/search", { query });
      return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
    } catch (err) {
      return { content: [{ type: "text", text: `Error: ${err.response?.data?.message ?? err.message}` }] };
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// CART TOOLS
// ─────────────────────────────────────────────────────────────────────────────

server.tool(
  "cart_get",
  "Get the current user's shopping cart",
  {
    cookie: z.string().describe("Session cookie string from auth_login"),
  },
  async ({ cookie }) => {
    try {
      const res = await http.get("/api/cart", authHeaders(cookie));
      return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
    } catch (err) {
      return { content: [{ type: "text", text: `Error: ${err.response?.data?.message ?? err.message}` }] };
    }
  }
);

server.tool(
  "cart_add",
  "Add a product to the cart (validates stock)",
  {
    cookie: z.string().describe("Session cookie string"),
    productId: z.string().describe("MongoDB ObjectId of the product"),
    quantity: z.number().int().min(1).default(1).describe("Quantity to add"),
  },
  async ({ cookie, productId, quantity }) => {
    try {
      const res = await http.post("/api/cart/add", { productId, quantity }, authHeaders(cookie));
      return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
    } catch (err) {
      return { content: [{ type: "text", text: `Error: ${err.response?.data?.message ?? err.message}` }] };
    }
  }
);

server.tool(
  "cart_remove",
  "Remove a specific product from the cart",
  {
    cookie: z.string().describe("Session cookie string"),
    productId: z.string().describe("MongoDB ObjectId of the product to remove"),
  },
  async ({ cookie, productId }) => {
    try {
      const res = await http.delete(`/api/cart/remove/${productId}`, authHeaders(cookie));
      return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
    } catch (err) {
      return { content: [{ type: "text", text: `Error: ${err.response?.data?.message ?? err.message}` }] };
    }
  }
);

server.tool(
  "cart_clear",
  "Clear all items from the current user's cart",
  {
    cookie: z.string().describe("Session cookie string"),
  },
  async ({ cookie }) => {
    try {
      const res = await http.delete("/api/cart/clear", authHeaders(cookie));
      return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
    } catch (err) {
      return { content: [{ type: "text", text: `Error: ${err.response?.data?.message ?? err.message}` }] };
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// Start
// ─────────────────────────────────────────────────────────────────────────────
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Snitch MCP Server running on stdio");
