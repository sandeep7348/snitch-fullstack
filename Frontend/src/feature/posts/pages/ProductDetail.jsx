import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { usePosts } from "../hooks/usePosts";
import { useCart } from "../../cart/hooks/useCart";
import { useAuth } from "../../auth/hooks/useAuth";
import styles from "./productDetail.module.scss";

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const loadedIdRef = useRef(null);
  const { loadProductById } = usePosts();
  const { handleAddToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setMessage("");
      try {
        const data = await loadProductById(id);
        setProduct(data);
        loadedIdRef.current = id;
      } catch (error) {
        setMessage(error?.response?.data?.message || "Product not found.");
      } finally {
        setLoading(false);
      }
    };

    if (id && loadedIdRef.current !== id) {
      loadProduct();
    }
  }, [id, loadProductById]);

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.shell}>
          <p className={styles.message}>Loading product...</p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className={styles.page}>
        <div className={styles.shell}>
          <p className={styles.message}>Product not available.</p>
          <Link to="/products" className={styles.linkButton}>
            Back to products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>{product.category}</p>
            <h1>{product.title}</h1>
          </div>
          <Link to="/products" className={styles.linkButton}>
            Back to products
          </Link>
        </header>

        {message ? <p className={styles.message}>{message}</p> : null}

        <div className={styles.detailGrid}>
          <img src={product.image} alt={product.title} className={styles.image} />

          <div className={styles.info}>
            <p className={styles.description}>{product.description}</p>
            <div className={styles.metaRow}>
              <div>
                <p className={styles.label}>Price</p>
                <p className={styles.value}>₹{product.price}</p>
              </div>
              <div>
                <p className={styles.label}>Seller</p>
                <p className={styles.value}>{product.addedBy?.fullName || product.addedBy?.email || "Unknown"}</p>
              </div>
            </div>

            <div className={styles.metaRow}>
              <div>
                <p className={styles.label}>Category</p>
                <p className={styles.value}>{product.category}</p>
              </div>
            </div>

            <div className={styles.actions}>
              <button
                className={styles.primary}
                onClick={async () => {
                  if (!user) {
                    navigate("/login", { state: { from: location }, replace: true });
                    return;
                  }
                  try {
                    await handleAddToCart(product._id);
                  } catch (error) {
                    setMessage(error?.response?.data?.message || "Could not add to cart.");
                  }
                }}
              >
                Add to cart
              </button>
              <button
                className={styles.secondary}
                onClick={async () => {
                  if (!user) {
                    navigate("/login", { state: { from: location }, replace: true });
                    return;
                  }
                  try {
                    await handleAddToCart(product._id);
                    navigate("/cart");
                  } catch (error) {
                    setMessage(error?.response?.data?.message || "Could not add to cart.");
                  }
                }}
              >
                Buy now
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
