// src/componentes/Carrito.js
import React from "react";

const Carrito = ({ carrito, onIncrease, onDecrease, onCheckout }) => {
  const total = carrito.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckoutConfirmation = () => {
    if (window.confirm("¿Estás seguro de que deseas realizar el pedido y generar la factura?")) {
      onCheckout();
    }
  };

  return (
    <div>
      {carrito.length === 0 ? (
        <p className="text-center text-muted">La cesta está vacía.</p>
      ) : (
        <>
          <ul id="elementos-cesta" className="list-group">
            {carrito.map((item) => (
              <li
                key={item.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <img
                  src={
                    Array.isArray(item.img)
                      ? item.img[0]
                      : item.img?.startsWith("data:") || item.img?.startsWith("/")
                      ? item.img
                      : "/" + item.img
                  }
                  alt={item.name}
                  className="product-img"
                  style={{ maxWidth: "50px" }}
                />
                {item.name} - {item.quantity} u.
                <div>
                  <button
                    className="btn btn-primary btn-sm me-1"
                    onClick={() => onIncrease(item.id)}
                  >
                    ➕
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onDecrease(item.id)}
                  >
                    ➖
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-3">
            <strong>Total:</strong> {total}€
          </p>
          <button className="btn btn-success" onClick={handleCheckoutConfirmation}>
            Realizar Pedido
          </button>
        </>
      )}
    </div>
  );
  
};

export default Carrito;