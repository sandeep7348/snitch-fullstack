import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { Home } from "./feature/auth/pages/home.jsx"
import { Register } from "./feature/auth/pages/register.jsx"
import { Login } from "./feature/auth/pages/login.jsx"
import { Dashboard } from "./feature/auth/pages/dashboard.jsx"
import Profile from "./feature/auth/pages/Profile.jsx"
import RequireAuth from "./feature/auth/RequireAuth.jsx"
import { Products } from "./feature/posts/pages/Products.jsx"
import ProductDetail from "./feature/posts/pages/ProductDetail.jsx"
import { Cart } from "./feature/cart/pages/Cart.jsx"
import { Checkout } from "./feature/cart/pages/Checkout.jsx"
import { Orders } from "./feature/orders/pages/Orders.jsx"
import AiAssistant from "./feature/chat/pages/AiAssistant.jsx"
import { AdminDashboard } from "./feature/admin/pages/AdminDashboard.jsx"
import { AdminProducts } from "./feature/admin/pages/AdminProducts.jsx"
import { Wishlist } from "./feature/wishlist/pages/Wishlist.jsx"
import Header from "./components/Header.jsx"
import ChatBot from "./feature/chat/ChatBot.jsx"

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
}

export function AppRoutes() {
  return (
    <Router>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<Products />} />
        <Route path="/categories" element={<Navigate to="/products" replace />} />
        <Route path="/deals" element={<Navigate to="/products" replace />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route
          path="/checkout"
          element={
            <RequireAuth>
              <Checkout />
            </RequireAuth>
          }
        />
        <Route
          path="/orders"
          element={
            <RequireAuth>
              <Orders />
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route path="/ai-assistant" element={<AiAssistant />} />
        
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/products"
          element={
            <RequireAuth>
              <AdminProducts />
            </RequireAuth>
          }
        />
      </Routes>
      <ChatBot />
    </Router>
  )
}

