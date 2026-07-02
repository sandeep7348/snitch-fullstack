import React, { useEffect, useRef, useState } from "react";
import SideMenu from "./SideMenu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../feature/auth/hooks/useAuth";
import { useCart } from "../feature/cart/hooks/useCart";
import styles from "./header.module.scss";

export default function Header() {
  const { user, handleLogout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const debounceRef = useRef();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("search") || "";
    setSearchInput(query);
  }, [location.search]);

  useEffect(() => {
    // debounce navigation when typing in search box
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      console.debug("Header.search debounce navigate", { searchInput });
      if (searchInput && searchInput.trim()) {
        navigate(`/products?search=${encodeURIComponent(searchInput.trim())}`);
      }
    }, 600);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchInput, navigate]);

  return (
    <>
      <header className={styles.topBar}>
        <button className={styles.menuButton} aria-label="Open menu" onClick={() => setIsMenuOpen(true)}>
          <span />
          <span />
          <span />
        </button>

        <div className={styles.brandRow}>
          <div className={styles.brand}>SNITCH</div>
          <div className={styles.locationText}>Enter Pincode - <Link to="/" className={styles.link}>to check delivery</Link></div>
        </div>

        <div className={styles.actionRow}>
        <form
          className={styles.searchBox}
          onSubmit={(e) => {
            e.preventDefault();
            console.debug("Header.search submit", { searchInput });
            if (searchInput && searchInput.trim()) {
              navigate(`/products?search=${encodeURIComponent(searchInput.trim())}`);
            } else {
              navigate(`/products`);
            }
          }}
          role="search"
        >
          <button type="submit" className={styles.searchIcon} aria-label="Search">🔍</button>
          <input
            type="search"
            placeholder="Search 'POLO T-SHIRTS'"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>

        {user ? (
          <>
            <button className={styles.logoutButton} onClick={() => handleLogout()}>
              Logout
            </button>
            <Link to="/cart" className={styles.iconButton} aria-label="Cart">
              🛒
              {cart?.products?.length > 0 ? (
                <span className={styles.cartBadge}>{cart.products.length}</span>
              ) : null}
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className={styles.iconButton} aria-label="Account">👤</Link>
            <Link to="/cart" className={styles.iconButton} aria-label="Cart">🛒</Link>
          </>
        )}
      </div>
    </header>
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
