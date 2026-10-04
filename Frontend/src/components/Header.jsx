import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  Sparkles, 
  Menu, 
  X, 
  LogOut, 
  Package, 
  ShieldCheck,
  ChevronRight,
  Zap
} from "lucide-react";
import { useAuth } from "../feature/auth/hooks/useAuth";
import { useCart } from "../feature/cart/hooks/useCart";
import { useWishlist } from "../feature/wishlist/wishlist.context.jsx";
import styles from "./header.module.scss";

export default function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const debounceRef = useRef();
  
  const [searchInput, setSearchInput] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("search") || "";
    setSearchInput(query);
  }, [location.search]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchInput(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (val && val.trim()) {
        navigate(`/products?search=${encodeURIComponent(val.trim())}`);
      }
    }, 500);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (searchInput && searchInput.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchInput.trim())}`);
    } else {
      navigate(`/products`);
    }
  };

  const cartCount = cart?.products?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;
  const wishlistCount = wishlist?.length || 0;

  return (
    <>
      <header className={styles.topBar}>
        <div className={styles.container}>
          {/* Left Section: Brand & Nav */}
          <div className={styles.leftSection}>
            <button 
              className={styles.mobileMenuToggle} 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <Link to="/" className={styles.brand}>
              <span className={styles.brandText}>SNITCH</span>
              <span className={styles.brandBadge}>STUDIO</span>
            </Link>

            <nav className={styles.navLinks}>
              <Link 
                to="/" 
                className={location.pathname === '/' ? styles.active : ''}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className={location.pathname.startsWith('/products') ? styles.active : ''}
              >
                Shop All
              </Link>
              <Link 
                to="/products?category=Oversized" 
                className={location.search.includes('Oversized') ? styles.active : ''}
              >
                Oversized
              </Link>
              <Link 
                to="/ai-assistant" 
                className={`${styles.aiLink} ${location.pathname === '/ai-assistant' ? styles.activeAi : ''}`}
              >
                <Sparkles size={15} className={styles.aiSparkleIcon} />
                <span>AI Stylist</span>
                <span className={styles.livePulse}></span>
              </Link>
            </nav>
          </div>

          {/* Center: Search Box */}
          <div className={styles.centerSection}>
            <form className={styles.searchBox} onSubmit={handleSearchSubmit}>
              <Search size={18} className={styles.searchIcon} />
              <input
                type="search"
                placeholder="Search streetwear, cargo, hoodies..."
                value={searchInput}
                onChange={handleSearchChange}
              />
              {searchInput && (
                <button 
                  type="button" 
                  className={styles.clearSearch} 
                  onClick={() => { setSearchInput(''); navigate('/products'); }}
                >
                  <X size={14} />
                </button>
              )}
            </form>
          </div>

          {/* Right Section: Action Buttons */}
          <div className={styles.rightSection}>
            <Link 
              to="/wishlist" 
              className={styles.iconButton} 
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className={styles.badge}>{wishlistCount}</span>
              )}
            </Link>

            <Link 
              to="/cart" 
              className={styles.iconButton} 
              title="Cart"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className={`${styles.badge} ${styles.cartBadge}`}>{cartCount}</span>
              )}
            </Link>

            {user ? (
              <div className={styles.userMenuWrapper}>
                <button 
                  className={styles.profileButton}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className={styles.avatar}>
                    {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                  </div>
                  <span className={styles.userName}>{user.fullName ? user.fullName.split(' ')[0] : 'Account'}</span>
                </button>

                {userMenuOpen && (
                  <div className={styles.dropdownMenu}>
                    <div className={styles.dropdownHeader}>
                      <p className={styles.menuName}>{user.fullName || 'User'}</p>
                      <p className={styles.menuEmail}>{user.email || ''}</p>
                    </div>
                    <div className={styles.dropdownDivider} />
                    <Link to="/profile" className={styles.dropdownItem}>
                      <User size={16} /> Profile Details
                    </Link>
                    <Link to="/orders" className={styles.dropdownItem}>
                      <Package size={16} /> My Orders
                    </Link>
                    <Link to="/wishlist" className={styles.dropdownItem}>
                      <Heart size={16} /> My Wishlist
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" className={`${styles.dropdownItem} ${styles.adminItem}`}>
                        <ShieldCheck size={16} /> Admin Portal
                      </Link>
                    )}
                    <div className={styles.dropdownDivider} />
                    <button onClick={logout} className={`${styles.dropdownItem} ${styles.logoutBtn}`}>
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.authButtons}>
                <Link to="/login" className={styles.signInButton}>Sign In</Link>
                <Link to="/register" className={styles.signUpButton}>
                  <Zap size={14} /> Join Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenuDrawer}>
          <div className={styles.mobileSearchWrapper}>
            <form onSubmit={handleSearchSubmit}>
              <Search size={18} />
              <input
                type="search"
                placeholder="Search products..."
                value={searchInput}
                onChange={handleSearchChange}
              />
            </form>
          </div>
          <nav className={styles.mobileNav}>
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home <ChevronRight size={16} /></Link>
            <Link to="/products" onClick={() => setMobileMenuOpen(false)}>Shop All Products <ChevronRight size={16} /></Link>
            <Link to="/products?category=Oversized" onClick={() => setMobileMenuOpen(false)}>Oversized Collection <ChevronRight size={16} /></Link>
            <Link to="/products?category=Hoodies" onClick={() => setMobileMenuOpen(false)}>Hoodies & Sweatshirts <ChevronRight size={16} /></Link>
            <Link to="/ai-assistant" className={styles.mobileAiLink} onClick={() => setMobileMenuOpen(false)}>
              <span>🤖 AI Fashion Assistant</span> <ChevronRight size={16} />
            </Link>
            {user ? (
              <>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>My Profile <ChevronRight size={16} /></Link>
                <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>My Orders <ChevronRight size={16} /></Link>
                <button onClick={logout} className={styles.mobileLogout}>Logout</button>
              </>
            ) : (
              <div className={styles.mobileAuthRow}>
                <Link to="/login" className={styles.signInButton} onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                <Link to="/register" className={styles.signUpButton} onClick={() => setMobileMenuOpen(false)}>Create Account</Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
