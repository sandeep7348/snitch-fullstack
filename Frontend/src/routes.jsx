import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Home } from "./feature/auth/pages/home.jsx"
import { Register } from "./feature/auth/pages/register.jsx"
import { Login } from "./feature/auth/pages/login.jsx"
import { Dashboard } from "./feature/auth/pages/dashboard.jsx"
import RequireAuth from "./feature/auth/RequireAuth.jsx"
import { Products } from "./feature/posts/pages/Products.jsx"
import  ProductDetail  from "./feature/posts/pages/ProductDetail.jsx"
import { Cart } from "./feature/cart/pages/Cart.jsx"
import { Orders } from "./feature/orders/pages/Orders.jsx"
import Header from "./components/Header.jsx"

export function AppRoutes() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
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
      </Routes>
    </Router>
  )
}
