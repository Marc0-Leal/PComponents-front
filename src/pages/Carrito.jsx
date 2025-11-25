import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import bgImage from '../assets/img/Fondo.webp';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

function Carrito() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const total = cart.reduce((acc, prod) => acc + prod.price * prod.quantity, 0);

  return (
    <div
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Container className="my-5 flex-grow-1">
        <h1 style={{ color: 'white' }}>Carrito de Compras</h1>
        <p style={{ color: 'white' }}>
          Revisa los productos que has agregado a tu carrito.
        </p>
        <Row className="mt-4">
          {cart.length === 0 && (
            <Col>
              <p style={{ color: 'white' }}>Tu carrito está vacío.</p>
            </Col>
          )}

          {cart.map((producto) => (
            <Col key={producto.id} md={4} className="mb-4">
              <Card
                className="h-100 text-center shadow"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white',
                }}
              >
                <Card.Img
                  variant="top"
                  src={producto.image}
                  alt={producto.name}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title style={{ color: 'white' }}>
                    {producto.name}
                  </Card.Title>
                  <Card.Text style={{ color: 'white' }}>
                    {producto.description}
                  </Card.Text>
                  <Card.Text style={{ color: 'white' }}>
                    <strong>Precio:</strong> ${producto.price.toLocaleString()}
                  </Card.Text>
                  <div style={{ color: 'white' }}>
                    <strong>Cantidad:</strong>
                    <div className="d-flex justify-content-center align-items-center mt-2">
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => updateQuantity(producto.id, producto.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="mx-2">{producto.quantity}</span>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => updateQuantity(producto.id, producto.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <Button variant="danger" className="mt-3" onClick={() => removeFromCart(producto.id)}>
                    Eliminar
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <div
          className="mt-4 p-3 rounded text-center"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white',
          }}
        >
          <h4>Total a pagar: ${total.toLocaleString()}</h4>
          <div className="d-flex flex-column align-items-center">
            {success && (
              <Alert variant="success">tu compra a sido procesada con exito</Alert>
            )}
            <Button
              variant="success"
              className="mt-3"
              onClick={() => {
                // procesar (simulado): vaciar carrito, mostrar mensaje y redirigir a inicio
                clearCart();
                setSuccess(true);
                setTimeout(() => navigate('/'), 1500);
              }}
            >
              Finalizar compra
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Carrito;