// src/componentes/AdminCategoriaModal.js
import React, { useState , useEffect} from "react";
import { Modal, Tab, Tabs, Form, Button, FormSelect } from "react-bootstrap";

const AdminCategoriaModal = ({
  show,
  onHide,
  categorias,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  mostrarNotificacion,
}) => {
  const [activeTab, setActiveTab] = useState("agregar");
  const [addCategoryName, setAddCategoryName] = useState("");
  const [selectedCategoryToEdit, setSelectedCategoryToEdit] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [selectedCategoryToDelete, setSelectedCategoryToDelete] =
    useState(null);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [errorAdd, setErrorAdd] = useState("");
 
  // Función para resetear los estados del modal
   const resetearEstadoDeModal = () => {
    setActiveTab("agregar");
    setAddCategoryName("");
    setErrorAdd("");
    setSelectedCategoryToEdit(null);
    setEditCategoryName("");
    setSelectedCategoryToDelete(null);
    setShowDeleteWarning(false);
  };

   // Efecto para resetear el estado del modal cuando se muestra
   useEffect(() => {
    if (show) {
      resetearEstadoDeModal();
    }
  }, [show]);

  //  Agregar Categoría
  const handleAddCategorySubmit = (e) => {
    e.preventDefault();
    const nombreValido = addCategoryName.trim();

    if (nombreValido.length < 3) {
      setErrorAdd("Debe tener al menos 3 caracteres");
      return;
    }

    const éxito = onAddCategory(nombreValido);
    if (éxito) {
      mostrarNotificacion("Categoría agregada con éxito", "success");
      setAddCategoryName("");
      setErrorAdd("");
      onHide();
    } else {
      setErrorAdd("Ya existe una categoría con ese nombre");
    }
  };

  // Editar Categoría
  const handleEditCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategoryToEdit(categoryId);
    if (categoryId) {
      const category = categorias.find((c) => c.id.toString() === categoryId);
      if (category) {
        setEditCategoryName(category.name);
      }
    } else {
      setSelectedCategoryToEdit(null);
      setEditCategoryName("");
    }
  };

  const handleConfirmEditCategory = () => {
    if (!selectedCategoryToEdit || editCategoryName.trim().length < 3) {
      mostrarNotificacion("Nombre inválido", "danger");
      return;
    }

    const éxito = onEditCategory(
      selectedCategoryToEdit,
      editCategoryName.trim()
    );
    if (éxito) {
      mostrarNotificacion("Categoría editada correctamente", "info");
      setSelectedCategoryToEdit(null);
      setEditCategoryName("");
      onHide();
    } else {
      mostrarNotificacion("Ya existe una categoría con ese nombre", "warning");
    }
  };

  // 🚀 Eliminar Categoría con verificación de productos
  const handleDeleteCategoryChange = (e) => {
    setSelectedCategoryToDelete(e.target.value);
    setShowDeleteWarning(false); // Resetear advertencia al cambiar la selección
  };

  const handleInitiateDeleteCategory = () => {
    const categoria = categorias.find(
      (c) => c.id.toString() === selectedCategoryToDelete
    );

    if (categoria && categoria.products && categoria.products.length > 0) {
      setShowDeleteWarning(true);
    } else if (selectedCategoryToDelete) {
      eliminarCategoriaDefinitivamente();
    }
  };

  const eliminarCategoriaDefinitivamente = () => {
    onDeleteCategory(selectedCategoryToDelete);
    mostrarNotificacion("Categoría eliminada", "danger");
    setSelectedCategoryToDelete(null);
    setShowDeleteWarning(false);
    onHide();
  };

  const handleCancelDelete = () => {
    setShowDeleteWarning(false);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" onShow={() => setActiveTab("agregar")}>
      <Modal.Header closeButton>
        <Modal.Title>Administrar Categorías</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-3"
        >
          {/* TAB: AGREGAR */}
          <Tab eventKey="agregar" title="Agregar">
            <Form onSubmit={handleAddCategorySubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre de la Categoría</Form.Label>
                <Form.Control
                  type="text"
                  value={addCategoryName}
                  onChange={(e) => {
                    setAddCategoryName(e.target.value);
                    setErrorAdd("");
                  }}
                  isInvalid={!!errorAdd}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errorAdd}
                </Form.Control.Feedback>
              </Form.Group>
              <Button type="submit" variant="success">
                Agregar Categoría
              </Button>
            </Form>
          </Tab>

          {/* TAB: EDITAR */}
          <Tab eventKey="editar" title="Editar">
            <FormSelect
              value={selectedCategoryToEdit || ""}
              onChange={handleEditCategoryChange}
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </FormSelect>
            {selectedCategoryToEdit && (
              <Form
                className="mt-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleConfirmEditCategory();
                }}
              >
                <Form.Group className="mb-3">
                  <Form.Label>Nuevo Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button type="submit" variant="primary">
                  Guardar Cambios
                </Button>
              </Form>
            )}
          </Tab>

          {/* TAB: ELIMINAR */}
          <Tab eventKey="eliminar" title="Eliminar">
            <FormSelect
              value={selectedCategoryToDelete || ""}
              onChange={handleDeleteCategoryChange}
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </FormSelect>

            {selectedCategoryToDelete && (
              <div className="mt-3">
                {/* Mostrar detalles de la categoría seleccionada */}
                {(() => {
                  const cat = categorias.find(
                    (c) => c.id.toString() === selectedCategoryToDelete
                  );
                  if (!cat) return null;

                  return (
                    <div className="mb-3">
                      <h5>Detalles de la categoría:</h5>
                      <ul>
                        <li>
                          <strong>ID:</strong> {cat.id}
                        </li>
                        <li>
                          <strong>Nombre:</strong> {cat.name}
                        </li>
                        <li>
                          <strong>Total de productos:</strong>{" "}
                          {cat.products?.length || 0}
                        </li>
                        {cat.products?.length > 0 && (
                          <li>
                            <strong>Productos:</strong>
                            <ul>
                              {cat.products.map((p) => (
                                <li key={p.id}>
                                  {p.name} (ID: {p.id})
                                </li>
                              ))}
                            </ul>
                          </li>
                        )}
                      </ul>
                    </div>
                  );
                })()}

                {/* Confirmación de eliminación */}
                {showDeleteWarning ? (
                  <div>
                    <p>
                      Esta categoría contiene productos. ¿Estás seguro de que
                      deseas eliminarla?
                    </p>
                    <Button
                      variant="danger"
                      onClick={eliminarCategoriaDefinitivamente}
                    >
                      Sí, eliminar
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleCancelDelete}
                      className="ms-2"
                    >
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p>¿Seguro que quieres eliminar esta categoría?</p>
                    <Button
                      variant="danger"
                      onClick={handleInitiateDeleteCategory}
                    >
                      Eliminar
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
};

export default AdminCategoriaModal;
