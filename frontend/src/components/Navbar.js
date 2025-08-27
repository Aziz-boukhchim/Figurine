import React, { useState, useContext, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "../styles/Navbar.css";
import logo from "../assets/logo.png";

const Navbar = ({ searchTerm, setSearchTerm }) => {
  const { cartItems, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [showCartPreview, setShowCartPreview] = useState(false);
  const cartRef = useRef();
  const hideTimeout = useRef(null);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0
  );

  const handleMouseEnter = () => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
    setShowCartPreview(true);
  };

  const handleMouseLeave = () => {
    hideTimeout.current = setTimeout(() => {
      setShowCartPreview(false);
    }, 300);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cartRef.current && !cartRef.current.contains(e.target)) {
        setShowCartPreview(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">
          <img src={logo} alt="Logo" className="navbar-logo-img" />
        </Link>
      </div>

      {/* Search Bar (only render if props exist) */}
      {setSearchTerm && (
        <div className="navbar-search">
          <input
            type="text"
            placeholder="Search figurines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {/* Cart */}
      <div
        className="navbar-cart"
        ref={cartRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="button"
        tabIndex={0}
      >
        <div className="cart-icon-wrapper">
          <svg
            className="cart-icon"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            width="28"
            height="28"
            aria-hidden="true"
            onClick={() => navigate("/cart")}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 7M7 13l-2 7h14m-6-7v7"
            />
          </svg>
          {cartItems.length > 0 && (
            <span className="cart-badge">{cartItems.length}</span>
          )}
        </div>

        <span className="cart-total-price">{totalPrice.toFixed(3)} DT</span>

        {showCartPreview && (
          <div className="cart-preview">
            {cartItems.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              <>
                <ul className="cart-items-list">
                  {cartItems.map((item) => (
                    <li key={item._id} className="cart-item">
                      <button
                        className="remove-item-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromCart(item._id);
                        }}
                        aria-label={`Remove ${item.title} from cart`}
                      >
                        ×
                      </button>
                      <img
                        src={item.images?.[0] || ""}
                        alt={item.title}
                        className="cart-item-img"
                      />
                      <div className="cart-item-info">
                        <span className="cart-item-title">{item.title}</span>
                        <span className="cart-item-qty">
                          Qty: {item.quantity}
                        </span>
                        <span className="cart-item-price">
                          {(Number(item.price) * item.quantity).toFixed(3)} DT
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="cart-preview-footer">
                  <div className="cart-preview-total">
                    Total: <strong>{totalPrice.toFixed(3)} DT</strong>
                  </div>
                  <button
                    className="cart-preview-button"
                    onClick={() => {
                      navigate("/cart");
                      setShowCartPreview(false);
                    }}
                  >
                    Go to Cart
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
