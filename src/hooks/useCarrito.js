// src/hooks/useCarrito.js
import { useState } from 'react';

export const useCarrito = () => {
  const [carrito, setCarrito] = useState([]);

  // Función para añadir un producto al carrito
  const añadirAlCarrito = (producto, actualizarInventario) => {
    setCarrito(prevCarrito => {
      const itemExistente = prevCarrito.find(item => item.id === producto.id);
      if (itemExistente) {
        return prevCarrito.map(item =>
          item.id === producto.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCarrito, { ...producto, quantity: 1 }];
    });
    // Actualizar el inventario (disminuir stock)
    actualizarInventario(producto.id, -1);
  };

  // Función para quitar un producto del carrito
  const quitarDelCarrito = (idProducto, actualizarInventario) => {
    setCarrito(prevCarrito => {
      const item = prevCarrito.find(item => item.id === idProducto);
      if (item) {
        if (item.quantity === 1) {
          return prevCarrito.filter(item => item.id !== idProducto);
        } else {
          return prevCarrito.map(item =>
            item.id === idProducto ? { ...item, quantity: item.quantity - 1 } : item
          );
        }
      }
      return prevCarrito;
    });
    // Devolver stock al inventario
    actualizarInventario(idProducto, 1);
  };

  // Función para realizar el checkout: genera la factura y vacía el carrito
  const checkout = () => {
    if (carrito.length === 0) return null;

    let factura = '========================================\n';
    factura += '           FACTURA DE PEDIDO           \n';
    factura += '========================================\n\n';

    // Calcular la longitud máxima del nombre del artículo
    let maxNombreLength = 20; // Longitud mínima
    carrito.forEach(item => {
        if (item.name.length > maxNombreLength) {
            maxNombreLength = item.name.length;
        }
    });

    // Encabezado de las columnas
    factura += `Artículo${' '.repeat(maxNombreLength - 8)} | Cant. |  Precio/u | Total     \n`;
    factura += `${'-'.repeat(maxNombreLength +1)}|-------|-----------|-----------\n`;

    let total = 0;

    carrito.forEach(item => {
        const nombre = item.name.padEnd(maxNombreLength);
        const cantidad = String(item.quantity).padStart(5);
        const precioUnitario = String(item.price).padStart(8);
        const totalItem = String(item.price * item.quantity).padStart(10);

        factura += `${nombre} | ${cantidad} | ${precioUnitario}€ | ${totalItem}€\n`;
        total += item.price * item.quantity;
    });

    factura += `${'-'.repeat(maxNombreLength)}-------------------------------\n`;
    factura += `TOTAL:                       ${String(total).padStart(10)}€\n\n`;
    factura += '========================================\n';
    factura += '         ¡Gracias por su compra!        \n';
    factura += '========================================\n';

    setCarrito([]); // Usando setCarrito en lugar de carrito.value = []
    return factura;
};

  return { carrito, setCarrito, añadirAlCarrito, quitarDelCarrito, checkout };
};
