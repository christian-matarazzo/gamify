import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/PopUp.css";

export default function PopUp({ onClose }) {
  const [status, setStatus] = useState("idle");
  const [discountCode, setDiscountCode] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

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

  if (status === "success") {
    return (
      <div className="overlay" onClick={onClose}>
        <div className="popup" onClick={(e) => e.stopPropagation()}>
          <button className="popup-x" onClick={onClose} aria-label="Close">✕</button>

          <h2>You're <span>In!</span></h2>

          <p>
            Welcome to the Gamify community. Your newsletter subscription is now active. Check your inbox for news about the videogame world, exclusive discounts on your favorite titles, and early access to special events. Get ready to level up your gaming experience!
          </p>

          <button className="popup-submit-btn" onClick={onClose}>
            Start Exploring
          </button>
        </div>
      </div>
    );
  }

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

        {status === "error" && errorMessage && (
          <p className="popup-error mt-3">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}