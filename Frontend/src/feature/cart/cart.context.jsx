import { createContext, useEffect, useState } from "react";
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateCartQuantity,
} from "./service/cart.api";
import { placeOrder } from "../orders/service/order.api";

export const CartContext = createContext();

function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Your cart is empty — start shopping!");
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const loadCart = async () => {
    setLoading(true);
    setMessage("");
    try {
      const data = await getCart();
      setCart(data.cart);
      // if cart is empty, show default caption
      if (!data.cart || !data.cart.products || !data.cart.products.length) {
        setMessage("Your cart is empty — start shopping!");
      } else {
        setMessage("");
      }
    } catch (error) {
      setMessage("Your cart is empty — start shopping!");
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (postId, quantity = 1) => {
    setCheckoutLoading(true);
    setMessage("");
    try {
      await addToCart(postId, quantity);
      await loadCart();
      setMessage("Added to cart");
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not add item to cart");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleRemoveFromCart = async (postId) => {
    setCheckoutLoading(true);
    try {
      await removeFromCart(postId);
      await loadCart();
      setMessage("Item removed");
    } catch (error) {
      setMessage("Could not remove item");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleClearCart = async () => {
    setCheckoutLoading(true);
    try {
      await clearCart();
      setCart(null);
      setMessage("Cart cleared");
    } catch (error) {
      setMessage("Could not clear cart");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleUpdateCartQuantity = async (postId, quantity) => {
    setCheckoutLoading(true);
    try {
      await updateCartQuantity(postId, quantity);
      await loadCart();
      setMessage("Cart quantity updated");
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not update quantity");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!cart?.products?.length) {
      setMessage("Add items to cart before checkout.");
      return;
    }

    if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.addressLine1) {
      setMessage("Please fill in the shipping address.");
      return;
    }

    setCheckoutLoading(true);
    try {
      const payload = {
        products: cart.products.map((item) => ({ id: item.product._id, quantity: item.quantity })),
        shippingAddress,
        paymentMethod,
      };

      await placeOrder(payload);
      await clearCart();
      setCart(null);
      setMessage("Order placed successfully.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to place order.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const updateShippingAddress = (field, value) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        message,
        shippingAddress,
        paymentMethod,
        checkoutLoading,
        loadCart,
        handleAddToCart,
        handleRemoveFromCart,
        handleUpdateCartQuantity,
        handleClearCart,
        handlePlaceOrder,
        updateShippingAddress,
        setPaymentMethod,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;
