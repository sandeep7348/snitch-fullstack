# 🛍️ Snitch Fullstack

A full-stack MERN e-commerce application inspired by the Snitch clothing brand. This project allows users to browse products, authenticate securely, and manage products through a modern REST API.

---

## 🚀 Features

### Authentication

* User Registration
* User Login (JWT Authentication)
* Secure HTTP-only Cookies
* Logout
* Get Current User
* Google OAuth Login (In Progress)

### Product Management

* Create Product
* Update Product
* Delete Product
* Get All Products
* Get Product by ID
* Get Products by Category
* Get Distinct Categories
* Image Upload using ImageKit

### Security

* JWT Authentication
* Protected Routes
* Password Hashing with bcrypt
* Cookie Parser
* CORS Configuration

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* React Router
* Axios
* Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Multer
* ImageKit
* Cookie Parser

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
│   │
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

| Method | Endpoint             |
| ------ | -------------------- |
| POST   | `/api/auth/register` |
| POST   | `/api/auth/login`    |
| GET    | `/api/auth/getMe`    |
| POST   | `/api/auth/logout`   |

---

### Products

| Method | Endpoint                  |
| ------ | ------------------------- |
| POST   | `/api/post`               |
| GET    | `/api/allpost`            |
| GET    | `/api/post/:id`           |
| PUT    | `/api/post/:postId`       |
| DELETE | `/api/post/:postId`       |
| GET    | `/api/category/:category` |
| GET    | `/api/categories`         |

---

## Image Upload

Images are uploaded using **ImageKit**.

Uploaded images are stored securely in the cloud and their URLs are saved in MongoDB.

---

## Authentication Flow

```text
Register/Login
      │
      ▼
Generate JWT
      │
      ▼
Store Token in HTTP-only Cookie
      │
      ▼
Protected Routes
```

---

## Upcoming Features

* Google Authentication
* Product Search
* Product Pagination
* Product Filtering
* Wishlist
* Shopping Cart
* Orders
* Razorpay/Stripe Integration
* Admin Dashboard
* User Profile Update
* Forgot Password
* Product Reviews

---

## Author

**Sandeep Choudhary**

GitHub: https://github.com/sandeep7348

---

## License

This project is created for learning and portfolio purposes.
