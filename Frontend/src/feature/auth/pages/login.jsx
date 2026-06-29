import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import styles from "./login.module.scss";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await handleLogin(email, password);
      setSuccess("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      const apiErrors = error.response?.data?.errors;
      const errorMessage = apiErrors
        ? apiErrors.map((err) => err.msg).join(", ")
        : error.response?.data?.message || error.message || "Something went wrong";
      setError(errorMessage);
    }
  }

  return (
    <main className={styles["login-page"]}>
      <div className={styles["page-shell"]}>
        <Link to="/register" className={styles["back-link"]}>
          &larr; Create account
        </Link>

        <div className={styles["login-grid"]}>
          <section className={styles["form-panel"]}>
            <h1>Welcome Back</h1>
            <form className={styles["login-form"]} onSubmit={handleSubmit}>
              <div className={styles["field-group"]}>
                <label htmlFor="email">E-mail</label>
                <input
                  id="email"
                  type="email"
                  placeholder="jane.doe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className={styles["field-group"]}>
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button className={styles["submit-button"]} type="submit">
                Log in
              </button>

              {error && <p className={styles["form-error"]}>{error}</p>}
              {success && <p className={styles["form-success"]}>{success}</p>}
            </form>
          </section>

          <aside className={styles["cta-panel"]}>
            <div className={styles["cta-content"]}>
              <h2>Return to your account</h2>
              <p>Need a new account? Register and start building today.</p>
              <Link to="/register" className={styles["login-button"]}>
                Create account
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};
