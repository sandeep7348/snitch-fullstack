# 🛍️ Snitch Fullstack

A full-stack **MERN E-Commerce Application** inspired by the Snitch clothing brand. The project provides secure authentication, product management, cloud image uploads, **shopping cart functionality**, and **AI-powered semantic product search** using **Mistral AI Embeddings** and **Pinecone Vector Database**.

---

# 🚀 Features

## 🔐 Authentication

- User Registration
- User Login (JWT Authentication)
- Secure HTTP-only Cookies
- Logout
- Get Current User
- Protected Routes
- Google OAuth (In Progress)

---

## 📦 Product Management

- Create Product
- Update Product
- Delete Product
- Get All Products
- Get Product by ID
- Get Products by Category
- Get Distinct Categories
- Cloud Image Upload using ImageKit
- Product Stock Management

---

## 🛒 Shopping Cart

- Add Product to Cart
- Get Logged-in User Cart
- Remove Product from Cart
- Clear Cart
- Quantity Management
- Stock Validation before Adding Products
- Protected Cart APIs

---

## 🤖 AI Features

- AI-powered Semantic Product Search
- Product Embedding using Mistral AI Embeddings
- Vector Storage using Pinecone
- Automatic Embedding Generation when Product is Created
- Automatic Embedding Update when Product is Updated
- Automatic Vector Deletion when Product is Deleted
- Semantic Similarity Search using Vector Embeddings

---

## 🔒 Security

- JWT Authentication
- HTTP-only Cookies
- Password Hashing using bcrypt
- Protected REST APIs
- CORS Configuration

---

# 🛠 Tech Stack

## Frontend

- React
- Vite
- React Router
- Axios
- Tailwind CSS

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Multer
- ImageKit
- JWT
- Cookie Parser

## AI Stack

- LangChain
- Mistral AI Embeddings
- Pinecone Vector Database

---

# 📂 Project Structure

```text
snitch-fullstack/
│
├── Backend/
│   ├── src/
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── post.controller.js
│   │   └── cart.controller.js
│   │
│   ├── middleware/
│   │
│   ├── models/
│   │   ├── user.models.js
│   │   ├── post.models.js
│   │   └── cart.models.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── post.routes.js
│   │   └── cart.routes.js
│   │
│   ├── config/
│   ├── app.js
│   ├── package.json
│   └── .env
│
├── Frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# 📦 Installation

## Clone Repository

```bash
git clone https://github.com/sandeep7348/snitch-fullstack.git

cd snitch-fullstack
```

---

# Backend Setup

```bash
cd Backend

npm install
```

Create a **.env** file.

```env
PORT=3000

MONGODB_URL=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

IMAGE_KIT_PUBLIC_KEY=your_public_key
IMAGE_KIT_PRIVATE_KEY=your_private_key
IMAGE_KIT_URL_ENDPOINT=your_url_endpoint

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

MISTRAL_API_KEY=your_mistral_api_key

PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=your_pinecone_index_name
```

Run Backend

```bash
npm run dev
```

---

# Frontend Setup

```bash
cd Frontend

npm install

npm run dev
```

---

# REST API

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | `/api/auth/register` |
| POST | `/api/auth/login` |
| GET | `/api/auth/getMe` |
| POST | `/api/auth/logout` |

---

## Products

| Method | Endpoint |
|---------|----------|
| POST | `/api/post` |
| GET | `/api/allpost` |
| GET | `/api/post/:id` |
| PUT | `/api/post/:postId` |
| DELETE | `/api/post/:postId` |
| GET | `/api/category/:category` |
| GET | `/api/categories` |
| POST | `/api/search` |

---

## Shopping Cart

| Method | Endpoint |
|---------|----------|
| POST | `/api/cart/add` |
| GET | `/api/cart` |
| DELETE | `/api/cart/remove/:postId` |
| DELETE | `/api/cart/clear` |

---

# AI Semantic Search

Every product is converted into a vector embedding using **Mistral AI Embeddings**.

The embedding is stored in **Pinecone** along with product metadata.

When a user searches for a product:

- The search query is converted into an embedding.
- Pinecone performs semantic similarity search.
- Matching product IDs are returned.
- Complete product details are fetched from MongoDB.
- Relevant products are returned to the user.

---

## Product Creation Flow

```text
Admin Creates Product
        │
        ▼
 Upload Image (ImageKit)
        │
        ▼
 Save Product (MongoDB)
        │
        ▼
 Generate Embedding (Mistral AI)
        │
        ▼
 Store Vector (Pinecone)
```

---

## Shopping Cart Flow

```text
User Login
      │
      ▼
Browse Products
      │
      ▼
Click Add to Cart
      │
      ▼
Authenticate User
      │
      ▼
Check Product Availability
      │
      ▼
Validate Stock
      │
      ▼
Create Cart / Update Existing Cart
      │
      ▼
Save Cart in MongoDB
      │
      ▼
Return Updated Cart
```

---

## Semantic Search Flow

```text
User Search Query
        │
        ▼
Generate Query Embedding
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
```

---

## Example Search Request

```json
{
  "query": "black oversized cotton t-shirt"
}
```

---

## Example Search Queries

- oversized black t-shirt
- formal white shirt
- winter hoodie
- casual streetwear
- denim jeans
- cotton summer shirt
- cargo pants
- office wear
- premium men's clothing
- comfortable everyday clothes

---

# Image Upload

Product images are uploaded to **ImageKit**.

Only the secure image URL is stored in MongoDB.

---

# Authentication Flow

```text
Register/Login
      │
      ▼
Generate JWT
      │
      ▼
Store HTTP-only Cookie
      │
      ▼
Access Protected APIs
```

---

# Upcoming Features

- Order Management
- Stripe / Razorpay Integration
- Wishlist
- AI Shopping Assistant
- Personalized Product Recommendations
- Product Filtering & Sorting
- Pagination
- Product Reviews & Ratings
- Admin Dashboard
- User Profile Management
- Google OAuth Authentication

---

# Author

**Sandeep Choudhary**

GitHub: https://github.com/sandeep7348

---

⭐ If you found this project useful, consider giving it a star on GitHub!
