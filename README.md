# 🛍️ Snitch Fullstack

A full-stack **MERN E-Commerce Application** inspired by the Snitch clothing brand.  
Built with secure authentication, product management, cloud image uploads, shopping cart, **AI-powered semantic search** (Mistral AI + Pinecone), **server-side pagination**, and an **MCP tool server** for AI-agent integration.

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
- Quantity Management
- Stock Validation before Adding
- Clear Cart
- Protected Cart APIs

### 🔍 Pagination
- `GET /api/allpost?page=1&limit=10`
- `GET /api/category/:category?page=1&limit=10`
- Response includes `totalPosts`, `totalPages`, `currentPage`
- Frontend Prev / Next controls

### 🤖 AI Features
- Semantic Product Search using **Mistral AI Embeddings**
- Vector Storage & Similarity Search via **Pinecone**
- Automatic Embedding Generation on Product Create / Update
- Automatic Vector Deletion on Product Delete
- Regex text-search fallback if vector results are empty

### 🛠️ MCP Tools (AI Agent Integration)
An **MCP (Model Context Protocol) server** exposes all backend APIs as structured tools for AI agents (e.g., Antigravity IDE, Claude Desktop, etc.).

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
| `cart_remove` | Remove item from cart |
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
- LangChain
- Mistral AI Embeddings
- Pinecone Vector Database

### MCP Server
- [@modelcontextprotocol/sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk)
- Axios
- Zod (input validation)

---

## 📂 Project Structure

```text
snitch-fullstack/
│
├── Backend/
│   └── src/
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── post.controller.js     ← pagination added
│       │   └── cart.controller.js
│       ├── middleware/
│       ├── models/
│       │   ├── user.models.js
│       │   ├── post.models.js
│       │   └── cart.models.js
│       ├── routes/
│       │   ├── auth.routes.js
│       │   ├── post.routes.js
│       │   └── cart.routes.js
│       └── config/
│
├── Frontend/
│   └── src/
│       ├── feature/
│       │   ├── posts/
│       │   │   ├── pages/Products.jsx  ← pagination UI
│       │   │   ├── posts.context.jsx   ← currentPage/totalPages state
│       │   │   └── service/post.api.jsx
│       │   ├── cart/
│       │   └── auth/
│       └── components/
│
├── mcp-server/                         ← NEW
│   ├── index.js                        ← 13 MCP tools
│   └── package.json
│
├── .agents/
│   └── mcp_config.json                 ← Antigravity IDE auto-load
│
└── README.md
```

---

## 📦 Installation

### Clone Repository

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

Run the backend:

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

> The MCP server defaults to `http://localhost:3000`.  
> To override: `set SNITCH_API_URL=http://your-host:port`

### Auto-load in Antigravity IDE

The `.agents/mcp_config.json` file is automatically discovered by the Antigravity IDE.  
Restart the IDE after cloning — tools will appear under **... → MCP Servers**.

---

## 🌐 REST API

### Authentication

| Method | Endpoint |
|--------|----------|
| POST | `/api/auth/register` |
| POST | `/api/auth/login` |
| GET  | `/api/auth/getMe` |
| POST | `/api/auth/logout` |

### Products

| Method | Endpoint | Pagination |
|--------|----------|-----------|
| POST   | `/api/post` | — |
| GET    | `/api/allpost` | `?page=1&limit=10` |
| GET    | `/api/post/:id` | — |
| PUT    | `/api/post/:postId` | — |
| DELETE | `/api/post/:postId` | — |
| GET    | `/api/category/:category` | `?page=1&limit=10` |
| GET    | `/api/categories` | — |
| POST   | `/api/search` | — |

### Shopping Cart

| Method | Endpoint |
|--------|----------|
| POST   | `/api/cart/add` |
| GET    | `/api/cart` |
| DELETE | `/api/cart/remove/:postId` |
| DELETE | `/api/cart/clear` |

---

## 🔍 AI Semantic Search

Every product is converted to a vector embedding using **Mistral AI**.  
Embeddings are stored in **Pinecone** with product metadata.

**Search Flow:**

```
User Query
    │
    ▼
Generate Query Embedding (Mistral AI)
    │
    ▼
Pinecone Similarity Search
    │
    ▼
Retrieve Matching Product IDs
    │
    ▼
Fetch Products from MongoDB
    │
    ▼
Return Relevant Products
         ── if no vector results ──▶ Regex text-search fallback
```

**Example request:**

```json
POST /api/search
{ "query": "black oversized cotton t-shirt" }
```

**Example queries:**
- oversized black t-shirt
- formal white shirt
- winter hoodie
- casual streetwear
- cargo pants
- premium men's clothing

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
- [ ] Stripe / Razorpay Integration
- [ ] Wishlist
- [ ] AI Shopping Assistant
- [ ] Personalized Product Recommendations
- [ ] Product Filtering & Sorting
- [ ] Product Reviews & Ratings
- [ ] Admin Dashboard
- [ ] User Profile Management
- [ ] Google OAuth Authentication
- [ ] Input validation middleware (Zod / express-validator)
- [ ] Rate limiting
- [ ] Unit & Integration Tests

---

## 👤 Author

**Sandeep Choudhary**  
GitHub: [github.com/sandeep7348](https://github.com/sandeep7348)

---

⭐ If you found this project useful, consider giving it a star on GitHub!
