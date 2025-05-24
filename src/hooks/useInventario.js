import { useState, useEffect } from "react";

export const useInventario = (categoriasIniciales) => {
  // Se inicializan las categorías a partir del localStorage o de los datos iniciales
  const [categorias, setCategorias] = useState(() => {
    const almacenado = localStorage.getItem("datosCategorias");
    return almacenado ? JSON.parse(almacenado) : categoriasIniciales;
  });

  // Nuevo estado para controlar si ha habido una modificación "relevante"
  const [haHabidoModificacion, setHaHabidoModificacion] = useState(false);

  // Cada vez que cambian las categorías se actualiza el localStorage
  useEffect(() => {
    if (haHabidoModificacion) {
      localStorage.setItem("datosCategorias", JSON.stringify(categorias));
      setHaHabidoModificacion(false); // Reseteamos el flag
    }
  }, [categorias, haHabidoModificacion]);

  // Función para agregar un producto
  // Se valida que el campo 'img' sea un array con al menos una imagen
  const agregarProducto = (datosProducto) => {
    const idCat = parseInt(datosProducto.categoria);
    if (isNaN(idCat) || !Array.isArray(datosProducto.img) || datosProducto.img.length === 0) return false;

    const nuevasCategorias = categorias.map((cat) =>
      cat.id === idCat ? { ...cat, products: [...cat.products,  { id: crypto.randomUUID(), ...datosProducto } ] } : cat
    );

    setCategorias(nuevasCategorias);
    setHaHabidoModificacion(true); // Indicamos que hubo modificación
    return true;
  };

  // Función para editar un producto
  // Si en la edición no se pasan imágenes (o se pasa un array vacío),
  // se conservarán las imágenes que tenía previamente el producto.
  const editarProducto = (idProducto, nuevosDatos) => {
    // Identificar la categoría actual del producto
    let categoriaOrigenId = null;
    const productoOriginal = categorias.find((cat) =>
      cat.products.some((p) => p.id === idProducto)
    );
    if (productoOriginal) {
      categoriaOrigenId = productoOriginal.id;
    }

    const nuevaCategoriaId = parseInt(nuevosDatos.categoria);

    if (categoriaOrigenId !== nuevaCategoriaId) {
      const productoMovido = { ...nuevosDatos };
      const categoriasActualizadas = categorias.map((cat) => {
        if (cat.id === categoriaOrigenId) {
          return {
            ...cat,
            products: cat.products.filter((p) => p.id !== idProducto),
          };
        } else if (cat.id === nuevaCategoriaId) {
          return {
            ...cat,
            products: [...cat.products, productoMovido],
          };
        } else {
          return cat;
        }
      });

      setCategorias(categoriasActualizadas);
    } else {
      const categoriasActualizadas = categorias.map((cat) => ({
        ...cat,
        products: cat.products.map((p) =>
          p.id === idProducto
            ? {
                ...p,
                ...nuevosDatos,
                img:
                  Array.isArray(nuevosDatos.img) && nuevosDatos.img.length > 0
                    ? nuevosDatos.img
                    : p.img,
              }
            : p
        ),
      }));

      setCategorias(categoriasActualizadas);
    }
    setHaHabidoModificacion(true); // Indicamos que hubo modificación
  };

  // Función para eliminar un producto
  const eliminarProducto = (idProducto) => {
    const nuevasCategorias = categorias.map((cat) => ({
      ...cat,
      products: cat.products.filter((p) => p.id !== idProducto),
    }));
    setCategorias(nuevasCategorias);
    setHaHabidoModificacion(true); // Indicamos que hubo modificación
  };
  // Función para agregar una categoría
  const agregarCategoria = (nombre) => {
    if (categorias.some((cat) => cat.name.toLowerCase() === nombre.toLowerCase())) {
      return false;
    }
    const nuevaCategoria = { id: Date.now(), name: nombre, products: [] };
    setCategorias([...categorias, nuevaCategoria]);
    setHaHabidoModificacion(true); // Indicamos que hubo modificación
    return true;
  };

  // Función para editar una categoría
  const editarCategoria = (idCategoria, nuevoNombre) => {
    if (
      categorias.some(
        (cat) => cat.name.toLowerCase() === nuevoNombre.toLowerCase()
      )
    ) {
      return false;
    }
    const nuevasCategorias = categorias.map((cat) =>
      cat.id === parseInt(idCategoria) ? { ...cat, name: nuevoNombre } : cat
    );
    setCategorias(nuevasCategorias);
    setHaHabidoModificacion(true); // Indicamos que hubo modificación
    return true;
  };

  const eliminarCategoria = (idCategoria) => {
    const categoria = categorias.find((cat) => cat.id === parseInt(idCategoria));
    if (!categoria) return false;
    setCategorias(categorias.filter((cat) => cat.id !== parseInt(idCategoria)));
    setHaHabidoModificacion(true); // Indicamos que hubo modificación
    return true;
  };

  return {
    categorias,
    setCategorias,
    agregarProducto,
    editarProducto,
    eliminarProducto,
    agregarCategoria,
    editarCategoria,
    eliminarCategoria,
  };
};

export default useInventario;