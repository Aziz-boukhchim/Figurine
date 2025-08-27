import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/AddFigurine.css";

export default function AddFigurine() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    images: [],
    inStock: true,
  });

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Add class to root div to enable scoped CSS effects
  useEffect(() => {
    document.body.classList.add("add-figurine-page");
    return () => {
      document.body.classList.remove("add-figurine-page");
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    setError("");

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "unsigned_preset"); // Replace with your Cloudinary preset

        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dwsgeo1ws/image/upload", // Replace YOUR_CLOUD_NAME
          formData
        );
        return res.data.secure_url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
    } catch (err) {
      setError("Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.title ||
      !formData.description ||
      !formData.category ||
      !formData.price ||
      formData.images.length === 0
    ) {
      setError("Please fill in all required fields and upload at least one image.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "https://figurine.onrender.com/api/figurines",
        {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          price: Number(formData.price),
          images: formData.images,
          inStock: formData.inStock,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Figurine added successfully!");
      navigate("/figurines");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add figurine");
    }
  };
  useEffect(() => {
  document.body.classList.add("admin-page");
  return () => {
    document.body.classList.remove("admin-page");
  };
}, []);


  return (
    <div className="add-figurine-container">
      <h2>Add New Figurine</h2>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>Title*</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required />

        <label>Description*</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required />

        <label>Category*</label>
        <input type="text" name="category" value={formData.category} onChange={handleChange} required />

        <label>Price ($)*</label>
        <input
          type="number"
          name="price"
          min="0"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <label>Images* (You can select multiple)</label>
        <input type="file" multiple accept="image/*" onChange={handleFileChange} />

        {uploading && <p className="uploading-text">Uploading images...</p>}

        <div className="image-preview-container">
          {formData.images.map((url, i) => (
            <img key={i} src={url} alt={`Uploaded ${i}`} />
          ))}
        </div>

        <label className="checkbox-label">
          <input type="checkbox" name="inStock" checked={formData.inStock} onChange={handleChange} />
          In Stock
        </label>

        <button type="submit" disabled={uploading}>
          Add Figurine
        </button>
      </form>
    </div>
  );
}
