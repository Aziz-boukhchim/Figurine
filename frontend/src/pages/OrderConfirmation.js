import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/OrderConfirmation.css";
import { FaCheckCircle } from "react-icons/fa";

export default function OrderConfirmation() {
  const navigate = useNavigate();

  return (
    <div className="orderconf-container">
      <div className="orderconf-card">
        <FaCheckCircle className="orderconf-icon" />
        <h1>Order Confirmed!</h1>
        <p>
          Thank you for your purchase. 🎉 <br />
          We’ll contact you soon to confirm the details.
        </p>
        <button onClick={() => navigate("/")} className="orderconf-btn">
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
