import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/OrdersList.css"; // scoped styles

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

useEffect(() => {
  document.body.classList.add("admin-page");
  return () => {
    document.body.classList.remove("admin-page");
  };
}, []);


  if (loading) return <p className="orders-loading">Loading orders...</p>;
  if (error) return <p className="orders-error">{error}</p>;

  return (
    <div className="orders-page">
      <div className="orders-list-container">
        <h2 className="orders-title">Orders</h2>
        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>
                    {order.customerInfo.firstName}{" "}
                    {order.customerInfo.lastName}
                  </td>
                  <td>${order.totalPrice.toFixed(2)}</td>
                  <td>{order.status}</td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() =>
                        (window.location.href = `/admin/orders/${order._id}`)
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersList;
