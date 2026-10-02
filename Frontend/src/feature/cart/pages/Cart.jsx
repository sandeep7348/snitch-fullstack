import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  } = useCart();

  const navigate = useNavigate();

  const totalAmount = useMemo(() => {
    if (!cart?.products?.length) return 0;
    return cart.products.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  }, [cart]);

  return (
    <main className={styles.pageContainer}>
      <div className={styles.breadcrumbs}>
        <Link to="/">Home</Link> &gt; <Link to="/products">Shop</Link> &gt; <Link to="/categories">Categories</Link> &gt; <span>Cart</span>
      </div>

      <div className={styles.header}>
        <Link to="/products" className={styles.continueShopping}>
          &larr; Continue Shopping
        </Link>
        <h1 className={styles.title}>Shopping Cart <span className={styles.itemCount}>({cart?.products?.length || 0} items)</span></h1>
      </div>

      {loading ? (
        <div className={styles.loadingState}>Loading cart...</div>
      ) : !cart || !cart.products?.length ? (
        <div className={styles.emptyState}>
          <h2>Your cart is empty</h2>
          <Link to="/products" className={styles.primaryBtn}>Start Shopping</Link>
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
                    <div className={styles.placeholderImage}></div>
                  )}
                </div>
                
                <div className={styles.itemDetails}>
                  <div className={styles.itemHeader}>
                    <h3>{item.product?.title}</h3>
                    <p className={styles.itemMeta}>Size: {item.size || 'L'} | Color: {item.color || 'White'}</p>
                    <p className={styles.itemPrice}>₹{item.product?.price}</p>
                  </div>

                  <div className={styles.itemActions}>
                    <div className={styles.quantityBox}>
                      <button 
                        onClick={() => handleUpdateCartQuantity(item.product?._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => handleUpdateCartQuantity(item.product?._id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button 
                      className={styles.removeBtn}
                      onClick={() => handleRemoveFromCart(item.product?._id)}
                      aria-label="Remove item"
                    >
                      🗑️
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
              <span>₹{totalAmount}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Delivery</span>
              <span>₹0</span>
            </div>
            
            <div className={styles.totalRow}>
              <span>Total</span>
              <span>₹{totalAmount}</span>
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
              Proceed to Checkout
            </button>

            <div className={styles.couponSection}>
              <p>Have a coupon code?</p>
              <div className={styles.couponInputGroup}>
                <input type="text" placeholder="Enter code" />
                <button>Apply</button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
};

export default Cart;
