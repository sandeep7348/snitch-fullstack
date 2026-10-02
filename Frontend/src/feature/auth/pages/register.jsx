import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import styles from "./auth.module.scss";

export const Register = () => {
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { handleRegister } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await handleRegister(email, contact, password, fullName);
      setSuccess("Registration successful!");
      navigate("/");
    } catch (error) {
      const apiErrors = error.response?.data?.errors;
      const errorMessage = apiErrors
        ? apiErrors.map((err) => err.msg).join(", ")
        : error.response?.data?.message || error.message || "Something went wrong";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.authPage}>
      <div className={styles.authContainer}>
        
        <div className={styles.leftPanel}>
          <img 
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=1000" 
            alt="Clothing store" 
            className={styles.bgImage}
          />
          <div className={styles.panelOverlay}>
            <h2>Join Snitch</h2>
            <p>Create an account and start your AI-powered shopping journey.</p>
          </div>
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.formWrapper}>
            <h1>Create Account</h1>
            <p className={styles.subtitle}>Fill in your details to get started</p>
            
            {error && <div className={styles.errorAlert}>{error}</div>}
            {success && <div className={styles.successAlert}>{success}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label>Full name</label>
                <div className={styles.inputWrapper}>
                  <span>👤</span>
                  <input
                    type="text"
                    placeholder="Sandeep Choudhary"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Email address</label>
                <div className={styles.inputWrapper}>
                  <span>✉️</span>
                  <input
                    type="email"
                    placeholder="sandeep@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Contact number</label>
                <div className={styles.inputWrapper}>
                  <span>📱</span>
                  <input
                    type="text"
                    placeholder="10-digit number"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Password</label>
                <div className={styles.inputWrapper}>
                  <span>🔒</span>
                  <input
                    type="password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className={styles.primaryBtn} disabled={loading}>
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </form>

            <div className={styles.divider}>
              <span>OR</span>
            </div>

            <button className={styles.socialBtn}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" />
              Continue with Google
            </button>

            <p className={styles.switchAuth}>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>

      </div>
    </main>
  );
};
