import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function InicioSesion() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const AUTHORIZED_EMAILS = ['tu-email@ejemplo.com'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      const isCreator = AUTHORIZED_EMAILS.includes(email);
      const usuario = {
        email,
        isCreator,
        rol: isCreator ? { id: 2, nombre: 'admin' } : { id: 1, nombre: 'user' },
      };
      login(usuario);
      navigate('/');
    } else {
      setError('Por favor, ingresa tu correo y contraseña.');
    }
  };

  return (
    <Container className="my-5">
      <h1>Iniciar Sesión</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicEmail" className="mb-3">
          <Form.Label>Correo Electrónico</Form.Label>
          <Form.Control
            type="email"
            placeholder="Ingresa tu correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword" className="mb-3">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Iniciar Sesión
        </Button>
      </Form>
    </Container>
  );
}

export default InicioSesion;
