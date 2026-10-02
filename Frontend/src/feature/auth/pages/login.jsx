import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import styles from "./auth.module.scss";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await handleLogin(email, password);
      setSuccess("Login successful!");
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
            <h2>Welcome Back</h2>
            <p>Shop your favourite products with AI-powered recommendations.</p>
          </div>
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.formWrapper}>
            <h1>Login to Snitch</h1>
            <p className={styles.subtitle}>Enter your credentials to continue</p>
            
            {error && <div className={styles.errorAlert}>{error}</div>}
            {success && <div className={styles.successAlert}>{success}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label>Email address</label>
                <div className={styles.inputWrapper}>
                  <span>✉️</span>
                  <input
                    type="email"
                    placeholder="jane.doe@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.forgotPassword}>
                <a href="#!">Forgot password?</a>
              </div>

              <button type="submit" className={styles.primaryBtn} disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className={styles.divider}>
              <span>OR</span>
            </div>

            <button className={styles.socialBtn}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" />
              Continue with Google
            </button>
            
            <button className={styles.socialBtn}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" alt="GitHub" />
              Continue with GitHub
            </button>

            <p className={styles.switchAuth}>
              Don't have an account? <Link to="/register">Sign up</Link>
            </p>
          </div>
        </div>

      </div>
    </main>
  );
};
