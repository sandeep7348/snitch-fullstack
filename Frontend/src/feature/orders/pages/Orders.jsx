import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useOrders } from "../hooks/useOrders";
import styles from "./orders.module.scss";

export const Orders = () => {
  const { orders, loading, message, handleCancelOrder } = useOrders();

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Orders</p>
            <h1>Your purchases</h1>
          </div>
          <Link to="/products" className={styles.linkButton}>Back to products</Link>
        </header>

        {message ? <p className={styles.message}>{message}</p> : null}

        {loading ? (
          <p className={styles.message}>Loading orders...</p>
        ) : !orders.length ? (
          <div className={styles.empty}>No orders yet.</div>
        ) : (
          <section className={styles.list}>
            {orders.map((order) => (
              <article className={styles.card} key={order._id}>
                <div className={styles.cardHeader}>
                  <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
                  <span className={styles.status}>{order.status}</span>
                </div>
                <p className={styles.amount}>Total: ₹{order.totalAmount}</p>
                <p className={styles.meta}>Payment: {order.paymentMethod.toUpperCase()}</p>
                {order.shippingAddress ? (
                  <div className={styles.shippingInfo}>
                    <h4>Shipping details</h4>
                    <p>{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.phone}</p>
                    <p>{order.shippingAddress.addressLine1}</p>
                    {order.shippingAddress.addressLine2 ? <p>{order.shippingAddress.addressLine2}</p> : null}
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                ) : null}
                <div className={styles.items}>
                  {order.products?.map((item) => (
                    <div className={styles.itemRow} key={item._id}>
                      <span>{item.product?.title}</span>
                      <span>Qty {item.quantity}</span>
                    </div>
                  ))}
                </div>
                {order.status !== "cancelled" && order.status !== "delivered" ? (
                  <button className={styles.cancel} onClick={() => handleCancelOrder(order._id)}>
                    Cancel order
                  </button>
                ) : null}
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
};

export default Orders;
