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

const VALID_COUPONS = {
  SNITCH10: { type: "percent", value: 10, label: "10% OFF" },
  AI20: { type: "percent", value: 20, label: "20% AI Special OFF" },
  LUXURY500: { type: "flat", value: 500, label: "Flat ₹500 OFF (Min ₹1500)", minSubtotal: 1500 },
  FREESHIP: { type: "percent", value: 5, label: "5% Extra Discount" },
};

function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Your cart is empty — start shopping!");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
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
      setAppliedCoupon(null);
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

  const applyCoupon = (code, subtotal) => {
    setCouponError("");
    const cleanCode = code ? code.trim().toUpperCase() : "";
    if (!cleanCode) {
      setCouponError("Please enter a valid coupon code");
      return false;
    }

    const coupon = VALID_COUPONS[cleanCode];
    if (!coupon) {
      setCouponError("Invalid promo code. Try SNITCH10 or AI20!");
      return false;
    }

    if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
      setCouponError(`Min subtotal ₹${coupon.minSubtotal} required for ${cleanCode}`);
      return false;
    }

    setAppliedCoupon({ code: cleanCode, ...coupon });
    setCouponError("");
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
  };

  const calculateDiscount = (subtotal) => {
    if (!appliedCoupon || !subtotal) return 0;
    if (appliedCoupon.type === "percent") {
      return Math.round((subtotal * appliedCoupon.value) / 100);
    }
    if (appliedCoupon.type === "flat") {
      return Math.min(subtotal, appliedCoupon.value);
    }
    return 0;
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
        appliedCoupon: appliedCoupon ? appliedCoupon.code : null,
      };

      await placeOrder(payload);
      await clearCart();
      setCart(null);
      setAppliedCoupon(null);
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
        appliedCoupon,
        couponError,
        applyCoupon,
        removeCoupon,
        calculateDiscount,
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
