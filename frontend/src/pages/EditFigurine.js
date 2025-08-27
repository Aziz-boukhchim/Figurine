import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/EditFigurine.css";

export default function EditFigurine() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    image: "",
    inStock: true,
  });

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFigurine = async () => {
      try {
        const res = await axios.get(`https://figurine.onrender.com/api/figurines/${id}`);
        setFormData({
          title: res.data.title,
          description: res.data.description,
          category: res.data.category,
          price: res.data.price,
          image: res.data.image,
          inStock: res.data.inStock,
        });
      } catch {
        setError("Failed to load figurine data.");
      }
    };
    fetchFigurine();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title || !formData.description || !formData.category || !formData.price || !formData.image) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `https://figurine.onrender.com/api/figurines/${id}`,
        { ...formData, price: Number(formData.price) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Figurine updated successfully!");
      navigate("/figurines");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update figurine");
    }
  };

  useEffect(() => {
  document.body.classList.add("admin-page");
  return () => {
    document.body.classList.remove("admin-page");
  };
}, []);


  return (
    <div className="edit-figurine-page">
      <div className="edit-figurine-container">
        <h2>Edit Figurine</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>Title*</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />

          <label>Description*</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required />

          <label>Category*</label>
          <input type="text" name="category" value={formData.category} onChange={handleChange} required />

          <label>Price ($)*</label>
          <input type="number" name="price" min="0" step="0.01" value={formData.price} onChange={handleChange} required />

          <label>Image URL*</label>
          <input type="text" name="image" value={formData.image} onChange={handleChange} required />

          <label>
            <input type="checkbox" name="inStock" checked={formData.inStock} onChange={handleChange} />
            In Stock
          </label>

          <button type="submit">Update Figurine</button>
        </form>
      </div>
    </div>
  );
}
