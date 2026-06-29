import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import styles from "./register.module.scss";

export const Register = () => {
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { handleRegister } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!acceptedTerms) {
      setError("Please accept the terms before continuing.");
      return;
    }

    setError("");
    setSuccess("");

    try {
      await handleRegister(email, contact, password, fullName);
      setSuccess("Registration successful!");
      navigate("/dashboard");
      setEmail("");
      setContact("");
      setPassword("");
      setFullName("");
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      const apiErrors = error.response?.data?.errors;
      const errorMessage = apiErrors
        ? apiErrors.map((err) => err.msg).join(", ")
        : error.response?.data?.message || error.message || "Something went wrong";
      setError(errorMessage);
    }
  }

  return (
    <main className={styles["register-page"]}>
      <div className={styles["page-shell"]}>
        <Link to="/" className={styles["back-link"]}>
          &larr; Home Page
        </Link>

        <div className={styles["register-grid"]}>
          <section className={styles["form-panel"]}>
            <h1>Create Account</h1>
            <form className={styles["register-form"]} onSubmit={handleSubmit}>
              <div className={styles["field-group"]}>
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Olivia Bennett"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className={styles["field-group"]}>
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

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
                <label htmlFor="contact">Contact</label>
                <input
                  id="contact"
                  type="text"
                  placeholder="1234567890"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
              </div>

              <label className={styles["checkbox-row"]}>
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                />
                <span>I accept the terms of the agreement</span>
              </label>

              <button className={styles["submit-button"]} type="submit">
                Sign up
              </button>

              {error && <p className={styles["form-error"]}>{error}</p>}
              {success && <p className={styles["form-success"]}>{success}</p>}
            </form>
          </section>

          <aside className={styles["cta-panel"]}>
            <div className={styles["cta-content"]}>
              <h2>Get Started</h2>
              <p>Already have an account?</p>
              <Link to="/login" className={styles["login-button"]}>
                Log in
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};
