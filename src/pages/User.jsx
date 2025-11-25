import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import bgImage from '../assets/img/Fondo.webp';

function User() {
  const [user, setUser] = useState({ name: '', email: '', address: '' });
  const [saved, setSaved] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {}

    try {
      const rawOrders = localStorage.getItem('orders');
      if (rawOrders) setOrders(JSON.parse(rawOrders));
    } catch (e) {}
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('user', JSON.stringify(user));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('user');
      setUser({ name: '', email: '', address: '' });
    } catch (e) {}
  };

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
        <h1 style={{ color: 'white' }}>Mi Cuenta</h1>
        <p style={{ color: 'white' }}>Gestiona tus datos y revisa tus pedidos.</p>

        <Row>
          <Col md={6} className="mb-4">
            <Card style={{ backgroundColor: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Card.Body>
                <Card.Title style={{ color: 'white' }}>Datos personales</Card.Title>
                {saved && <Alert variant="success">Datos guardados correctamente</Alert>}
                <Form onSubmit={handleSave}>
                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label style={{ color: 'white' }}>Nombre</Form.Label>
                    <Form.Control name="name" value={user.name} onChange={handleChange} />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label style={{ color: 'white' }}>Email</Form.Label>
                    <Form.Control type="email" name="email" value={user.email} onChange={handleChange} />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="address">
                    <Form.Label style={{ color: 'white' }}>Dirección</Form.Label>
                    <Form.Control name="address" value={user.address} onChange={handleChange} />
                  </Form.Group>
                  <div className="d-flex">
                    <Button variant="primary" type="submit">Guardar</Button>
                    <Button variant="secondary" className="ms-2" onClick={handleLogout}>Cerrar sesión</Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} className="mb-4">
            <Card style={{ backgroundColor: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Card.Body>
                <Card.Title style={{ color: 'white' }}>Pedidos</Card.Title>
                {orders.length === 0 ? (
                  <p style={{ color: 'white' }}>No tienes pedidos aún.</p>
                ) : (
                  orders.map((o) => (
                    <div key={o.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '10px 0' }}>
                      <strong style={{ color: 'white' }}>Pedido #{o.id}</strong>
                      <div style={{ color: 'white' }}>Total: ${o.total?.toLocaleString() ?? '0'}</div>
                      <div style={{ color: 'white', fontSize: '0.9rem' }}>{o.date}</div>
                    </div>
                  ))
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default User;
