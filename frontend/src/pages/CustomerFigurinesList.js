import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"; // import your navbar
import "../styles/CustomerFigurinesList.css";
import banner1 from "../assets/banner2.webp";

const CustomerFigurinesList = () => {
  const [figurines, setFigurines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/figurines/categories"
        );
        setCategories(["All", ...res.data]);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchFigurines = async () => {
      try {
        const url =
          category && category !== "All"
            ? `http://localhost:5000/api/figurines?category=${category}`
            : "http://localhost:5000/api/figurines";
        const res = await axios.get(url);
        setFigurines(res.data);
      } catch (err) {
        console.error("Failed to fetch figurines:", err);
      }
    };
    fetchFigurines();
  }, [category]);

  const filteredFigurines = figurines.filter((f) =>
    f.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="figurines-container">
        {/* Banner */}
        <div className="figurines-banner">
          <img src={banner1} alt="Hero Banner" className="banner-img" />
          <div className="banner-overlay">
            <h1>Discover Our Collection</h1>
            <p>Premium figurines from your favorite worlds</p>
          </div>
        </div>

        {/* Hero section */}
        <div className="figurines-hero">
          <h1>Collect, Display, Repeat</h1>
          <p>Find unique figurines that bring your collection to life</p>
          <div className="divider"></div>
        </div>

        {/* Categories Bar */}
        <div className="categories-bar">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-btn ${category === cat ? "active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Figurines Grid */}
        <section className="figurines-grid">
          {filteredFigurines.map((fig) => (
            <div key={fig._id} className="figurine-item">
              <div className="figurine-image-wrapper">
                <img
                  src={fig.images?.[0] || ""}
                  alt={fig.title}
                  className="figurine-image"
                />
              </div>
              <h3 className="figurine-title">{fig.title}</h3>
              <p className="figurine-price">
                {Number(fig.price).toFixed(3)} DT
              </p>
              <div className="figurine-actions">
                <button
                  className="add-cart-btn"
                  onClick={() => addToCart(fig)}
                >
                  Add to Cart
                </button>
                <button
                  className="details-btn"
                  onClick={() => navigate(`/figurines/${fig._id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </>
  );
};

export default CustomerFigurinesList;
