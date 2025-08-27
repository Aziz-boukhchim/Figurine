import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import "../styles/CartPage.css";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0
  );

  // Fetch recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        if (cartItems.length === 0) {
          const res = await axios.get("http://localhost:5000/api/figurines?limit=6");
          setRecommendations(res.data);
        } else {
          const category = cartItems[0].category;
          const res = await axios.get(
            `http://localhost:5000/api/figurines?category=${encodeURIComponent(category)}&limit=6`
          );
          const filtered = res.data.filter(f => !cartItems.some(c => c._id === f._id));
          setRecommendations(filtered);
        }
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
      }
    };
    fetchRecommendations();
  }, [cartItems]);

  return (
    <div className="cart-shell">
      <div className="cart-content">
        {cartItems.length === 0 ? (
          <p className="cart-empty">Your cart is empty</p>
        ) : (
          <>
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item._id}>
                    <td className="cart-product">
                      <img src={item.images?.[0] || ""} alt={item.title} />
                      {item.title}
                    </td>
                    <td>{Number(item.price).toFixed(3)} DT</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
                      />
                    </td>
                    <td>{(Number(item.price) * item.quantity).toFixed(3)} DT</td>
                    <td>
                      <button
                        className="cart-remove-btn"
                        onClick={() => removeFromCart(item._id)}
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="cart-footer">
              <h3>Total: {totalPrice.toFixed(3)} DT</h3>
              <div className="cart-buttons">
                <button onClick={() => navigate("/")} className="cart-continue-btn">
                  Continue Shopping
                </button>
                <button onClick={() => navigate("/checkout")} className="cart-checkout-btn">
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <div className="cart-recommendations">
            <h3>You might also like</h3>
            <div className="recommendation-cards">
              {recommendations.map((item) => (
                <div key={item._id} className="recommendation-card">
                  <Link to={`/figurines/${item._id}`}>
                    <img src={item.images?.[0] || ""} alt={item.title} />
                    <p className="title">{item.title}</p>
                    <p className="price">{Number(item.price).toFixed(3)} DT</p>
                  </Link>
                  {item.inStock && (
                    <button className="add-cart-btn" onClick={() => addToCart(item)}>
                      Add to Cart
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
