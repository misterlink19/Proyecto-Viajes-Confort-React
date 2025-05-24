// src/componentes/Navbar.js
import React from 'react';

const Navbar = ({ onAdminClick, modoAdmin }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container">
        <a className="navbar-brand d-flex align-items-center" href="#">
          <img src="/img/logo.jpg" alt="Viaje Confort Logo" className="img-fluid rounded me-2" style={{ maxHeight: '50px' }}/>
          Viaje Confort
        </a>
        <div className="d-flex">
          <button 
            id="toggle-categories" 
            className="btn btn-secondary me-2" 
            data-bs-toggle="offcanvas" 
            data-bs-target="#offcanvasCategorias" 
            aria-controls="offcanvasCategorias">
            Categorías
          </button>
          <button 
            id="toggle-cart" 
            className="btn btn-warning me-2" 
            data-bs-toggle="offcanvas" 
            data-bs-target="#offcanvasCesta" 
            aria-controls="offcanvasCesta">
            🛒 Cesta
          </button>

          {/* Solo se muestra si no está en modo admin */}
          {!modoAdmin && (
            <button id="admin-btn" className="btn btn-danger" onClick={onAdminClick}>
              ⚙️ Admin
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
