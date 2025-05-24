// src/componentes/ProductosCard.js
import React, { useState, useEffect } from "react";

const ProductosCard = ({ producto, onAddToCart }) => {
  const imagenes = Array.isArray(producto.img) ? producto.img : [producto.img];
  const [imgIndex, setImgIndex] = useState(0);
  const [hover, setHover] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    let interval;
    if (hover && imagenes.length > 1) {
      interval = setInterval(() => {
        setImgIndex((prev) => (prev + 1) % imagenes.length);
      }, 2000);
    }else if (!hover) {
      setImgIndex(0); 
    }
    return () => clearInterval(interval);
  }, [hover, imagenes.length]);

  const imgSrc = imagenes[imgIndex].startsWith("data:")
    ? imagenes[imgIndex]
    : "/" + imagenes[imgIndex];

  const botonTexto = producto.stock > 0 ? "Agregar a la cesta" : "Agotado";

  return (
    <>
      <div className="product-card mb-3 p-3 border rounded d-flex gap-3 align-items-center">
        <img
          src={imgSrc}
          alt={producto.name}
          className={`product-img ${hover ? "hover" : ""} ${producto.stock === 0 ? "agotado" : ""}`}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => {
            setHover(false);
            setImgIndex(0);
          }}
          onClick={() => setMostrarModal(true)}
          style={{ cursor: "pointer", maxWidth: "100px" }}
        />

        <div className="product-info">
          <p className="mb-1 text-muted" style={{ fontSize: "0.8rem" }}>
           {producto.id}
          </p>
          <p className="mb-1 fw-bold">{producto.name}</p>
          <p className="mb-1">
            <strong>Precio:</strong> {producto.price}€
          </p>
          <p className="mb-1">
            <strong>Stock:</strong> {producto.stock}
          </p>
          <p className="mb-2" style={{ fontSize: "0.9rem", color: "#555" }}>
            {producto.desc}
          </p>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onAddToCart(producto.id)}
            disabled={producto.stock === 0}
          >
            {botonTexto}
          </button>
        </div>
      </div>

      {/* MODAL DE IMAGEN */}
      {mostrarModal && (
  <div
    className="modal fade show d-block"
    tabIndex="-1"
    style={{ background: "rgba(0,0,0,0.8)" }}
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-body text-center">
          <img src={imgSrc} alt="Zoom" style={{ maxWidth: "100%" }} />
          <p className="mt-3 text-muted">{producto.desc}</p>

          <div className="mt-3">
            <button
              className="btn btn-secondary me-2"
              onClick={() =>
                setImgIndex((imgIndex - 1 + imagenes.length) % imagenes.length)
              }
              disabled={imagenes.length <= 1}
            >
              ⬅️
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setImgIndex((imgIndex + 1) % imagenes.length)}
              disabled={imagenes.length <= 1}
            >
              ➡️
            </button>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-danger" onClick={() => setMostrarModal(false)}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </>
  );
};

export default ProductosCard;
