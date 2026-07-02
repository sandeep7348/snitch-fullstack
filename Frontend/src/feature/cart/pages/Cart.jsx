import React, { useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { useCart } from "../hooks/useCart";
import styles from "./cart.module.scss";

const defaultAddress = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
};

export const Cart = () => {
  const { user } = useAuth();
  const {
    cart,
    loading,
    message,
    shippingAddress,
    paymentMethod,
    checkoutLoading,
    handleRemoveFromCart,
    handleUpdateCartQuantity,
    handleClearCart,
    handlePlaceOrder,
    updateShippingAddress,
    setPaymentMethod,
  } = useCart();

  const [showCheckout, setShowCheckout] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const totalAmount = useMemo(() => {
    if (!cart?.products?.length) return 0;
    return cart.products.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  }, [cart]);

  return (
    <main className={styles.page}>
      <div className={`${styles.shell} ${!cart || !cart.products?.length ? styles.shellEmpty : ""}`}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Cart</p>
            <h1>Your bag</h1>
          </div>
          <Link to="/products" className={styles.linkButton}>
            Continue shopping
          </Link>
        </header>

        {message ? <p className={styles.message}>{message}</p> : null}

        {loading ? (
          <p className={styles.message}>Loading cart...</p>
        ) : !cart || !cart.products?.length ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyGraphic} aria-hidden>
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6h18l-1.6 11.2A2 2 0 0 1 17.4 19H6.6a2 2 0 0 1-1.998-1.8L3 6z" stroke="#161a27" strokeWidth="0.8" fill="none" strokeLinejoin="round"/>
                <path d="M8 6V4a4 4 0 0 1 8 0v2" stroke="#161a27" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <h2 className={styles.emptyTitle}>YOUR BAG IS EMPTY</h2>
            <p className={styles.emptyText}>Your cart is ready to roll, but it's feeling a bit empty without some stylish finds.</p>

            <div className={styles.emptyActions}>
              <Link to="/products" className={styles.startShoppingButton}>START SHOPPING</Link>
            </div>
          </div>
        ) : (
          <div className={styles.content}>
  <div className={styles.list}>
    {cart.products.map((item) => (
      <div
        className={styles.item}
        key={item.product?._id || item.product}
      >
        <div className={styles.itemImageWrapper}>
          {item.product?.image ? (
            <img
              src={item.product.image}
              alt={item.product.title}
              className={styles.itemImage}
            />
          ) : null}
        </div>

        <div className={styles.itemDetails}>
          <h3>{item.product?.title}</h3>
          <p>{item.product?.category}</p>

          <div className={styles.itemMeta}>
            <div className={styles.quantityControls}>
              <button
                className={styles.qtyButton}
                type="button"
                disabled={
                  checkoutLoading || item.quantity <= 1
                }
                onClick={() =>
                  handleUpdateCartQuantity(
                    item.product?._id,
                    item.quantity - 1
                  )
                }
              >
                −
              </button>

              <span>{item.quantity}</span>

              <button
                className={styles.qtyButton}
                type="button"
                disabled={
                  checkoutLoading ||
                  (item.product?.stock != null &&
                    item.quantity >= item.product.stock)
                }
                onClick={() =>
                  handleUpdateCartQuantity(
                    item.product?._id,
                    item.quantity + 1
                  )
                }
              >
                +
              </button>
            </div>

            <span>
              ₹{item.product?.price * item.quantity}
            </span>
          </div>

          <button
            className={styles.remove}
            onClick={() =>
              handleRemoveFromCart(item.product?._id)
            }
          >
            Remove
          </button>
        </div>

      </div>
    ))}
  </div>

  <aside className={styles.summary}>
  <div className={styles.summaryHeading}>
    <h2>Price Details</h2>
    <p>{cart.products.length} items</p>
  </div>

  <div className={styles.priceBox}>
    <div className={styles.priceRow}>
      <span>Bag Total</span>
      <span>₹{totalAmount}</span>
    </div>

    <div className={styles.priceRow}>
      <span>Coupon Discount</span>
      <span>- ₹0</span>
    </div>

    <div className={`${styles.priceRow} ${styles.priceTotal}`}>
      <span>Grand Total</span>
      <span>₹{totalAmount}</span>
    </div>
  </div>

  {!showCheckout ? (
    <button
      className={styles.primary}
      onClick={() => {
        if (!user) {
          navigate("/login", {
            state: { from: location },
            replace: true,
          });
          return;
        }

        setShowCheckout(true);
      }}
    >
      Select address to continue
    </button>
  ) : (
    <>
      <div className={styles.checkoutSection}>
        <h3>Shipping Address</h3>

        <div className={styles.section}>
          <label>Full Name</label>
          <input
            value={shippingAddress.fullName || user?.fullName || ""}
            onChange={(e) =>
              updateShippingAddress("fullName", e.target.value)
            }
          />
        </div>

        <div className={styles.section}>
          <label>Phone</label>
          <input
            value={shippingAddress.phone}
            onChange={(e) =>
              updateShippingAddress("phone", e.target.value)
            }
          />
        </div>

        <div className={styles.section}>
          <label>Address Line 1</label>
          <input
            value={shippingAddress.addressLine1}
            onChange={(e) =>
              updateShippingAddress("addressLine1", e.target.value)
            }
          />
        </div>

        <div className={styles.section}>
          <label>Address Line 2</label>
          <input
            value={shippingAddress.addressLine2}
            onChange={(e) =>
              updateShippingAddress("addressLine2", e.target.value)
            }
          />
        </div>

        <div className={styles.sectionInline}>
          <div>
            <label>City</label>
            <input
              value={shippingAddress.city}
              onChange={(e) =>
                updateShippingAddress("city", e.target.value)
              }
            />
          </div>

          <div>
            <label>State</label>
            <input
              value={shippingAddress.state}
              onChange={(e) =>
                updateShippingAddress("state", e.target.value)
              }
            />
          </div>
        </div>

        <div className={styles.sectionInline}>
          <div>
            <label>Postal Code</label>
            <input
              value={shippingAddress.postalCode}
              onChange={(e) =>
                updateShippingAddress("postalCode", e.target.value)
              }
            />
          </div>

          <div>
            <label>Country</label>
            <input
              value={shippingAddress.country}
              onChange={(e) =>
                updateShippingAddress("country", e.target.value)
              }
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <label>Payment Method</label>

        <select
          value={paymentMethod}
          onChange={(e) =>
            setPaymentMethod(e.target.value)
          }
        >
          <option value="cod">Cash on Delivery</option>
          <option value="online">Online Payment</option>
        </select>
      </div>

      <button
        className={styles.primary}
        onClick={handlePlaceOrder}
        disabled={checkoutLoading}
      >
        {checkoutLoading
          ? "Processing..."
          : "Confirm Order"}
      </button>
    </>
  )}

  <button
    className={styles.ghost}
    onClick={handleClearCart}
    type="button"
  >
    Clear Cart
  </button>
</aside>
</div>
          
        )}
      </div>
    </main>
  );
};

export default Cart;
