import React, { useEffect, useState } from "react";

const ToastNotificacion = ({ id, message, type = "success", removeToast }) => {
  const [visible, setVisible] = useState(true); // Controla si se ve o no

  useEffect(() => {
    // Oculta visualmente después de 3s
    const hideTimer = setTimeout(() => {
      setVisible(false); // Esto activa la clase `toast-exit`
    }, 5000);

    return () => clearTimeout(hideTimer);
  }, []);

  // Cuando termina la animación de salida (CSS dura 0.5s), eliminamos del DOM
  useEffect(() => {
    if (!visible) {
      const removeTimer = setTimeout(() => removeToast(id), 3000); // Espera a que termine animación
      return () => clearTimeout(removeTimer);
    }
  }, [visible, id, removeToast]);

  const handleClose = () => {
    setVisible(false); // Inicia animación de salida manualmente
  };

  return (
    <div
      className={`toast ${visible ? "toast-enter" : "toast-exit"} show align-items-center text-white bg-${type} border-0 mb-2`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="d-flex">
        <div className="toast-body">{message}</div>
        <button
          type="button"
          className="btn-close btn-close-white me-2 m-auto"
          aria-label="Cerrar"
          onClick={handleClose}
        ></button>
      </div>
    </div>
  );
};

export default ToastNotificacion;
