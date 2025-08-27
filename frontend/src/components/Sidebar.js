import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

export default function Sidebar() {
  return (
    <div className="admin-sidebar">
      <h2>Admin Panel</h2>
      <nav>
        <Link to="/figurines">All Figurines</Link>
        <Link to="/add-figurine">Add Figurine</Link>
        <Link to="/admin/orders">Orders</Link>
      </nav>
    </div>
  );
}

