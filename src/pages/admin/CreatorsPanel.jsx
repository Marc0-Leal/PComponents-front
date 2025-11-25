import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Form, Card, Row, Col } from 'react-bootstrap';
import ProductsData from '../../data/Products';

const AUTHORIZED_EMAILS = [
  'tu-email@ejemplo.com'
];
const CREATOR_PASSPHRASE = 'fullstack2025'; 

function CreatorsPanel() {
  const [authorized, setAuthorized] = useState(false);
  const [products, setProducts] = useState([]);
  const [passInput, setPassInput] = useState('');

  useEffect(() => {
    const overridesRaw = localStorage.getItem('productos_admin');
    const overrides = overridesRaw ? JSON.parse(overridesRaw) : [];

    const base = (ProductsData || []).map((p) => ({
      id: p.id,
      nombre: p.name || p.nombre,
      precio: p.price || p.precio || 0,
      imagenUrl: p.image || p.imagenUrl || null,
      descripcion: p.description || p.descripcion || '',
      stock: p.stock ?? null,
      disponible: p.disponible ?? true,
    }));

    const merged = base.map((b) => {
      const o = overrides.find((x) => x.id === b.id);
      return o ? { ...b, ...o } : b;
    });
    setProducts(merged);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const u = JSON.parse(raw);
        if (u.email && AUTHORIZED_EMAILS.includes(u.email)) setAuthorized(true);
      }
    } catch (e) {}
  }, []);

  const saveOverrides = (arr) => {
    try {
      localStorage.setItem('productos_admin', JSON.stringify(arr));
    } catch (e) {}
  };

  const handleSaveProduct = (idx) => {
    const prod = products[idx];
    const raw = localStorage.getItem('productos_admin');
    const arr = raw ? JSON.parse(raw) : [];
    const others = arr.filter((p) => p.id !== prod.id);
    others.push(prod);
    saveOverrides(others);
    alert('Producto guardado localmente.');
    setProducts((s) => [...s]);
    try {
      window.dispatchEvent(new CustomEvent('productos_admin_updated'));
    } catch (e) {}
  };

  const handleChange = (idx, field, value) => {
    setProducts((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const handleSaveAll = () => {
    saveOverrides(products);
    alert('Todos los cambios guardados localmente.');
    try {
      window.dispatchEvent(new CustomEvent('productos_admin_updated'));
    } catch (e) {}
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (passInput === CREATOR_PASSPHRASE) {
      setAuthorized(true);
      sessionStorage.setItem('creator_access', '1');
    } else {
      alert('Passphrase incorrecta');
    }
  };

  if (!authorized) {
    return (
      <Container className="my-5">
        <Card>
          <Card.Body>
            <Card.Title>Acceso de creadores</Card.Title>
            <p>Introduce la contraseña para acceder al panel de creadores.</p>
            <Form onSubmit={handleAuthSubmit}>
              <Form.Group>
                <Form.Control
                  type="password"
                  placeholder="Passphrase"
                  value={passInput}
                  onChange={(e) => setPassInput(e.target.value)}
                />
              </Form.Group>
              <div className="mt-3">
                <Button type="submit">Entrar</Button>
              </div>
            </Form>
            <hr />
            <p style={{ fontSize: '0.9rem' }}>
              Alternativamente, inicia sesión como uno de los correos autorizados.
            </p>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2>Panel de Creadores — Gestión rápida de productos</h2>
      <p>Aquí puedes cambiar stock, precio y disponibilidad. </p>

      <Row className="mb-3">
        <Col>
          <Button variant="primary" onClick={handleSaveAll}>Guardar todos</Button>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Disponible</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, idx) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td style={{ maxWidth: 220 }}>{p.nombre}</td>
              <td style={{ width: 140 }}>
                <Form.Control
                  value={p.precio}
                  onChange={(e) => handleChange(idx, 'precio', Number(e.target.value))}
                />
              </td>
              <td style={{ width: 120 }}>
                <Form.Control
                  value={p.stock ?? ''}
                  onChange={(e) => handleChange(idx, 'stock', e.target.value === '' ? null : Number(e.target.value))}
                />
              </td>
              <td style={{ width: 140 }}>
                <Form.Check
                  type="switch"
                  id={`disp-${p.id}`}
                  label={p.disponible === false ? 'No' : 'Sí'}
                  checked={p.disponible !== false}
                  onChange={(e) => handleChange(idx, 'disponible', e.target.checked)}
                />
              </td>
              <td>
                <Button size="sm" onClick={() => handleSaveProduct(idx)}>Guardar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default CreatorsPanel;
