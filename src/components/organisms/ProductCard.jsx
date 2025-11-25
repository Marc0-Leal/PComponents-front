import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import Image from '../atoms/Image';
import Button from '../atoms/Button';
import CardBody from '../molecules/CardBody';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  return (
    <Card style={{ width: '18rem', position: 'relative' }} className="m-2">
      {!product.disponible && (
        <Badge
          bg="danger"
          style={{ position: 'absolute', right: 8, top: 8, zIndex: 2 }}
        >
          No disponible
        </Badge>
      )}
      <Image src={product.image} alt={product.name} className="card-img-top" />
      <Card.Body>
        <CardBody
          title={product.name}
          description={product.description}
          price={product.price}
        />
        <Button variant="primary" onClick={() => navigate(`/products/${product.id}`)}>
          Ver detalles
        </Button>
        <Button
          variant="success"
          className="ms-2"
          onClick={() => addToCart(product, 1)}
          disabled={product.disponible === false}
        >
          Agregar al carrito
        </Button>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
