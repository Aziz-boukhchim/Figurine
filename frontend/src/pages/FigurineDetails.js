import React, { useEffect, useState, useCallback, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import "../styles/FigurineDetails.css";

const FigurineDetails = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [figurine, setFigurine] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);

  useEffect(() => {
    document.body.classList.add("figurine-details-page");
    return () => document.body.classList.remove("figurine-details-page");
  }, []);

  useEffect(() => {
    const fetchFigurine = async () => {
      try {
        const res = await axios.get(`https://figurine.onrender.com/api/figurines/${id}`);
        setFigurine(res.data);
        setCurrentIndex(0);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFigurine();
  }, [id]);

  const images = figurine?.images?.length ? figurine.images : [];

  const next = useCallback(() => {
    if (!images.length) return;
    setCurrentIndex(i => (i + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    if (!images.length) return;
    setCurrentIndex(i => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const onTouchStart = e => setTouchStartX(e.touches[0].clientX);
  const onTouchEnd = e => {
    if (touchStartX == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const threshold = 50;
    if (dx > threshold) prev();
    if (dx < -threshold) next();
    setTouchStartX(null);
  };

  if (!figurine) return <div style={{ textAlign: "center", marginTop: "100px" }}>Loading...</div>;

  return (
    <div className="page-wrapper">
      <main className="page-content">
        <div className="fd-container">
          <div className="fd-left">
            {images.length ? (
              <div className="fd-img-wrapper" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
                <img
                  src={images[currentIndex]}
                  alt={figurine.title}
                  className="fd-img"
                  draggable="false"
                />
                {images.length > 1 && (
                  <div className="fd-controls">
                    <button onClick={prev}>❮</button>
                    <button onClick={next}>❯</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="fd-img-placeholder">No Image</div>
            )}
          </div>

          <div className="fd-right">
            <h1>{figurine.title}</h1>
            <h2>{Number(figurine.price).toFixed(3)} DT</h2>
            <div>{figurine.category}</div>
            <div style={{ margin: "10px 0", fontWeight: "bold" }}>
              {figurine.inStock ? "In Stock" : "Out of Stock"}
            </div>
            <p>{figurine.description}</p>
            {figurine.inStock && (
              <button className="fd-add-cart" onClick={() => addToCart(figurine)}>
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FigurineDetails;
