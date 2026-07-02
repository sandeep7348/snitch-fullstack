import { createContext, useEffect, useState } from "react";
import { cancelOrder, getOrders } from "./service/order.api";

export const OrdersContext = createContext();

function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadOrders = async () => {
    setLoading(true);
    setMessage("");

    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      setMessage("Unable to fetch orders right now.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    setLoading(true);
    try {
      await cancelOrder(orderId);
      setMessage("Order cancelled successfully.");
      await loadOrders();
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to cancel order.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <OrdersContext.Provider
      value={{
        orders,
        loading,
        message,
        loadOrders,
        handleCancelOrder,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export default OrdersProvider;
