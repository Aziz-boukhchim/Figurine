import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/FigurinesList.css";

export default function FigurinesList() {
  const [figurines, setFigurines] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchFigurines = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/figurines");
      setFigurines(res.data);
    } catch (error) {
      console.error("Error fetching figurines:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFigurines();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this figurine?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/figurines/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFigurines(figurines.filter((fig) => fig._id !== id));
    } catch (error) {
      console.error("Error deleting figurine:", error);
    }
  };

  useEffect(() => {
  document.body.classList.add("admin-page");
  return () => {
    document.body.classList.remove("admin-page");
  };
}, []);


  if (loading) return <p>Loading...</p>;

  return (
    <div className="figurines-list-page">
      <div className="figurines-list-container">
        <h2 className="title">All Figurines</h2>
        <button
          onClick={() => navigate("/add-figurine")}
          className="add-btn"
        >
          ➕ Add Figurine
        </button>

        <div className="table-wrapper">
          <table className="figurines-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Price</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {figurines.map((fig) => (
                <tr key={fig._id}>
                  <td>{fig.title}</td>
                  <td>{fig.category}</td>
                  <td>{fig.price} $</td>
                  <td>
                    {fig.images?.length > 0 ? (
                      <img
                        src={fig.images[0]}
                        alt={fig.title}
                        className="figurine-img"
                      />
                    ) : (
                      <span>No image</span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => navigate(`/admin/figurines/edit/${fig._id}`)}
                      className="edit-btn"
                    >
                      ✏ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(fig._id)}
                      className="delete-btn"
                    >
                      🗑 Delete
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
}
