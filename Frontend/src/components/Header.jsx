import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../feature/auth/hooks/useAuth";
import { useCart } from "../feature/cart/hooks/useCart";
import styles from "./header.module.scss";

export default function Header() {
  const { user } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const debounceRef = useRef();
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("search") || "";
    setSearchInput(query);
  }, [location.search]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (searchInput && searchInput.trim()) {
        navigate(`/products?search=${encodeURIComponent(searchInput.trim())}`);
      }
    }, 600);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchInput, navigate]);

  return (
    <header className={styles.topBar}>
      <div className={styles.leftSection}>
        <Link to="/" className={styles.brand}>Snitch</Link>
        <nav className={styles.navLinks}>
          <Link to="/" className={location.pathname === '/' ? styles.active : ''}>Home</Link>
          <Link to="/products" className={location.pathname.startsWith('/products') ? styles.active : ''}>Shop</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/deals">Deals</Link>
        </nav>
      </div>

      <div className={styles.rightSection}>
        <form
          className={styles.searchBox}
          onSubmit={(e) => {
            e.preventDefault();
            if (searchInput && searchInput.trim()) {
              navigate(`/products?search=${encodeURIComponent(searchInput.trim())}`);
            } else {
              navigate(`/products`);
            }
          }}
        >
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="search"
            placeholder="Search for products, brands, or categories..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>

        <div className={styles.actionRow}>
          <Link to="/wishlist" className={styles.iconButton} aria-label="Wishlist">❤️</Link>
          <Link to="/cart" className={styles.iconButton} aria-label="Cart">
            🛒
            {cart?.products?.length > 0 && (
              <span className={styles.cartBadge}>{cart.products.length}</span>
            )}
          </Link>
          
          {user ? (
            <Link to="/profile" className={styles.profileButton}>
              <span className={styles.avatar}>{user.fullName ? user.fullName[0].toUpperCase() : 'U'}</span>
            </Link>
          ) : (
            <div className={styles.authButtons}>
              <Link to="/login" className={styles.signInButton}>Sign In</Link>
              <Link to="/register" className={styles.signUpButton}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
