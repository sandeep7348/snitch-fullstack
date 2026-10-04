import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ShieldCheck, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  Truck, 
  Lock,
  ChevronRight
} from "lucide-react";
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
  const [selectedPayment, setSelectedPayment] = useState("card");

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
      {/* Checkout Progress Stepper */}
      <div className={styles.stepper}>
        <div className={`${styles.step} ${styles.activeStep}`}>
          <span className={styles.circle}>1</span>
          <span className={styles.label}>Shipping</span>
        </div>
        <div className={styles.line} />
        <div className={`${styles.step} ${styles.activeStep}`}>
          <span className={styles.circle}>2</span>
          <span className={styles.label}>Payment</span>
        </div>
        <div className={styles.line} />
        <div className={styles.step}>
          <span className={styles.circle}>3</span>
          <span className={styles.label}>Confirmation</span>
        </div>
      </div>

      <div className={styles.checkoutLayout}>
        <div className={styles.formSection}>
          <div className={styles.sectionHeader}>
            <MapPin size={20} className={styles.sectionIcon} />
            <h2>Shipping Address</h2>
          </div>
          
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
                placeholder="+91 9876543210"
                value={shippingAddress.phone || ""}
                onChange={(e) => updateShippingAddress("phone", e.target.value)}
              />
            </div>

            <div className={styles.inputGroupFull}>
              <label>Street Address</label>
              <input 
                type="text" 
                placeholder="Flat / Building / House No, Street Name"
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

          <div className={styles.paymentMethodSection}>
            <div className={styles.sectionHeader}>
              <CreditCard size={20} className={styles.sectionIcon} />
              <h2>Payment Method</h2>
            </div>

            <div className={styles.paymentOptions}>
              <label className={`${styles.paymentCard} ${selectedPayment === 'card' ? styles.activePayment : ''}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  checked={selectedPayment === 'card'} 
                  onChange={() => setSelectedPayment('card')}
                />
                <div className={styles.paymentLabel}>
                  <strong>Credit / Debit Card</strong>
                  <p>Visa, MasterCard, RuPay supported</p>
                </div>
              </label>

              <label className={`${styles.paymentCard} ${selectedPayment === 'upi' ? styles.activePayment : ''}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  checked={selectedPayment === 'upi'} 
                  onChange={() => setSelectedPayment('upi')}
                />
                <div className={styles.paymentLabel}>
                  <strong>Instant UPI / QR Code</strong>
                  <p>Google Pay, PhonePe, Paytm</p>
                </div>
              </label>

              <label className={`${styles.paymentCard} ${selectedPayment === 'cod' ? styles.activePayment : ''}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  checked={selectedPayment === 'cod'} 
                  onChange={() => setSelectedPayment('cod')}
                />
                <div className={styles.paymentLabel}>
                  <strong>Cash on Delivery (COD)</strong>
                  <p>Pay when package arrives</p>
                </div>
              </label>
            </div>
          </div>

          <button 
            className={styles.primaryBtnFull}
            onClick={async () => {
              await handlePlaceOrder();
              if(!checkoutLoading) navigate("/orders");
            }}
            disabled={checkoutLoading}
          >
            {checkoutLoading ? "Processing Order..." : (
              <>
                <Lock size={18} /> Place Order — ₹{totalAmount}
              </>
            )}
          </button>
        </div>

        {/* Mini Order Summary */}
        <aside className={styles.orderSummary}>
          <h2>Order Items ({cart.products.length})</h2>
          
          <div className={styles.itemList}>
            {cart.products.map(item => (
              <div className={styles.miniItem} key={item.product?._id}>
                <div className={styles.miniImageWrapper}>
                  {item.product?.image ? (
                    <img src={item.product.image} alt={item.product.title} />
                  ) : (
                    <div className={styles.placeholderImage} />
                  )}
                </div>
                <div className={styles.miniDetails}>
                  <h4>{item.product?.title}</h4>
                  <p>Qty: {item.quantity} | Size: L</p>
                </div>
                <div className={styles.miniPrice}>₹{item.product?.price * item.quantity}</div>
              </div>
            ))}
          </div>

          <div className={styles.summaryTotals}>
            <div className={styles.summaryRow}>
              <span>Items Total</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span className={styles.freeText}>FREE</span>
            </div>
            
            <div className={styles.totalRow}>
              <span>Total Payable</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>

          <div className={styles.guaranteeBadge}>
            <ShieldCheck size={18} /> 100% Purchase Protection & Easy 7-Day Returns
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Checkout;
