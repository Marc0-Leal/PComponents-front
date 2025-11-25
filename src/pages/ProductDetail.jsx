import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { getProductById } from '../utils/productLoader';
import { useEffect, useState } from 'react';
import Image from '../components/atoms/Image.jsx';
import Text from '../components/atoms/Text.jsx';
import Button from '../components/atoms/Button.jsx';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(() => getProductById(id));

  useEffect(() => {
    setProduct(getProductById(id));
    const onCustom = () => setProduct(getProductById(id));
    window.addEventListener('productos_admin_updated', onCustom);
    window.addEventListener('storage', (e) => { if (e.key === 'productos_admin') onCustom(); });
    return () => {
      window.removeEventListener('productos_admin_updated', onCustom);
    };
  }, [id]);

  if (!product) {
    return (
      <Container className="my-5">
        <h1>Producto no encontrado</h1>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Button variant="primary" onClick={() => navigate(`/products`)}>
          Volver
        </Button>
      {!product.disponible && (
        <Alert variant="danger" className="mt-3">Este producto no está disponible.</Alert>
      )}
      <Card>
        <Image src={product.image} alt={product.name} className="card-img-top" />
        <Card.Body>
          <Text variant="h2">{product.name}</Text>
          <Text variant="p">{product.description}</Text>
          <Text variant="h4">${product.price}</Text>
          {product.stock !== null && (
            <Text variant="p">Stock: {product.stock}</Text>
          )}
        </Card.Body>

      </Card>
    </Container>
  );
}

export default ProductDetail;


