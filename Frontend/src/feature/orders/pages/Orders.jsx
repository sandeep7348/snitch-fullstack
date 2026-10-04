import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  ChevronRight, 
  ShoppingBag,
  FileText,
  Clock,
  ExternalLink
} from "lucide-react";
import { useOrders } from "../hooks/useOrders";
import styles from "./orders.module.scss";

export const Orders = () => {
  const { orders, loading, message, handleCancelOrder } = useOrders();
  const [activeTracking, setActiveTracking] = useState({});

  const toggleTracking = (orderId) => {
    setActiveTracking(prev => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <span className={`${styles.statusBadge} ${styles.delivered}`}><CheckCircle2 size={14} /> Delivered</span>;
      case 'cancelled':
        return <span className={`${styles.statusBadge} ${styles.cancelled}`}><XCircle size={14} /> Cancelled</span>;
      default:
        return <span className={`${styles.statusBadge} ${styles.processing}`}><Truck size={14} /> In Transit (Shipped)</span>;
    }
  };

  const downloadInvoice = (order) => {
    const invoiceWindow = window.open("", "_blank");
    invoiceWindow.document.write(`
      <html>
        <head>
          <title>Invoice - Order #${order._id.slice(-8).toUpperCase()}</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #111827; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; }
            .brand { font-size: 28px; font-weight: bold; letter-spacing: 2px; }
            .meta { font-size: 14px; color: #6b7280; text-align: right; }
            .section { margin-top: 30px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .table th, .table td { padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: left; }
            .total { text-align: right; font-size: 20px; font-weight: bold; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="brand">SNITCH STUDIO</div>
            <div class="meta">
              <p><strong>INVOICE</strong></p>
              <p>Order #${order._id.slice(-8).toUpperCase()}</p>
              <p>Date: ${new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <div class="section">
            <h3>Billed & Shipped To:</h3>
            <p><strong>${order.shippingAddress?.fullName || 'Valued Customer'}</strong></p>
            <p>${order.shippingAddress?.addressLine1 || 'Default Address'}, ${order.shippingAddress?.city || ''}</p>
            <p>Phone: ${order.shippingAddress?.phone || 'N/A'}</p>
          </div>
          <table class="table">
            <thead>
              <tr><th>Item</th><th>Qty</th><th>Price</th></tr>
            </thead>
            <tbody>
              ${order.products?.map(p => `<tr><td>${p.product?.title || 'Streetwear Item'}</td><td>${p.quantity}</td><td>₹${(p.product?.price || 0) * p.quantity}</td></tr>`).join('')}
            </tbody>
          </table>
          <div class="total">Total Paid: ₹${order.totalAmount} (${order.paymentMethod?.toUpperCase()})</div>
          <script>window.print();</script>
        </body>
      </html>
    `);
  };

  return (
    <main className={styles.pageContainer}>
      <div className={styles.breadcrumbs}>
        <Link to="/">Home</Link>
        <ChevronRight size={14} />
        <span>My Order History</span>
      </div>

      <header className={styles.header}>
        <div>
          <h1>My Orders & Purchases</h1>
          <p>Track delivery timelines, download invoices, and manage orders</p>
        </div>
        <Link to="/products" className={styles.secondaryBtn}>Explore Shop</Link>
      </header>

      {message && <div className={styles.alertBanner}>{message}</div>}

      {loading ? (
        <div className={styles.loadingState}>Loading order history...</div>
      ) : !orders?.length ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <Package size={44} />
          </div>
          <h2>No orders placed yet</h2>
          <p>Discover our latest street style drops and place your first order!</p>
          <Link to="/products" className={styles.primaryBtn}>Start Shopping</Link>
        </div>
      ) : (
        <section className={styles.orderList}>
          {orders.map((order) => (
            <article className={styles.orderCard} key={order._id}>
              <div className={styles.cardHeader}>
                <div className={styles.orderMeta}>
                  <p className={styles.orderId}>Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className={styles.orderDate}>Placed on {new Date().toLocaleDateString()}</p>
                </div>
                <div className={styles.headerRight}>
                  {getStatusBadge(order.status)}
                  <span className={styles.totalAmount}>₹{order.totalAmount}</span>
                </div>
              </div>

              {/* Order Tracking Timeline Stepper */}
              <div className={styles.trackingSection}>
                <div className={styles.trackingHeader}>
                  <p className={styles.estDelivery}>
                    <Clock size={16} /> Est. Delivery: <strong>Tuesday, Oct 6 by 8:00 PM</strong>
                  </p>
                  <span className={styles.trackingNum}>
                    Tracking #: <strong>SNT-{order._id.slice(-6).toUpperCase()}</strong> (BlueDart Express)
                  </span>
                </div>

                <div className={styles.timelineStepper}>
                  <div className={`${styles.timelineStep} ${styles.completedStep}`}>
                    <div className={styles.stepDot}><CheckCircle2 size={16} /></div>
                    <span>Order Placed</span>
                  </div>
                  <div className={styles.stepLineActive} />

                  <div className={`${styles.timelineStep} ${styles.completedStep}`}>
                    <div className={styles.stepDot}><CheckCircle2 size={16} /></div>
                    <span>Quality Check</span>
                  </div>
                  <div className={styles.stepLineActive} />

                  <div className={`${styles.timelineStep} ${styles.activeStep}`}>
                    <div className={styles.stepDot}><Truck size={16} /></div>
                    <span>Shipped & In Transit</span>
                  </div>
                  <div className={styles.stepLine} />

                  <div className={styles.timelineStep}>
                    <div className={styles.stepDot}><Package size={16} /></div>
                    <span>Out for Delivery</span>
                  </div>
                </div>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.itemsSection}>
                  {order.products?.map((item, idx) => (
                    <div className={styles.itemRow} key={item._id || idx}>
                      <div className={styles.miniImg}>
                        {item.product?.image ? (
                          <img src={item.product.image} alt={item.product.title} />
                        ) : (
                          <div className={styles.placeholderImg} />
                        )}
                      </div>
                      <div className={styles.itemInfo}>
                        <h4>{item.product?.title || "Streetwear Item"}</h4>
                        <p>Quantity: {item.quantity} | Size: L</p>
                      </div>
                      <div className={styles.itemPrice}>₹{(item.product?.price || 0) * item.quantity}</div>
                    </div>
                  ))}
                </div>

                {order.shippingAddress && (
                  <div className={styles.shippingSection}>
                    <h4><MapPin size={14} /> Shipping Details</h4>
                    <p className={styles.name}>{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.addressLine1}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                    <p className={styles.phone}>Phone: {order.shippingAddress.phone}</p>
                  </div>
                )}
              </div>

              <div className={styles.cardFooter}>
                <p className={styles.paymentMethod}>Payment: <strong>{order.paymentMethod?.toUpperCase()}</strong></p>
                <div className={styles.footerActions}>
                  <button className={styles.invoiceBtn} onClick={() => downloadInvoice(order)}>
                    <FileText size={15} /> Download Invoice
                  </button>
                  {order.status !== "cancelled" && order.status !== "delivered" && (
                    <button className={styles.cancelBtn} onClick={() => handleCancelOrder(order._id)}>
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
};

export default Orders;
