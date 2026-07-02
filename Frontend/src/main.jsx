import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import AuthProvider from "./feature/auth/auth.context.jsx";
import PostsProvider from "./feature/posts/posts.context.jsx";
import CartProvider from "./feature/cart/cart.context.jsx";
import OrdersProvider from "./feature/orders/orders.context.jsx";
import CommentsProvider from "./feature/comment/comment.context.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <PostsProvider>
        <CartProvider>
          <OrdersProvider>
            <CommentsProvider>
              <App />
            </CommentsProvider>
          </OrdersProvider>
        </CartProvider>
      </PostsProvider>
    </AuthProvider>
  </StrictMode>
);