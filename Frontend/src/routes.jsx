import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Home } from "./feature/auth/pages/home.jsx"
import { Register } from "./feature/auth/pages/register.jsx"
import { Login } from "./feature/auth/pages/login.jsx"
import { Dashboard } from "./feature/auth/pages/dashboard.jsx"
import RequireAuth from "./feature/auth/RequireAuth.jsx"

export function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
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
