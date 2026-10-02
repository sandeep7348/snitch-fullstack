# 🛍️ Snitch Fullstack

A full-stack **MERN E-Commerce Application** inspired by the Snitch clothing brand.  
Built with secure authentication, product management, cloud image uploads, shopping cart, **AI-powered semantic search**, **server-side pagination**, an **AI Shopping Assistant chatbot**, and an **MCP tool server** for AI-agent integration.

---

## 🚀 Features

### 🔐 Authentication
- User Registration & Login (JWT + HTTP-only Cookies)
- Logout & Get Current User
- Protected Routes

### 📦 Product Management
- Create / Update / Delete Products (protected)
- Get All Products *(paginated)*
- Get Product by ID
- Get Products by Category *(paginated)*
- Get Distinct Categories
- Cloud Image Upload via **ImageKit**
- Product Stock Management

### 🛒 Shopping Cart
- Add / Remove Products
- Quantity Management & Stock Validation
- Clear Cart
- Protected Cart APIs

### 📄 Pagination
- `GET /api/allpost?page=1&limit=10`
- `GET /api/category/:category?page=1&limit=10`
- Response includes `totalPosts`, `totalPages`, `currentPage`
- Frontend Prev / Next controls

### 🤖 AI Shopping Assistant (Chatbot)
A floating chat widget powered by **Mistral AI function calling** — available on every page.

**What the bot can do:**
- 🔍 **Semantic product search** — "Show me black oversized t-shirts"
- 📂 **Browse by category** — "What hoodies do you have?"
- 📋 **Product details** — Fetch full info for any product
- ⚖️ **Compare products** — Side-by-side comparison
- 👗 **Outfit suggestions** — "Suggest a casual summer outfit"
- 💬 **Multi-turn conversation** — Remembers context across messages

**Agentic architecture:**
- Uses **Mistral `mistral-small-latest`** with native function calling
- 5 backend tools the AI autonomously invokes
- Agentic loop — AI chains multiple tool calls in a single response
- Fallback to text search if vector results are empty

### 🔍 AI Semantic Search
- Product embeddings via **Mistral AI Embeddings**
- Vector Storage & Similarity Search via **Pinecone**
- Auto-embed on product Create / Update
- Auto-delete vector on product Delete
- Regex text-search fallback

### 🛠️ MCP Tools (AI Agent Integration)
An **MCP (Model Context Protocol) server** exposes all backend APIs as structured tools for AI agents (Antigravity IDE, Claude Desktop, etc.).

| Tool | Description |
|---|---|
| `auth_register` | Register a new user |
| `auth_login` | Login and receive session cookie |
| `auth_get_me` | Get current user profile |
| `auth_logout` | Logout |
| `get_all_products` | Paginated product list |
| `get_product_by_id` | Single product detail |
| `get_products_by_category` | Paginated by category |
| `get_categories` | All distinct categories |
| `search_products` | AI semantic search |
| `cart_get` | View cart |
| `cart_add` | Add item to cart |
| `cart_remove` | Remove item |
| `cart_clear` | Clear entire cart |

### 🔒 Security
- JWT Authentication with HTTP-only Cookies
- Password Hashing (bcrypt)
- Protected REST APIs
- CORS Configuration

---

## 🛠 Tech Stack

### Frontend
- React + Vite
- React Router
- Axios
- CSS Modules + SCSS

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- Multer + ImageKit
- JWT + Cookie Parser

### AI Stack
- **Mistral AI** — Embeddings + Chat Completions (function calling)
- **LangChain** — Embedding integration
- **Pinecone** — Vector database

### MCP Server
- [`@modelcontextprotocol/sdk`](https://www.npmjs.com/package/@modelcontextprotocol/sdk)
- Axios + Zod

---

## 📂 Project Structure

```text
snitch-fullstack/
│
├── Backend/
│   └── src/
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── post.controller.js       ← pagination
│       │   ├── cart.controller.js
│       │   └── chat.controller.js       ← AI chatbot (NEW)
│       ├── routes/
│       │   ├── auth.routes.js
│       │   ├── post.routes.js
│       │   ├── cart.routes.js
│       │   └── chat.routes.js           ← NEW
│       ├── models/
│       │   ├── user.models.js
│       │   ├── post.models.js
│       │   └── cart.models.js
│       ├── middleware/
│       └── config/
│
├── Frontend/
│   └── src/
│       ├── App.jsx                      ← ChatBot mounted globally
│       ├── feature/
│       │   ├── chat/                    ← NEW
│       │   │   ├── ChatBot.jsx          ← Floating chat UI
│       │   │   ├── ChatBot.module.scss
│       │   │   ├── hooks/useChat.js
│       │   │   └── service/chat.api.js
│       │   ├── posts/
│       │   │   ├── pages/Products.jsx   ← pagination UI
│       │   │   ├── posts.context.jsx
│       │   │   └── service/post.api.jsx
│       │   ├── cart/
│       │   └── auth/
│       └── components/
│
├── mcp-server/
│   ├── index.js                         ← 13 MCP tools
│   └── package.json
│
├── .agents/
│   └── mcp_config.json                  ← Antigravity IDE auto-load
│
└── README.md
```

---

## 📦 Installation

```bash
git clone https://github.com/sandeep7348/snitch-fullstack.git
cd snitch-fullstack
```

---

## 🖥️ Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file:

```env
PORT=3000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

IMAGE_KIT_PUBLIC_KEY=your_public_key
IMAGE_KIT_PRIVATE_KEY=your_private_key
IMAGE_KIT_URL_ENDPOINT=your_url_endpoint

MISTRAL_API_KEY=your_mistral_api_key

PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=your_pinecone_index_name
```

Run:

```bash
npm run dev
```

---

## 🌐 Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

---

## 🤖 MCP Server Setup

```bash
cd mcp-server
npm install
npm start
```

> Defaults to `http://localhost:3000`.  
> Override: `set SNITCH_API_URL=http://your-host:port`

The `.agents/mcp_config.json` is auto-discovered by Antigravity IDE — restart IDE to activate.

---

## 🌐 REST API Reference

### Authentication

| Method | Endpoint |
|--------|----------|
| POST | `/api/auth/register` |
| POST | `/api/auth/login` |
| GET  | `/api/auth/getMe` |
| POST | `/api/auth/logout` |

### Products

| Method | Endpoint | Query Params |
|--------|----------|-------------|
| POST   | `/api/post` | — |
| GET    | `/api/allpost` | `page`, `limit` |
| GET    | `/api/post/:id` | — |
| PUT    | `/api/post/:postId` | — |
| DELETE | `/api/post/:postId` | — |
| GET    | `/api/category/:category` | `page`, `limit` |
| GET    | `/api/categories` | — |
| POST   | `/api/search` | — |

### Shopping Cart

| Method | Endpoint |
|--------|----------|
| POST   | `/api/cart/add` |
| GET    | `/api/cart` |
| DELETE | `/api/cart/remove/:postId` |
| DELETE | `/api/cart/clear` |

### AI Chatbot

| Method | Endpoint | Body |
|--------|----------|------|
| POST | `/api/chat` | `{ messages: [{role, content}] }` |

---

## 💬 Chatbot Usage

The chatbot uses **multi-turn conversation** with an agentic tool-calling loop.

**Request format:**
```json
POST /api/chat
{
  "messages": [
    { "role": "user", "content": "Show me black t-shirts" }
  ]
}
```

**Response:**
```json
{
  "role": "assistant",
  "message": "Here are some great black t-shirts from our collection! ..."
}
```

**Example prompts:**
- `"Show me black oversized t-shirts"`
- `"What categories do you have?"`
- `"Suggest a casual outfit under ₹2000"`
- `"Compare [Product A] and [Product B]"`
- `"What's in stock in the hoodies section?"`
- `"Best products for office wear"`

**Chatbot tools (backend):**

| Tool | Trigger phrase |
|---|---|
| `search_products` | "find", "show me", "search" |
| `get_products_by_category` | category names |
| `get_product_details` | "tell me more about..." |
| `compare_products` | "compare X and Y" |
| `get_all_categories` | "what types", "what categories" |

---

## 📖 Paginated Response Shape

```json
{
  "message": "All Posts Fetched Successfully",
  "totalPosts": 48,
  "totalPages": 5,
  "currentPage": 2,
  "posts": [ ... ]
}
```

---

## 🔍 AI Semantic Search Flow

```
User Query
    │
    ▼
Generate Embedding (Mistral AI)
    │
    ▼
Pinecone Similarity Search
    │
    ▼
Fetch Products from MongoDB
    │
    ▼
Return Relevant Products
    │ (if no results)
    ▼
Regex Text-Search Fallback
```

---

## 🛡️ Authentication Flow

```
Register / Login
      │
      ▼
Generate JWT
      │
      ▼
Store in HTTP-only Cookie
      │
      ▼
Access Protected APIs
```

---

## 🗺️ Upcoming Features

- [ ] Order Management
- [ ] Stripe / Razorpay Payment Integration
- [ ] Wishlist / Saved Items
- [ ] Personalized AI Recommendations
- [ ] Product Filtering & Sorting
- [ ] Product Reviews & Ratings
- [ ] Admin Dashboard
- [x] User Profile Management
- [ ] Google OAuth Authentication
- [x] Input Validation Middleware
- [ ] Rate Limiting
- [ ] Unit & Integration Tests
- [ ] Docker Compose Setup

---

## 👤 Author

**Sandeep Choudhary**  
GitHub: [github.com/sandeep7348](https://github.com/sandeep7348)

---

⭐ If you found this project useful, consider giving it a star on GitHub!
