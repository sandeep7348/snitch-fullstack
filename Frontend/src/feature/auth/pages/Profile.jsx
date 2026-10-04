import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Phone, Package, Heart, Sparkles, LogOut, ShieldCheck } from "lucide-react";
import { AuthContext } from "../auth.context";
import styles from "./Profile.module.scss";

const Profile = () => {
  const { user, updateProfile, handleLogout } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    contact: user?.contact || "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      await updateProfile(formData.email, formData.contact, formData.fullName);
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.profileContainer}>
      <div className={styles.profileCard}>
        <div className={styles.avatarHeader}>
          <div className={styles.avatarBadge}>
            {user?.fullName ? user.fullName[0].toUpperCase() : 'U'}
          </div>
          <div>
            <h2>{user?.fullName || "Snitch Member"}</h2>
            <p className={styles.userRole}>
              <ShieldCheck size={14} /> {user?.role === 'admin' ? 'Administrator' : 'VIP Member'}
            </p>
          </div>
        </div>

        <div className={styles.quickLinks}>
          <Link to="/orders" className={styles.quickLinkItem}>
            <Package size={18} /> My Orders
          </Link>
          <Link to="/wishlist" className={styles.quickLinkItem}>
            <Heart size={18} /> My Wishlist
          </Link>
          <Link to="/ai-assistant" className={styles.quickLinkItem}>
            <Sparkles size={18} /> AI Stylist
          </Link>
        </div>

        {message && <div className={styles.successMessage}>{message}</div>}
        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label><User size={14} /> Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label><Mail size={14} /> Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label><Phone size={14} /> Contact Phone</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="+91 XXXXX XXXXX"
            />
          </div>

          <button type="submit" className={styles.saveBtn} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>

        <button onClick={handleLogout} className={styles.logoutBtn}>
          <LogOut size={16} /> Log Out
        </button>
      </div>
    </main>
  );
};

export default Profile;
