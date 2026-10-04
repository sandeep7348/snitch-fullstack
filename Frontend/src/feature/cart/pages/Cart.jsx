import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  ShieldCheck, 
  Ticket,
  ChevronRight,
  Check,
  X,
  Sparkles
} from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";
import { useCart } from "../hooks/useCart";
import styles from "./cart.module.scss";

export const Cart = () => {
  const { user } = useAuth();
  const {
    cart,
    loading,
    handleRemoveFromCart,
    handleUpdateCartQuantity,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    calculateDiscount
  } = useCart();

  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState("");

  const subtotal = useMemo(() => {
    if (!cart?.products?.length) return 0;
    return cart.products.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    return calculateDiscount(subtotal);
  }, [subtotal, calculateDiscount]);

  const finalTotal = subtotal - discountAmount;

  const handleCouponApply = () => {
    applyCoupon(couponInput, subtotal);
  };

  return (
    <main className={styles.pageContainer}>
      <div className={styles.breadcrumbs}>
        <Link to="/">Home</Link>
        <ChevronRight size={14} />
        <Link to="/products">Shop</Link>
        <ChevronRight size={14} />
        <span>Shopping Cart</span>
      </div>

      <div className={styles.header}>
        <Link to="/products" className={styles.continueShopping}>
          <ArrowLeft size={16} /> Continue Shopping
        </Link>
        <h1 className={styles.title}>
          Shopping Cart <span className={styles.itemCount}>({cart?.products?.length || 0} items)</span>
        </h1>
      </div>

      {loading ? (
        <div className={styles.loadingState}>Loading your cart...</div>
      ) : !cart || !cart.products?.length ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyCartIcon}>
            <ShoppingBag size={48} />
          </div>
          <h2>Your Shopping Cart is Empty</h2>
          <p>Explore our luxury streetwear collections and add your favorite fits!</p>
          <Link to="/products" className={styles.primaryBtn}>Explore Streetwear</Link>
        </div>
      ) : (
        <div className={styles.cartLayout}>
          <div className={styles.cartList}>
            {cart.products.map((item) => (
              <div className={styles.cartItem} key={item.product?._id || item.product}>
                <div className={styles.itemImageWrapper}>
                  {item.product?.image ? (
                    <img src={item.product.image} alt={item.product.title} />
                  ) : (
                    <div className={styles.placeholderImage} />
                  )}
                </div>
                
                <div className={styles.itemDetails}>
                  <div className={styles.itemHeader}>
                    <h3 onClick={() => navigate(`/products/${item.product?._id}`)}>{item.product?.title}</h3>
                    <p className={styles.itemMeta}>Size: L | Color: Obsidian</p>
                    <p className={styles.itemPrice}>₹{item.product?.price}</p>
                  </div>

                  <div className={styles.itemActions}>
                    <div className={styles.quantityBox}>
                      <button 
                        onClick={() => handleUpdateCartQuantity(item.product?._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => handleUpdateCartQuantity(item.product?._id, item.quantity + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button 
                      className={styles.removeBtn}
                      onClick={() => handleRemoveFromCart(item.product?._id)}
                      title="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className={styles.orderSummary}>
            <h2>Order Summary</h2>
            
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            {discountAmount > 0 && (
              <div className={`${styles.summaryRow} ${styles.discountRow}`}>
                <span>Discount ({appliedCoupon?.code})</span>
                <span>-₹{discountAmount}</span>
              </div>
            )}

            <div className={styles.summaryRow}>
              <span>Express Delivery</span>
              <span className={styles.freeBadge}>FREE</span>
            </div>
            
            <div className={styles.totalRow}>
              <span>Total Payable</span>
              <span>₹{finalTotal}</span>
            </div>

            <button 
              className={styles.checkoutBtn}
              onClick={() => {
                if (!user) {
                  navigate("/login");
                } else {
                  navigate("/checkout");
                }
              }}
            >
              Proceed to Checkout — ₹{finalTotal}
            </button>

            {/* Promo Code Engine Section */}
            <div className={styles.couponSection}>
              <div className={styles.couponHeader}>
                <Ticket size={16} /> Have a promo code?
              </div>

              {appliedCoupon ? (
                <div className={styles.activeCouponTag}>
                  <div className={styles.couponInfo}>
                    <Check size={14} className={styles.checkIcon} />
                    <span><strong>{appliedCoupon.code}</strong> ({appliedCoupon.label})</span>
                  </div>
                  <button onClick={removeCoupon} className={styles.removeCouponBtn}>
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <div className={styles.couponInputGroup}>
                    <input 
                      type="text" 
                      placeholder="e.g. SNITCH10, AI20" 
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                    />
                    <button onClick={handleCouponApply}>Apply</button>
                  </div>
                  {couponError && <p className={styles.couponErrorText}>{couponError}</p>}
                </>
              )}

              <div className={styles.availableCoupons}>
                <span className={styles.couponHint}>Try:</span>
                <button onClick={() => applyCoupon("SNITCH10", subtotal)}>SNITCH10</button>
                <button onClick={() => applyCoupon("AI20", subtotal)}>AI20</button>
                <button onClick={() => applyCoupon("LUXURY500", subtotal)}>LUXURY500</button>
              </div>
            </div>

            <div className={styles.securityNotice}>
              <ShieldCheck size={18} /> 100% Encrypted & Secure Checkout
            </div>
          </aside>
        </div>
      )}
    </main>
  );
};

export default Cart;
