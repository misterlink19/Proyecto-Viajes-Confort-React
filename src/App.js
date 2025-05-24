// src/App.js
import React, { useState, useEffect } from "react";
import Navbar from "./componentes/Navbar";
import ProductosList from "./componentes/ProductosList";
import Carrito from "./componentes/Carrito";
import AdminPanel from "./componentes/AdminPanel";
import AdminProductoModal from "./componentes/AdminProductoModal";
import AdminCategoriaModal from "./componentes/AdminCategoriaModal";
import ToastNotificacion from "./componentes/ToastNotificacion";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

//  hooks personalizados
import { useInventario } from "./hooks/useInventario";
import { useCarrito } from "./hooks/useCarrito";

function App() {
  // Datos iniciales para las categorías y productos
  const categoriasIniciales =JSON.parse(localStorage.getItem("datosCategorias")) || [
    {
      id: 1,
      name: "Maletas de Cabina",
      products: [
        {
          id: crypto.randomUUID(),
          name: "Maleta Rigida Mediana azul",
          desc: "Maleta resistente de tamaño mediano, con carcasa rígida y múltiples compartimentos interiores.",
          price: 45,
          stock: 10,
          img: [
            "img/maleta-rigida-mediana-flow-azul.jpg",
            "img/maleta-rigida-mediana-flow-azul2.jpg",
            "img/maleta-rigida-mediana-flow-azul3.jpg",
            "img/maleta-rigida-mediana-flow-azul4.jpg",
            "img/maleta-rigida-mediana-flow-azul5.jpg"
          ]
        },
        {
          id: crypto.randomUUID(),
          name: "Maleta Gladiatior Mediana azul",
          desc: "Modelo Gladiator con diseño ligero y ruedas multidireccionales, ideal para viajes de mediana duración.",
          price: 70,
          stock: 5,
          img: [
            "img/maleta-mediana-gladiator-azul-claro.jpg",
            "img/maleta-mediana-gladiator-azul-claro2.jpg",
            "img/maleta-mediana-gladiator-azul-claro3.jpg",
            "img/maleta-mediana-gladiator-azul-claro4.jpg",
            "img/maleta-mediana-gladiator-azul-claro5.jpg"
          ]
        },
        {
          id: crypto.randomUUID(),
          name: "Maleta Pepe jeans Mediana amarilla",
          desc: "Maleta amarilla con acabado ABS y candado TSA. Moderna, llamativa y segura para todo tipo de viajes.",
          price: 34,
          stock: 9,
          img: [
            "img/maleta-abs-70cm-highlight-ocre-pepe-jeans.jpg",
            "img/maleta-abs-70cm-highlight-ocre-pepe-jeans2.jpg",
            "img/maleta-abs-70cm-highlight-ocre-pepe-jeans3.jpg",
            "img/maleta-abs-70cm-highlight-ocre-pepe-jeans4.jpg",
            "img/maleta-abs-70cm-highlight-ocre-pepe-jeans5.jpg"
          ]
        },
      ],
    },
    {
      id: 2,
      name: "Bolsa de mano",
      products: [
        {
          id: crypto.randomUUID(),
          name: "Bolsa de mano de viajero",
          desc: "Elegante y funcional, ideal para llevar lo esencial en cabina. Diseño sobrio y resistente al agua.",
          price: 100,
          stock: 8,
          img: [
            "img/Bolsa-de-Mano-negra.jpg",
            "img/Bolsa-de-Mano-negra2.jpg",
          ]
        },
        {
          id: crypto.randomUUID(),
          name: "Bolsa de mano Negro",
          desc: "Bolsa tipo mochila de diseño ergonómico, perfecta para viajes cortos o como equipaje adicional.",
          price: 100,
          stock: 8,
          img: [
            "img/Mochila-bulto.jpg",
            "img/Mochila-bulto2.jpg",
            "img/Mochila-bulto3.jpg",
            "img/Mochila-bulto4.jpg",
            "img/Mochila-bulto5.jpg",
          ]
        },
        {
          id: crypto.randomUUID(),
          name: "Bolso de mano negro",
          desc: "Bolso de tela con correa ajustable y múltiples bolsillos. Comodidad y estilo para tus desplazamientos.",
          price: 100,
          stock: 8,
          img: [
            "img/Bulto-de-mano-negro.jpg",
            "img/Bulto-de-mano-negro2.jpg",
            "img/Bulto-de-mano-negro3.jpg",
            "img/Bulto-de-mano-negro4.jpg",
          ]
        },
      ],
    },
    {
      id: 3,
      name: "Set de maletas",
      products: [
        {
          id: crypto.randomUUID(),
          name: "Set de maletas rojas de tela",
          desc: "Set completo de 5 piezas de maletas de tela, resistentes, livianas y de gran capacidad.",
          price: 100,
          stock: 8,
          img: [
            "img/Set-Maletas-rojas-de-tela.png",
            "img/Set-Maletas-rojas-de-tela2.png",
            "img/Set-Maletas-rojas-de-tela3.png",
            "img/Set-Maletas-rojas-de-tela4.png",
            "img/Set-Maletas-rojas-de-tela5.png",
          ]
        },
        {
          id: crypto.randomUUID(),
          name: "Set de maletas rojas rigidas",
          desc: "Set de maletas rígidas con sistema spinner y carcasa dura. Protección y diseño vibrante.",
          price: 100,
          stock: 8,
          img: [
            "img/Set-Maletas-Rojas-rigidas.jpg",
            "img/Set-Maletas-Rojas-rigidas2.jpg",
            "img/Set-Maletas-Rojas-rigidas3.jpg",
            "img/Set-Maletas-Rojas-rigidas4.jpg",
          ]
        },
      ],
    },
  ];
  

  // Usamos nuestro hook de inventario para gestionar las categorías y productos
  const {
    categorias,
    setCategorias,
    agregarProducto,
    editarProducto,
    eliminarProducto,
    agregarCategoria,
    editarCategoria,
    eliminarCategoria,
  } = useInventario(categoriasIniciales);

  // Usamos el hook del carrito para gestionar la cesta
  const { carrito, añadirAlCarrito, quitarDelCarrito, checkout } = useCarrito();

  // Estados globales para modo administrador, modales y notificaciones
  const [modoAdmin, setModoAdmin] = useState(false);
  const [mostrarModalProducto, setMostrarModalProducto] = useState(false);
  const [mostrarModalCategoria, setMostrarModalCategoria] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  // Función para mostrar notificaciones
  const mostrarNotificacion = (mensaje, tipo) => {
    const newToast = {
      id: generarIdUnico(),
      message: mensaje,
      type: tipo,
    };
    setToasts((prevToasts) => [...prevToasts, newToast]);
  };

  // --- Funciones del carrito ---
  const manejarAgregarAlCarrito = (idProducto) => {
    // Buscamos la categoría que contiene el producto
    const categoria = categorias.find((cat) =>
      cat.products.some((p) => p.id === idProducto)
    );
    if (!categoria) return;
    const producto = categoria.products.find((p) => p.id === idProducto);
    if (producto.stock <= 0) {
      mostrarNotificacion("No hay más stock disponible", "danger");
      return;
    }
    // Agregamos al carrito y actualizamos el inventario mediante el hook useCarrito
    añadirAlCarrito(producto, () => {});
    const actualizado = categorias.map((cat) => ({
      ...cat,
      products: cat.products.map((p) =>
        p.id === idProducto ? { ...p, stock: p.stock - 1 } : p
      )
    }));
    setCategorias(actualizado);
    mostrarNotificacion("Producto agregado a la cesta", "success");
  };

  const manejarEliminarDelCarrito = (idProducto) => {
    quitarDelCarrito(idProducto, () => {});

    const actualizado = categorias.map((cat) => ({
      ...cat,
      products: cat.products.map((p) =>
        p.id === idProducto ? { ...p, stock: p.stock + 1 } : p
      )
    }));
    setCategorias(actualizado);
    mostrarNotificacion("Producto removido de la cesta", "info");
  };

  const manejarCheckout = () => {
    const factura = checkout();
    if (factura) {
      localStorage.setItem("datosCategorias", JSON.stringify(categorias));
      // Crear enlace para descargar la factura
      const link = document.createElement("a");
      link.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(factura)
      );
      link.setAttribute("download", "factura_" + Date.now() + ".txt");
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      mostrarNotificacion(
        "Pedido realizado con éxito. Factura descargada.",
        "success"
      );
    } else {
      mostrarNotificacion("La cesta está vacía", "warning");
    }
  };
  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  let toastIdCounter = 0;
  const generarIdUnico = () => {
    toastIdCounter += 1;
    return toastIdCounter + "_" + new Date().getTime();
  };

  const categoriasParaMostrar = categoriaSeleccionada
    ? categorias.filter((cat) => cat.id === categoriaSeleccionada)
    : categorias;
  return (
    <div>
      {/* Navbar */}
      <Navbar
        modoAdmin={modoAdmin}
        onAdminClick={() => {
          const pass = prompt("Introduce la contraseña de administrador:");
          if (pass === "123456") {
            setModoAdmin(true);
            mostrarNotificacion("Acceso concedido", "success");
          } else {
            mostrarNotificacion("Contraseña incorrecta", "danger");
          }
        }}
      />

      {/* Panel de Administración (visible solo en modo admin) */}
      {modoAdmin && (
        <AdminPanel
          onClose={() => setModoAdmin(false)}
          onOpenProductModal={() => setMostrarModalProducto(true)}
          onOpenCategoryModal={() => setMostrarModalCategoria(true)}
        />
      )}

      {/* Offcanvas para Categorías */}
      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="offcanvasCategorias"
        aria-labelledby="offcanvasCategoriasLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasCategoriasLabel">
            Categorías
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Cerrar"
          ></button>
        </div>
        <div className="offcanvas-body">
          <ul className="list-group">
            <li
              className={`list-group-item ${
                categoriaSeleccionada === null ? "active" : ""
              }`}
              onClick={() => setCategoriaSeleccionada(null)}
              data-bs-dismiss="offcanvas"
              style={{ cursor: "pointer" }}
            >
              Todas las categorías
            </li>
            {categorias.map((cat) => (
              <li
                key={cat.id}
                className={`list-group-item ${
                  categoriaSeleccionada === cat.id ? "active" : ""
                }`}
                onClick={() => setCategoriaSeleccionada(cat.id)}
                data-bs-dismiss="offcanvas"
                style={{ cursor: "pointer" }}
              >
                {cat.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Offcanvas para Cesta */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="offcanvasCesta"
        aria-labelledby="offcanvasCestaLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasCestaLabel">
            Cesta
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Cerrar"
          ></button>
        </div>
        <div className="offcanvas-body">
          <Carrito
            carrito={carrito}
            onIncrease={manejarAgregarAlCarrito}
            onDecrease={manejarEliminarDelCarrito}
            onCheckout={manejarCheckout}
          />
        </div>
      </div>

      {/* Contenido Principal: Lista de Productos */}
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-8">
            {/* Renderiza el h2 condicionalmente solo si no se selecciona una categoría */}
            {categoriaSeleccionada === null && (
              <h2 className="mb-3">
                {categoriaSeleccionada
                  ? categorias.find((c) => c.id === categoriaSeleccionada)?.name
                  : "Todas las categorías"}
              </h2>
            )}
            <ProductosList
              categorias={categoriasParaMostrar}
              onAddToCart={manejarAgregarAlCarrito}
            />
          </div>
        </div>
      </div>

      {/* Notificaciones */}
      <div
        className="toast-container position-fixed bottom-0 end-0 p-3"
        style={{ zIndex: 9999 }}
      >
        {toasts.map((toast) => (
          <ToastNotificacion
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            removeToast={removeToast}
          />
        ))}
      </div>

      {/* Modales de Administración */}
      <AdminProductoModal
        show={mostrarModalProducto}
        onHide={() => setMostrarModalProducto(false)}
        categorias={categorias}
        onAddProduct={agregarProducto}
        onEditProduct={editarProducto}
        onDeleteProduct={eliminarProducto}
        mostrarNotificacion={mostrarNotificacion}
      />

      <AdminCategoriaModal
        show={mostrarModalCategoria}
        onHide={() => setMostrarModalCategoria(false)}
        categorias={categorias}
        onAddCategory={agregarCategoria}
        onEditCategory={editarCategoria}
        onDeleteCategory={eliminarCategoria}
        mostrarNotificacion={mostrarNotificacion}
      />
    </div>
  );
}

export default App;
