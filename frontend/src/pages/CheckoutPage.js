import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import "../styles/CheckoutPage.css";

export default function CheckoutPage() {
  const { cartItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !customerInfo.firstName.trim() ||
      !customerInfo.lastName.trim() ||
      !customerInfo.phone.trim() ||
      !customerInfo.address.trim() ||
      !customerInfo.city.trim()
    ) {
      setMessage("Please fill in all required fields.");
      return;
    }

    if (cartItems.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    setLoading(true);
    setMessage("");

    const orderPayload = {
      customerInfo,
      items: cartItems.map(({ _id, title, price, quantity, images }) => ({
        figurineId: _id,
        name: title,
        price,
        quantity,
        image: images?.[0] || "",
      })),
    };

    try {
      // Send order to backend
      await axios.post("http://localhost:5000/api/orders", orderPayload);

      // Clear cart
      clearCart();

      // Redirect to Order Confirmation page
      navigate("/order-confirmation");
    } catch (err) {
      console.error(err);
      setMessage("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="mycheckout-shell">
      <div className="mycheckout-wrapper">
        {/* Left: Form */}
        <div className="mycheckout-left">
          <form className="mycheckout-form" onSubmit={handleSubmit}>
            <h3>Customer Information</h3>

            <label>First Name*</label>
            <input
              type="text"
              name="firstName"
              value={customerInfo.firstName}
              onChange={handleChange}
              required
            />

            <label>Last Name*</label>
            <input
              type="text"
              name="lastName"
              value={customerInfo.lastName}
              onChange={handleChange}
              required
            />

            <label>Phone Number*</label>
            <input
              type="tel"
              name="phone"
              value={customerInfo.phone}
              onChange={handleChange}
              required
            />

            <label>Address*</label>
            <input
              type="text"
              name="address"
              value={customerInfo.address}
              onChange={handleChange}
              required
            />

            <label>City*</label>
            <input
              type="text"
              name="city"
              value={customerInfo.city}
              onChange={handleChange}
              required
            />

            <label>Email (optional)</label>
            <input
              type="email"
              name="email"
              value={customerInfo.email}
              onChange={handleChange}
            />

            <button type="submit" disabled={loading}>
              {loading
                ? "Placing order..."
                : "Place Order (Cash on Delivery)"}
            </button>

            {message && <p className="mycheckout-message">{message}</p>}
          </form>
        </div>

        {/* Divider line */}
        <div className="mycheckout-divider"></div>

        {/* Right: Order Summary */}
        <div className="mycheckout-right">
          <h3>Order Summary</h3>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul className="myorder-list">
              {cartItems.map((item) => (
                <li key={item._id} className="myorder-item">
                  <img src={item.images?.[0] || ""} alt={item.title} />
                  <span className="myorder-name">{item.title}</span>
                  <span className="myorder-price">
                    {(item.price * item.quantity).toFixed(3)} DT
                  </span>
                </li>
              ))}
            </ul>
          )}
          <div className="myorder-total">
            <span>Total</span>
            <span>{totalPrice.toFixed(3)} DT</span>
          </div>
        </div>
      </div>
    </div>
  );
}
