// src/componentes/AdminProductoModal.js
import React, { useState, useEffect } from "react";
import { Modal, Tab, Tabs, Form, Button, FormSelect } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";

// Constantes de validación
const MAX_PRECIO = 10000;
const MAX_STOCK = 1000;
const MAX_IMAGENES = 5;
const MAX_TAMANO_IMAGEN_MB = 2;

const AdminProductoModal = ({
  show,
  onHide,
  categorias,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  mostrarNotificacion,
}) => {
  // Estado para la pestaña activa
  const [activeTab, setActiveTab] = useState("agregar");
  // Estado para almacenar errores en el formulario (usado en agregar y editar)
  const [erroresFormulario, setErroresFormulario] = useState({});

  // ----- AGREGAR PRODUCTO -----
  // Estado para el formulario de agregar producto (img es un array para múltiples imágenes)
  const [datosFormulario, setDatosFormulario] = useState({
    name: "",
    desc: "",
    price: "",
    stock: "",
    img: [],
    categoria: "",
  });

  // ----- EDITAR PRODUCTO -----
  const [categoriaEditarId, setCategoriaEditarId] = useState("");
  const [productoEditarId, setProductoEditarId] = useState("");
  const [datosEditar, setDatosEditar] = useState({
    name: "",
    desc: "",
    price: "",
    stock: "",
    img: [],
    categoria: "",
  });

  // ----- ELIMINAR PRODUCTO -----
  const [categoriaEliminarId, setCategoriaEliminarId] = useState("");
  const [productoEliminarId, setProductoEliminarId] = useState("");

  // Función para resetear los estados del modal
  const resetearEstadoDeModal = () => {
    setActiveTab("agregar");
    setErroresFormulario({});
    setDatosFormulario({
      name: "",
      desc: "",
      price: "",
      stock: "",
      img: [],
      categoria: "",
    });
    setCategoriaEditarId("");
    setProductoEditarId("");
    setDatosEditar({
      name: "",
      desc: "",
      price: "",
      stock: "",
      img: [],
      categoria: "",
    });
    setCategoriaEliminarId("");
    setProductoEliminarId("");
  };

  // Efecto para resetear el estado del modal cuando se muestra
  useEffect(() => {
    if (show) {
      resetearEstadoDeModal();
    }
  }, [show]);
  // Función para manejar la carga de múltiples imágenes y agregarlas al array actual
  const manejarMultiplesImagenes = (files, setter, imagenesActuales) => {
    const archivosArray = Array.from(files);
    // Verificar que no se exceda el máximo de imágenes permitidas
    if (imagenesActuales.length + archivosArray.length > MAX_IMAGENES) {
      mostrarNotificacion(
        `Máximo ${MAX_IMAGENES} imágenes permitidas`,
        "warning"
      );
      return;
    }
    const promesas = archivosArray.map((archivo) => {
      return new Promise((resolve, reject) => {
        if (!archivo.type.startsWith("image/")) {
          reject("El archivo debe ser una imagen válida");
          return;
        }
        if (archivo.size / 1024 / 1024 > MAX_TAMANO_IMAGEN_MB) {
          reject(`Cada imagen debe pesar menos de ${MAX_TAMANO_IMAGEN_MB}MB`);
          return;
        }
        const lector = new FileReader();
        lector.onload = (e) => resolve(e.target.result);
        lector.onerror = () => reject("Error al leer la imagen");
        lector.readAsDataURL(archivo);
      });
    });
    Promise.all(promesas)
      .then((imagenesBase64) => {
        setter([...imagenesActuales, ...imagenesBase64]);
      })
      .catch((error) => {
        mostrarNotificacion(error, "warning");
      });
  };

  // Función para eliminar una imagen individual del array
  const eliminarImagen = (indice, setter, imagenesActuales) => {
    const nuevasImagenes = imagenesActuales.filter((_, i) => i !== indice);
    setter(nuevasImagenes);
  };

  // Función de validación compartida para formularios de producto (agregar y editar)
  const validarFormularioProducto = (datos) => {
    const errores = {};
    if (!datos.name.trim() || datos.name.trim().length < 3) {
      errores.name = "El nombre debe tener al menos 3 caracteres";
    }
    if (!datos.desc || datos.desc.trim().length < 15) {
      errores.desc = "La descripción debe tener al menos 15 caracteres";
    }

    if (
      !datos.price ||
      parseFloat(datos.price) <= 0 ||
      parseFloat(datos.price) > MAX_PRECIO
    ) {
      errores.price = `Precio inválido (debe ser mayor que 0 y menor o igual a ${MAX_PRECIO})`;
    }
    if (
      !datos.stock ||
      parseInt(datos.stock) < 0 ||
      parseInt(datos.stock) > MAX_STOCK
    ) {
      errores.stock = `Stock inválido (debe ser 0 o mayor y menor o igual a ${MAX_STOCK})`;
    }
    if (!datos.img || datos.img.length === 0) {
      errores.img = "Se requiere al menos una imagen";
    }
    if (!datos.categoria) {
      errores.categoria = "Selecciona una categoría";
    }
    return errores;
  };

  // ---------- Funciones para AGREGAR PRODUCTO ----------
  const manejarEnvioAgregar = (e) => {
    e.preventDefault();
    const errores = validarFormularioProducto(datosFormulario);
    setErroresFormulario(errores);
    if (Object.keys(errores).length > 0) return;

    const datos = {
      id: crypto.randomUUID(),
      name: datosFormulario.name.trim(),
      desc: datosFormulario.desc.trim(),
      price: parseFloat(datosFormulario.price),
      stock: parseInt(datosFormulario.stock),
      img: datosFormulario.img,
      categoria: datosFormulario.categoria,
    };
    console.log("Datos del producto a agregar:", datos); // <-- Agrega esto
    const exito = onAddProduct(datos);
    if (exito) {
      mostrarNotificacion("Producto agregado con éxito", "success");
      setDatosFormulario({
        name: "",
        price: "",
        stock: "",
        img: [],
        categoria: "",
        desc: "",
      });
      setErroresFormulario({});
      onHide();
    } else {
      mostrarNotificacion("Producto duplicado o datos inválidos", "danger");
    }
  };

  // ---------- Funciones para EDITAR PRODUCTO ----------
  const manejarCambioEditarCategoria = (e) => {
    setCategoriaEditarId(e.target.value);
    setProductoEditarId("");
    setDatosEditar({
      name: "",
      price: "",
      stock: "",
      img: [],
      categoria: "",
      desc: "",
    });
  };

  const manejarCambioEditarProducto = (e) => {
    const prodId = e.target.value;
    setProductoEditarId(prodId);
    const cat = categorias.find((c) => c.id.toString() === categoriaEditarId);
    const prod = cat?.products.find((p) => p.id === prodId);
    if (prod) {
      // Se conservan las imágenes actuales si no se cargan nuevas en edición
      setDatosEditar({ ...prod, categoria: cat.id });
    }
  };

  const manejarEnvioEditar = (e) => {
    e.preventDefault();

    const errores = validarFormularioProducto(datosEditar);
    setErroresFormulario(errores);
    if (Object.keys(errores).length > 0) return;

    const productoEditado = {
      ...datosEditar,
      name: datosEditar.name.trim(),
      desc: datosEditar.desc.trim(),
      price: parseFloat(datosEditar.price),
      stock: parseInt(datosEditar.stock),
      img: datosEditar.img,
      categoria: datosEditar.categoria,
    };

    // Llamamos directamente a onEditProduct
    onEditProduct(productoEditarId, productoEditado);

    mostrarNotificacion("Producto editado con éxito", "info");
    setProductoEditarId("");
    setDatosEditar({
      name: "",
      price: "",
      stock: "",
      img: [],
      categoria: "",
      desc: "",
    });
    setErroresFormulario({});
    onHide();
  };

  // ---------- Funciones para ELIMINAR PRODUCTO ----------
  const manejarConfirmarEliminar = () => {
    if (productoEliminarId) {
      onDeleteProduct(productoEliminarId);
      mostrarNotificacion("Producto eliminado correctamente", "warning");
      setProductoEliminarId("");
      onHide();
    }
  };

  // Función para renderizar la previsualización de imágenes para agregar
  const renderizarPrevisualizacionImagenes = (imagenes, setter) => (
    <div className="d-flex flex-wrap mt-2 gap-2">
      {imagenes.map((src, i) => (
        <div
          key={i}
          className="preview-wrapper"
          style={{ position: "relative" }}
        >
          <img
            src={src}
            alt={`previsualizacion-${i}`}
            className="preview-img"
            style={{
              maxWidth: "100px",
              border: "1px solid #ccc",
              padding: "2px",
            }}
          />
          <button
            type="button"
            className="preview-remove btn btn-sm btn-danger"
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
            onClick={() =>
              eliminarImagen(
                i,
                (nuevasImagenes) =>
                  setDatosFormulario({
                    ...datosFormulario,
                    img: nuevasImagenes,
                  }),
                imagenes
              )
            }
          >
            <AiOutlineClose size={14} />
          </button>
        </div>
      ))}
    </div>
  );

  // Función para renderizar la previsualización de imágenes para editar
  const renderizarPrevisualizacionImagenesEditar = (imagenes, setter) => (
    <div className="d-flex flex-wrap mt-2 gap-2">
      {imagenes.map((src, i) => (
        <div
          key={i}
          className="preview-wrapper"
          style={{ position: "relative" }}
        >
          <img
            src={src}
            alt={`previsualizacion-${i}`}
            className="preview-img"
            style={{
              maxWidth: "100px",
              border: "1px solid #ccc",
              padding: "2px",
            }}
          />
          <button
            type="button"
            className="preview-remove btn btn-sm btn-danger"
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
            onClick={() =>
              eliminarImagen(
                i,
                (nuevasImagenes) =>
                  setDatosEditar({ ...datosEditar, img: nuevasImagenes }),
                imagenes
              )
            }
          >
            <AiOutlineClose size={14} />
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      onShow={() => setActiveTab("agregar")}
    >
      <Modal.Header closeButton>
        <Modal.Title>Administrar Productos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-3">
          {/* TAB: AGREGAR */}
          <Tab eventKey="agregar" title="Agregar">
            <Form onSubmit={manejarEnvioAgregar}>
              {/* Campo para nombre */}
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={datosFormulario.name}
                  onChange={(e) => {
                    setDatosFormulario({
                      ...datosFormulario,
                      name: e.target.value,
                    });
                    setErroresFormulario({ ...erroresFormulario, name: "" });
                  }}
                  isInvalid={!!erroresFormulario.name}
                />
                <Form.Control.Feedback type="invalid">
                  {erroresFormulario.name}
                </Form.Control.Feedback>
              </Form.Group>
              {/* Campo para descripcion */}
              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  type="text"
                  value={datosFormulario.desc}
                  onChange={(e) =>
                    setDatosFormulario({
                      ...datosFormulario,
                      desc: e.target.value,
                    })
                  }
                  isInvalid={!!erroresFormulario.desc}
                />
                <Form.Control.Feedback type="invalid">
                  {erroresFormulario.desc}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Campo para precio */}
              <Form.Group className="mb-3">
                <Form.Label>Precio</Form.Label>
                <Form.Control
                  type="number"
                  value={datosFormulario.price}
                  onChange={(e) =>
                    setDatosFormulario({
                      ...datosFormulario,
                      price: e.target.value,
                    })
                  }
                  isInvalid={!!erroresFormulario.price}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {erroresFormulario.price}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Campo para stock */}
              <Form.Group className="mb-3">
                <Form.Label>Stock</Form.Label>
                <Form.Control
                  type="number"
                  value={datosFormulario.stock}
                  onChange={(e) =>
                    setDatosFormulario({
                      ...datosFormulario,
                      stock: e.target.value,
                    })
                  }
                  isInvalid={!!erroresFormulario.stock}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {erroresFormulario.stock}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Campo para imágenes múltiples */}
              <Form.Group className="mb-3">
                <Form.Label>Imágenes</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) =>
                    manejarMultiplesImagenes(
                      e.target.files,
                      (imgs) =>
                        setDatosFormulario({ ...datosFormulario, img: imgs }),
                      datosFormulario.img
                    )
                  }
                  isInvalid={!!erroresFormulario.img}
                  required
                />
                {erroresFormulario.img && (
                  <Form.Control.Feedback type="invalid">
                    {erroresFormulario.img}
                  </Form.Control.Feedback>
                )}
                {Array.isArray(datosFormulario.img) &&
                  datosFormulario.img.length > 0 &&
                  renderizarPrevisualizacionImagenes(
                    datosFormulario.img,
                    (imgs) =>
                      setDatosFormulario({ ...datosFormulario, img: imgs })
                  )}
              </Form.Group>

              {/* Selección de categoría */}
              <Form.Group className="mb-3">
                <Form.Label>Categoría</Form.Label>
                <FormSelect
                  value={datosFormulario.categoria}
                  onChange={(e) =>
                    setDatosFormulario({
                      ...datosFormulario,
                      categoria: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </FormSelect>
              </Form.Group>

              <Button type="submit" variant="success">
                Guardar Producto
              </Button>
            </Form>
          </Tab>

          {/* TAB: EDITAR */}
          <Tab eventKey="editar" title="Editar">
            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <FormSelect
                value={categoriaEditarId}
                onChange={manejarCambioEditarCategoria}
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </FormSelect>
            </Form.Group>

            {categoriaEditarId && (
              <Form.Group className="mb-3">
                <Form.Label>Producto</Form.Label>
                <FormSelect
                  value={productoEditarId}
                  onChange={manejarCambioEditarProducto}
                >
                  <option value="">Selecciona un producto</option>
                  {categorias
                    .find((c) => c.id.toString() === categoriaEditarId)
                    ?.products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                </FormSelect>
              </Form.Group>
            )}

            {productoEditarId && (
              <Form onSubmit={manejarEnvioEditar} className="mt-3">
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    value={datosEditar.name}
                    onChange={(e) =>
                      setDatosEditar({ ...datosEditar, name: e.target.value })
                    }
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    type="text"
                    value={datosEditar.desc}
                    onChange={(e) =>
                      setDatosEditar({ ...datosEditar, desc: e.target.value })
                    }
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Precio</Form.Label>
                  <Form.Control
                    type="number"
                    value={datosEditar.price}
                    onChange={(e) =>
                      setDatosEditar({ ...datosEditar, price: e.target.value })
                    }
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    value={datosEditar.stock}
                    onChange={(e) =>
                      setDatosEditar({ ...datosEditar, stock: e.target.value })
                    }
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Imágenes (opcional)</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) =>
                      manejarMultiplesImagenes(
                        e.target.files,
                        (imgs) => setDatosEditar({ ...datosEditar, img: imgs }),
                        datosEditar.img
                      )
                    }
                    isInvalid={!!erroresFormulario.img} // <---- MODIFICAR AQUÍ: Añadir isInvalid
                  />
                  {erroresFormulario.img && ( // <---- AÑADIR AQUÍ: Condicional para mostrar el feedback
                    <Form.Control.Feedback type="invalid">
                      {erroresFormulario.img}{" "}
                      {/* <---- AÑADIR AQUÍ: Mostrar el mensaje de error */}
                    </Form.Control.Feedback>
                  )}
                  {Array.isArray(datosEditar.img) &&
                    datosEditar.img.length > 0 &&
                    renderizarPrevisualizacionImagenesEditar(
                      datosEditar.img,
                      (imgs) => setDatosEditar({ ...datosEditar, img: imgs })
                    )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Categoría</Form.Label>
                  <FormSelect
                    value={datosEditar.categoria}
                    onChange={(e) =>
                      setDatosEditar({
                        ...datosEditar,
                        categoria: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Selecciona una categoría</option>
                    {categorias.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </FormSelect>
                </Form.Group>

                <Button type="submit" variant="primary">
                  Guardar Cambios
                </Button>
              </Form>
            )}
          </Tab>

          {/* TAB: ELIMINAR */}
          <Tab eventKey="eliminar" title="Eliminar">
            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <FormSelect
                value={categoriaEliminarId}
                onChange={(e) => {
                  setCategoriaEliminarId(e.target.value);
                  setProductoEliminarId("");
                }}
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </FormSelect>
            </Form.Group>

            {categoriaEliminarId && (
              <Form.Group className="mb-3">
                <Form.Label>Producto</Form.Label>
                <FormSelect
                  value={productoEliminarId}
                  onChange={(e) => setProductoEliminarId(e.target.value)}
                >
                  <option value="">Selecciona un producto</option>
                  {categorias
                    .find((c) => c.id.toString() === categoriaEliminarId)
                    ?.products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                </FormSelect>
              </Form.Group>
            )}

            {productoEliminarId &&
              (() => {
                const categoria = categorias.find(
                  (c) => c.id.toString() === categoriaEliminarId
                );
                const producto = categoria?.products.find(
                  (p) => p.id === productoEliminarId
                );
                if (!producto) return null;

                return (
                  <div className="mt-3">
                    <h5>Detalles del producto:</h5>
                    <ul>
                      <li>
                        <strong>ID:</strong> {producto.id}
                      </li>
                      <li>
                        <strong>Nombre:</strong> {producto.name}
                      </li>
                      <li>
                        <strong>Descripción:</strong> {producto.desc}
                      </li>
                      <li>
                        <strong>Precio:</strong> {producto.price} €
                      </li>
                      <li>
                        <strong>Stock:</strong> {producto.stock}
                      </li>
                      <li>
                        <strong>Imágenes:</strong>
                      </li>
                      <ul className="d-flex flex-wrap gap-2">
                        {Array.isArray(producto.img) &&
                          producto.img.map((src, idx) => (
                            <li key={idx}>
                              <img
                                src={src}
                                alt={`img-${idx}`}
                                style={{
                                  maxWidth: "100px",
                                  border: "1px solid #ccc",
                                  padding: "2px",
                                  borderRadius: "4px",
                                }}
                              />
                            </li>
                          ))}
                      </ul>
                    </ul>

                    <p className="text-danger mt-3">
                      ¿Estás seguro de que deseas eliminar este producto?
                    </p>
                    <Button variant="danger" onClick={manejarConfirmarEliminar}>
                      Eliminar
                    </Button>
                  </div>
                );
              })()}
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
};

export default AdminProductoModal;
