import React, { useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import ProductCard from '../components/organisms/ProductCard';
import { getMergedProducts } from '../utils/productLoader';
import Image from '../public/img/Fondo.webp'
function Products() {
  const [products, setProducts] = useState(() => getMergedProducts());

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'productos_admin') {
        setProducts(getMergedProducts());
      }
    };
    const onCustom = () => setProducts(getMergedProducts());
    window.addEventListener('storage', onStorage);
    window.addEventListener('productos_admin_updated', onCustom);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('productos_admin_updated', onCustom);
    };
  }, []);

  return (
    <Container className="my-5">
      <h1>Productos</h1>
      <Row>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Row>
    </Container>
  );
}

export default Products;
