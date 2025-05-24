import React from 'react';

const AdminPanel = ({ onClose, onOpenProductModal, onOpenCategoryModal }) => {
  return (
    <div id="panel-admin" className="container mt-3">
      <h2>Panel de Administración</h2>
      <div className="mb-2">
        <button className="btn btn-primary me-2" onClick={onOpenProductModal}>
          Productos
        </button>
        <button className="btn btn-primary me-2" onClick={onOpenCategoryModal}>
          Categorías
        </button>
        <button className="btn btn-secondary" onClick={onClose}>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
