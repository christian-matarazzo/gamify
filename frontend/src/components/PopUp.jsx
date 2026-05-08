import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/PopUp.css";

export default function PopUp({ onClose }) {
  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "success" | "error"
  const [discountCode, setDiscountCode] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  /* pop up reset */
  useEffect(() => {
    if (status !== "idle") {
      setStatus("idle");
      setErrorMessage("");
      setDiscountCode(null);
    }
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/newsletter/subscribe",
        { email }
      );

      if (response.data.success) {
        setDiscountCode(response.data.discount_code);
        setStatus("success");
      } else {
        setErrorMessage(response.data.message || "Something went wrong");
        setStatus("error");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      
     /* error message */
      if (error.response?.status === 409) {
        setErrorMessage(error.response.data.message || "This email is already registered");
      } else if (error.response?.status === 400) {
        setErrorMessage("Please enter a valid email address");
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
      
      setStatus("error");
    }
  };

  /* success message  */
  if (status === "success") {
    return (
      <div className="overlay" onClick={onClose}>
        <div className="popup" onClick={(e) => e.stopPropagation()}>
          <button className="popup-x" onClick={onClose} aria-label="Close">✕</button>

          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <h3 style={{ color: "#198754", marginBottom: "15px" }}> Thank you!</h3>
            <p style={{ marginBottom: "20px" }}>You're now part of the Gamify community.</p>

            <p style={{ marginBottom: "20px" }}>
              Use the code below for <strong>10% off</strong> your first order:
              <span className="promo-code">
                <span className="promo-code-text">WELCOME10</span>
              </span>
            </p>

            <p style={{ fontSize: "14px", color: "#6c757d", marginBottom: "25px" }}>
              Check your inbox for a confirmation email.
            </p>

            <button className="popup-submit-btn" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

/* form  */
  return (
    <div className="overlay" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <button className="popup-x" onClick={onClose} aria-label="Close">✕</button>

        <h2>Welcome to <span>Gamify</span></h2>

        <p>
          Use the code below for <strong>10% off</strong> your first order:
          <span className="promo-code">
            <span className="promo-code-text">WELCOME10</span>
          </span>
        </p>

        <p>
          <strong className="gamify-wantmore">Want more?</strong> Join the
          Gamify community for early access to deals, exclusive discounts, and
          updates on the most anticipated releases.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Be part of our community!"
            className="popup-input"
            required
            disabled={status === "loading"}
          />

          <button
            type="submit"
            className="popup-submit-btn"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Joining..." : "Join Gamify!"}
          </button>

          <button
            type="button"
            className="popup-skip"
            onClick={onClose}
            disabled={status === "loading"}
          >
            No thanks, maybe later
          </button>
        </form>

{/* error message */}
        {status === "error" && errorMessage && (
          <p style={{ 
            color: "#dc3545", 
            marginTop: "15px", 
            fontSize: "14px",
            backgroundColor: "#ffe6e6",
            padding: "10px 14px",
            borderRadius: "6px",
            border: "1px solid #ffcdd2",
            textAlign: "center"
          }}>
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}