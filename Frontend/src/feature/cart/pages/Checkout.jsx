import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { useCart } from "../hooks/useCart";
import styles from "./checkout.module.scss";

export const Checkout = () => {
  const { user } = useAuth();
  const {
    cart,
    shippingAddress,
    paymentMethod,
    checkoutLoading,
    handlePlaceOrder,
    updateShippingAddress,
  } = useCart();

  const navigate = useNavigate();

  const totalAmount = useMemo(() => {
    if (!cart?.products?.length) return 0;
    return cart.products.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  }, [cart]);

  if (!cart?.products?.length) {
    return (
      <main className={styles.pageContainer}>
        <div className={styles.emptyState}>
          <h2>Your cart is empty</h2>
          <Link to="/products" className={styles.primaryBtn}>Start Shopping</Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.pageContainer}>
      
      <div className={styles.stepper}>
        <div className={`${styles.step} ${styles.activeStep}`}>
          <span className={styles.circle}>1</span>
          <span className={styles.label}>Address</span>
        </div>
        <div className={styles.line}></div>
        <div className={styles.step}>
          <span className={styles.circle}>2</span>
          <span className={styles.label}>Payment</span>
        </div>
        <div className={styles.line}></div>
        <div className={styles.step}>
          <span className={styles.circle}>3</span>
          <span className={styles.label}>Review</span>
        </div>
      </div>

      <div className={styles.checkoutLayout}>
        <div className={styles.formSection}>
          <h2>Shipping Address</h2>
          
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label>Full Name</label>
              <input 
                type="text" 
                placeholder="e.g. Sandeep Choudhary"
                value={shippingAddress.fullName || user?.fullName || ""}
                onChange={(e) => updateShippingAddress("fullName", e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Phone Number</label>
              <input 
                type="text" 
                placeholder="+91 8209355149"
                value={shippingAddress.phone || ""}
                onChange={(e) => updateShippingAddress("phone", e.target.value)}
              />
            </div>

            <div className={styles.inputGroupFull}>
              <label>Address</label>
              <input 
                type="text" 
                placeholder="123, ABC Street"
                value={shippingAddress.addressLine1 || ""}
                onChange={(e) => updateShippingAddress("addressLine1", e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>City</label>
              <input 
                type="text" 
                placeholder="Jaipur"
                value={shippingAddress.city || ""}
                onChange={(e) => updateShippingAddress("city", e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>State</label>
              <input 
                type="text" 
                placeholder="Rajasthan"
                value={shippingAddress.state || ""}
                onChange={(e) => updateShippingAddress("state", e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Pincode</label>
              <input 
                type="text" 
                placeholder="302001"
                value={shippingAddress.postalCode || ""}
                onChange={(e) => updateShippingAddress("postalCode", e.target.value)}
              />
            </div>
          </div>

          <div className={styles.checkboxGroup}>
            <input type="checkbox" id="saveAddress" defaultChecked />
            <label htmlFor="saveAddress">Save as default address</label>
          </div>

          <button 
            className={styles.primaryBtnFull}
            onClick={async () => {
              await handlePlaceOrder();
              if(!checkoutLoading) navigate("/orders");
            }}
            disabled={checkoutLoading}
          >
            {checkoutLoading ? "Processing..." : "Continue to Payment"}
          </button>
        </div>

        <aside className={styles.orderSummary}>
          <h2>Order Summary</h2>
          
          <div className={styles.itemList}>
            {cart.products.map(item => (
              <div className={styles.miniItem} key={item.product?._id}>
                <div className={styles.miniImageWrapper}>
                  {item.product?.image ? (
                    <img src={item.product.image} alt={item.product.title} />
                  ) : (
                    <div className={styles.placeholderImage}></div>
                  )}
                </div>
                <div className={styles.miniDetails}>
                  <h4>{item.product?.title}</h4>
                  <p>Qty: {item.quantity}</p>
                </div>
                <div className={styles.miniPrice}>₹{item.product?.price}</div>
              </div>
            ))}
          </div>

          <div className={styles.summaryTotals}>
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
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Checkout;
