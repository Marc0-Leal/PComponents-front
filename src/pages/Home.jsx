import React from 'react';
import { Container } from 'react-bootstrap';
import ProductCard from '../components/organisms/ProductCard';
import { getMergedProducts } from '../utils/productLoader';
import { useEffect, useState } from 'react';
import bgImage from '../assets/img/Fondo.webp';

function Home() {
  const [products, setProducts] = useState(() => getMergedProducts());

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'productos_admin') setProducts(getMergedProducts());
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
    <div style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed', minHeight: '100vh', color: 'white', display: 'flex', flexDirection: 'column' }}>
      <Container className="my-5 flex-grow-1">
        <h1>Página de Inicio</h1>
        <p>te damos la bienvenida a PComponents</p>
        <div className="d-flex flex-wrap justify-content-center">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </div>
  );
}

export default Home;
