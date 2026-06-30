# 🛍️ Snitch Fullstack

A full-stack MERN e-commerce application inspired by the Snitch clothing brand. The project provides secure authentication, product management, cloud image uploads, and AI-powered semantic search using Mistral Embeddings and Pinecone.

---

## 🚀 Features

### Authentication
- User Registration
- User Login (JWT Authentication)
- Secure HTTP-only Cookies
- Logout
- Get Current User
- Google OAuth Login (Coming Soon)

### Product Management
- Create Product
- Update Product
- Delete Product
- Get All Products
- Get Product by ID
- Get Products by Category
- Get Distinct Categories
- Cloud Image Upload using ImageKit

### AI Features
- Product Embedding using Mistral AI Embeddings
- Vector Storage using Pinecone
- Automatic Embedding Generation on Product Creation
- Automatic Embedding Update on Product Modification
- Automatic Vector Deletion on Product Removal
- Semantic Product Search (Coming Soon)

### Security
- JWT Authentication
- Protected Routes
- Password Hashing with bcrypt
- HTTP-only Cookies
- CORS Configuration

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- React Router
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Multer
- ImageKit
- Cookie Parser

### AI Stack
- LangChain
- Mistral AI Embeddings
- Pinecone Vector Database

---

## 📂 Project Structure

```text
snitch-fullstack/
│
├── Backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── config/
│   │   └── app.js
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

## 📦 Installation

### Clone Repository

```bash
git clone https://github.com/sandeep7348/snitch-fullstack.git
cd snitch-fullstack
```

---

## Backend Setup

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

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

MISTRAL_API_KEY=your_mistral_api_key

PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=your_pinecone_index_name
```

Run the backend:

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

---

## REST API

### Authentication

| Method | Endpoint |
|--------|----------|
| POST | `/api/auth/register` |
| POST | `/api/auth/login` |
| GET | `/api/auth/getMe` |
| POST | `/api/auth/logout` |

---

### Products

| Method | Endpoint |
|--------|----------|
| POST | `/api/post` |
| GET | `/api/allpost` |
| GET | `/api/post/:id` |
| PUT | `/api/post/:postId` |
| DELETE | `/api/post/:postId` |
| GET | `/api/category/:category` |
| GET | `/api/categories` |

---

## AI Architecture

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

### Semantic Search (Coming Soon)

```text
User Query
      │
      ▼
Generate Query Embedding
      │
      ▼
Pinecone Similarity Search
      │
      ▼
Retrieve Product IDs
      │
      ▼
Fetch Product Details from MongoDB
      │
      ▼
Return Matching Products
```

---

## Image Upload

Product images are uploaded to **ImageKit** and their URLs are stored in MongoDB.

---

## Authentication Flow

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
Access Protected Routes
```

---

## Upcoming Features

- Semantic Product Search
- AI Shopping Assistant
- Product Search & Filtering
- Product Pagination
- Wishlist
- Shopping Cart
- Orders
- Stripe/Razorpay Integration
- Admin Dashboard
- User Profile
- Forgot Password
- Product Reviews
- Google OAuth Authentication

---

## Author

**Sandeep Choudhary**

GitHub: https://github.com/sandeep7348
