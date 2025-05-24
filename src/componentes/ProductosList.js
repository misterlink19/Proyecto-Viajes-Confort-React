import React from 'react';
import ProductosCard from './ProductosCard';

const ProductosList = ({ categorias, onAddToCart }) => {
  if (categorias.length === 0) {
    return <p>No hay productos disponibles.</p>;
  }

  // Si solo hay una categoría, muestra su nombre como título
  if (categorias.length === 1) {
    const categoria = categorias[0];
    return (
      <div>
        <h2>{categoria.name}</h2>
        {categoria.products.length > 0 ? (
          categoria.products.map(producto => (
            <ProductosCard key={producto.id} producto={producto} onAddToCart={onAddToCart} />
          ))
        ) : (
          <p>No hay productos en esta categoría.</p>
        )}
      </div>
    );
  }

  // Si hay múltiples categorías, muestra cada categoría con su título
  return (
    <div>
      {categorias.map(categoria => (
        <div key={categoria.id}>
          <h2>{categoria.name}</h2>
          {categoria.products.length > 0 ? (
            categoria.products.map(producto => (
              <ProductosCard key={producto.id} producto={producto} onAddToCart={onAddToCart} />
            ))
          ) : (
            <p>No hay productos en esta categoría.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductosList;