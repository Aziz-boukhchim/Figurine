import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/OrderDetails.css"

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`https://figurine.onrender.com/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(res.data);
        setStatus(res.data.status);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleStatusChange = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `https://figurine.onrender.com/api/orders/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Status updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to update status");
    }
  };

  useEffect(() => {
  document.body.classList.add("admin-page");
  return () => {
    document.body.classList.remove("admin-page");
  };
}, []);


  if (loading) return <p className="order-loading">Loading...</p>;
  if (!order) return <p className="order-error">Order not found</p>;

  return (
    <div className="order-page">
      <div className="order-container">
        <button className="back-btn" onClick={() => navigate("/admin/orders")}>
          ⬅ Back to Orders
        </button>
        <h2 className="order-title">Order Details</h2>
        <div className="order-info">
          <p><strong>Customer:</strong> {order.customerInfo.firstName} {order.customerInfo.lastName}</p>
          <p><strong>Email:</strong> {order.customerInfo.email}</p>
          <p><strong>Phone:</strong> {order.customerInfo.phone}</p>
          <p><strong>Address:</strong> {order.customerInfo.address}, {order.customerInfo.city}</p>
          <p><strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}</p>
        </div>

        <h3 className="items-title">Items</h3>
        <ul className="order-items">
          {order.items.map((item, idx) => (
            <li key={idx} className="order-item">
              <div>
                {item.name} — {item.quantity} × ${item.price.toFixed(2)}
              </div>
              <div>
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="order-item-image"
                  />
                ) : (
                  <span>No image</span>
                )}
              </div>
            </li>
          ))}
        </ul>

        <h3>Status</h3>
        <div className="status-section">
          <select
            className="status-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button className="update-btn" onClick={handleStatusChange}>
            Update Status
          </button>
        </div>

        {message && <p className="order-message">{message}</p>}
      </div>
    </div>
  );
};

export default OrderDetails;
